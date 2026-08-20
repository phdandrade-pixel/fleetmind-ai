"""
FleetMind AI - Motor de Situacoes Operacionais
Converte scores preditivos + alertas de telemetria + relatos da rede de
motoristas em "situacoes" acionaveis para o painel Kanban: veiculos que
precisam de manutencao urgente, motoristas que precisam de apoio, viagens
que precisam de mudanca de rota e entregas com risco de atraso.

As situacoes sao persistidas na tabela `situations`. O status e controlado
pelo Agente de Acao (backend/agent_engine.py), que decide e executa acoes em
tempo real (novo -> ia_atuando / escalado_humano -> resolvido).
"""
from datetime import datetime

import pandas as pd

from backend.scoring import score_vehicles, score_drivers

VEHICLE_TOP_N = 15
DRIVER_TOP_N = 15
ROUTE_RISK_THRESHOLD = 55
DELAY_THRESHOLD_MIN = 25
MIN_SCORE_FLOOR = 55

TYPE_META = {
    "manutencao_urgente": {"label": "Manutenção Urgente", "icon": "🔧"},
    "atencao_motorista": {"label": "Atenção ao Motorista", "icon": "🧑‍✈️"},
    "alterar_rota": {"label": "Alteração de Rota", "icon": "🗺️"},
    "risco_atraso": {"label": "Risco de Atraso", "icon": "⏱️"},
    "alerta_critico": {"label": "Alerta Crítico", "icon": "🚨"},
}

ALERT_TYPE_MAP = {
    "temperatura_motor": ("manutencao_urgente", "Temperatura do motor fora da faixa segura"),
    "pressao_oleo_baixa": ("manutencao_urgente", "Pressão de óleo criticamente baixa"),
    "colisao_iminente": ("alerta_critico", "Risco de colisão detectado pelo ADAS"),
    "fadiga_motorista": ("atencao_motorista", "Sinais de fadiga acima do limite"),
    "clima_severo": ("alterar_rota", "Condição climática severa na rota atual"),
    "desvio_rota": ("alterar_rota", "Rota atual com risco elevado"),
    "pneu_pressao_baixa": ("alerta_critico", "Pressão de pneu abaixo do recomendado"),
    "frenagem_brusca": ("alerta_critico", "Padrão de frenagens bruscas detectado"),
}


def ensure_schema(conn):
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS situations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            vehicle_id INTEGER,
            driver_id INTEGER,
            trip_id INTEGER,
            title TEXT,
            description TEXT,
            recommended_action TEXT,
            severity TEXT,
            status TEXT DEFAULT 'novo',
            score REAL,
            dedupe_key TEXT,
            created_at TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS agent_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            situation_id INTEGER,
            vehicle_id INTEGER,
            driver_id INTEGER,
            actor TEXT,
            action_type TEXT,
            message TEXT,
            timestamp TEXT
        );

        CREATE TABLE IF NOT EXISTS road_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reported_by_driver_id INTEGER,
            vehicle_id INTEGER,
            trip_id INTEGER,
            origin_city TEXT,
            destination_city TEXT,
            event_type TEXT,
            description TEXT,
            severity TEXT,
            timestamp TEXT,
            resolved INTEGER DEFAULT 0
        );
        """
    )
    conn.commit()


def _severity_from_score(score):
    if score >= 90:
        return "critica"
    if score >= 75:
        return "alta"
    if score >= 60:
        return "media"
    return "baixa"


def _upsert(conn, now, type_, vehicle_id, driver_id, trip_id, title, description, action, severity, score):
    dedupe_key = f"{type_}:{vehicle_id or ''}:{driver_id or ''}:{trip_id or ''}"
    cur = conn.cursor()
    cur.execute(
        "SELECT id FROM situations WHERE dedupe_key = ? AND status != 'resolvido'",
        (dedupe_key,),
    )
    existing = cur.fetchone()
    if existing:
        cur.execute(
            """UPDATE situations SET title=?, description=?, recommended_action=?,
               severity=?, score=?, updated_at=? WHERE id=?""",
            (title, description, action, severity, score, now, existing["id"]),
        )
    else:
        cur.execute(
            """INSERT INTO situations
               (type, vehicle_id, driver_id, trip_id, title, description, recommended_action,
                severity, status, score, dedupe_key, created_at, updated_at)
               VALUES (?,?,?,?,?,?,?,?,'novo',?,?,?,?)""",
            (type_, vehicle_id, driver_id, trip_id, title, description, action,
             severity, score, dedupe_key, now, now),
        )


def _route_event_note(road_events_df, origin, dest):
    """Retorna um texto com o ultimo relato da rede de motoristas para a rota, se houver."""
    if road_events_df.empty:
        return None
    m = road_events_df[
        (((road_events_df["origin_city"] == origin) & (road_events_df["destination_city"] == dest))
         | ((road_events_df["origin_city"] == dest) & (road_events_df["destination_city"] == origin)))
        & (road_events_df["event_type"] != "veiculo_com_defeito")
    ]
    if m.empty:
        return None
    ev = m.sort_values("timestamp", ascending=False).iloc[0]
    return f'Rede de motoristas reportou por voz: "{ev["description"]}" ({ev["event_type"].replace("_", " ")}).'


def refresh_situations(conn, vehicles, drivers, telemetry, maintenance, behavior, trips, alerts):
    """Recalcula os scores e sincroniza a tabela `situations`. Nao decide acoes:
    isso e responsabilidade do Agente de Acao (agent_engine.process_new_situations)."""
    ensure_schema(conn)
    now = datetime.utcnow().isoformat()

    v_scored = score_vehicles(vehicles, telemetry, maintenance)
    d_scored = score_drivers(drivers, behavior)
    road_events_df = pd.read_sql("SELECT * FROM road_events WHERE resolved = 0", conn)

    # 1) Manutencao urgente - top N veiculos por risco de falha
    top_v = v_scored[v_scored["failure_risk_score"] >= MIN_SCORE_FLOOR].head(VEHICLE_TOP_N)
    for _, row in top_v.iterrows():
        _upsert(
            conn, now, "manutencao_urgente", int(row["id"]), None, None,
            f"Veículo {row['plate']} com risco de falha mecânica",
            f"{row['model']} • temp. média motor {row['avg_engine_temp']:.1f}°C • "
            f"pressão mín. óleo {row['min_oil_pressure']:.1f} psi • "
            f"desgaste de freio {row['avg_brake_wear']:.0f}%.",
            "Agendar manutenção preventiva imediata e retirar o veículo de rotas longas até a inspeção.",
            _severity_from_score(row["failure_risk_score"]), row["failure_risk_score"],
        )

    # 2) Atencao ao motorista - top N motoristas por risco/apoio
    top_d = d_scored[d_scored["support_risk_score"] >= MIN_SCORE_FLOOR].head(DRIVER_TOP_N)
    for _, row in top_d.iterrows():
        _upsert(
            conn, now, "atencao_motorista", None, int(row["id"]), None,
            f"Motorista {row['name']} precisa de apoio",
            f"Fadiga média {row['avg_fatigue']:.0f}/100 • excesso de velocidade médio "
            f"{row['avg_speeding']:.1f} eventos/viagem • score geral {row['avg_overall_score']:.0f}.",
            "Instruir o motorista a reduzir a velocidade e fazer uma pausa agora.",
            _severity_from_score(row["support_risk_score"]), row["support_risk_score"],
        )

    # 3) Alteracao de rota - viagens em andamento com risco de rota elevado
    #    (inclui rotas afetadas por relatos de voz de outros motoristas na rede)
    live = trips[trips["status"] == "em_andamento"]
    for _, row in live[live["route_risk_score"] >= ROUTE_RISK_THRESHOLD].iterrows():
        note = _route_event_note(road_events_df, row["origin_city"], row["destination_city"])
        desc = (
            f"Clima: {row['weather']} • trânsito {row['traffic_level']} • "
            f"risco de rota {row['route_risk_score']:.0f}/100."
        )
        if note:
            desc = f"{note} {desc}"
        _upsert(
            conn, now, "alterar_rota", int(row["vehicle_id"]), int(row["driver_id"]), int(row["id"]),
            f"Rota {row['origin_city']} → {row['destination_city']} com risco elevado",
            desc,
            "Recalcular a rota agora e enviar o desvio ao motorista.",
            _severity_from_score(row["route_risk_score"]), row["route_risk_score"],
        )

    # 4) Risco de atraso na entrega
    for _, row in live[live["delay_minutes"] >= DELAY_THRESHOLD_MIN].iterrows():
        score = min(100, row["delay_minutes"] * 1.5)
        _upsert(
            conn, now, "risco_atraso", int(row["vehicle_id"]), int(row["driver_id"]), int(row["id"]),
            f"Entrega {row['origin_city']} → {row['destination_city']} com risco de atraso",
            f"Atraso estimado de {row['delay_minutes']:.0f} minutos em relação ao planejado.",
            "Notificar o cliente e replanejar a janela de entrega.",
            _severity_from_score(score), score,
        )

    # 5) Alertas criticos de telemetria/comportamento nao resolvidos
    open_alerts = alerts[(alerts["resolved"] == 0) & (alerts["severity"].isin(["critica", "alta"]))]
    open_alerts = open_alerts.sort_values("timestamp", ascending=False).drop_duplicates(
        subset=["vehicle_id", "type"], keep="first"
    )
    for _, row in open_alerts.head(25).iterrows():
        type_, label = ALERT_TYPE_MAP.get(row["type"], ("alerta_critico", row["type"]))
        score = 92 if row["severity"] == "critica" else 78
        _upsert(
            conn, now, type_, int(row["vehicle_id"]), row["driver_id"], row["trip_id"],
            label, row["message"], "Verificar o alerta de telemetria e confirmar ação com a equipe em campo.",
            row["severity"], score,
        )

    conn.commit()


def fetch_situations(conn):
    df = pd.read_sql(
        """
        SELECT s.*, v.plate AS plate, d.name AS driver_name
        FROM situations s
        LEFT JOIN vehicles v ON v.id = s.vehicle_id
        LEFT JOIN drivers d ON d.id = s.driver_id
        ORDER BY s.updated_at DESC
        """,
        conn,
    )
    for col in ("vehicle_id", "driver_id", "trip_id"):
        df[col] = df[col].astype("Int64")
    return df
