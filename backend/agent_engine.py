"""
FleetMind AI - Agente de Acao
Este e o "cerebro" que age em tempo real: para cada situacao nova detectada
pelo motor de situacoes (backend/situations_engine.py), o Agente de IA decide
e EXECUTA uma acao imediatamente (ex.: instrui o motorista a reduzir a
velocidade, recalcula e envia uma rota alternativa) e monitora o resultado.
Quando o motorista nao responde ou a severidade e critica, o proprio agente
escala o caso para um operador humano.

Tambem processa relatos por voz dos motoristas (transcritos em texto neste
prototipo) e propaga o evento para os demais veiculos na mesma rota,
simulando a "inteligencia coletiva" da rede FleetMind.
"""
import random
import re
import unicodedata
from datetime import datetime

import pandas as pd

from backend.situations_engine import ensure_schema

OPERATORS = ["Ana Souza", "Carlos Lima", "Beatriz Rocha", "Diego Martins"]

ROAD_EVENT_RULES = [
    (["acidente", "bateu", "colisao", "capotou", "capotamento"], "acidente", "critica", 45),
    (["interditad", "bloquead", "fechad", "pista fechada"], "via_interditada", "critica", 50),
    (["alagad", "enchente", "chuva forte", "chovendo muito", "temporal"], "clima_severo", "alta", 30),
    (["engarrafamento", "transito intenso", "transito parado", "lentidao", "congestionamento"],
     "transito_intenso", "media", 20),
    (["buraco", "asfalto danificado", "pista ruim", "cratera"], "buraco_pista", "baixa", 12),
    (["barulho estranho", "quebrad", "pane", "fumaca", "fumaça", "superaquecendo", "cheiro de queimado"],
     "veiculo_com_defeito", "alta", 0),
]


def _norm(text: str) -> str:
    text = text.lower().strip()
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")


def classify_road_event(text: str):
    t = _norm(text)
    for keywords, event_type, severity, risk_bonus in ROAD_EVENT_RULES:
        if any(k in t for k in keywords):
            return event_type, severity, risk_bonus
    return "outro", "media", 15


def _log_action(cur, situation_id, vehicle_id, driver_id, actor, action_type, message, now):
    cur.execute(
        """INSERT INTO agent_actions (situation_id, vehicle_id, driver_id, actor, action_type, message, timestamp)
           VALUES (?,?,?,?,?,?,?)""",
        (situation_id, vehicle_id, driver_id, actor, action_type, message, now),
    )


def _decide_and_act(cur, row, now):
    """O Agente de IA decide o que fazer com uma situacao recem-detectada e
    registra cada acao executada. Retorna o novo status da situacao."""
    situation_id, vtype, severity, score = row["id"], row["type"], row["severity"], row["score"]
    vehicle_id, driver_id = row["vehicle_id"], row["driver_id"]
    driver_name = row["driver_name"] or "o motorista"
    plate = row["plate"] or "o veículo"

    def log(actor, action_type, message):
        _log_action(cur, situation_id, vehicle_id, driver_id, actor, action_type, message, now)

    if vtype == "atencao_motorista":
        log("ia_agente", "instrucao_motorista",
            f"IA ligou para {driver_name} e instruiu: \"Reduza a velocidade agora e faça uma pausa de "
            f"15 min no próximo ponto de apoio.\"")
        compliance_prob = max(0.12, 1 - float(score) / 120)
        if random.random() < compliance_prob:
            log("motorista", "confirmacao_motorista",
                f"{driver_name} reduziu a velocidade e confirmou a pausa programada.")
            return "resolvido"
        operator = random.choice(OPERATORS)
        log("ia_agente", "escalonamento_humano",
            f"{driver_name} não respondeu em tempo hábil. IA escalou o caso para o operador {operator}.")
        log("operador_humano", "ligacao_motorista",
            f"{operator} ligou para {driver_name} e reforçou a orientação de segurança.")
        return "escalado_humano"

    if vtype in ("manutencao_urgente", "alerta_critico"):
        log("ia_agente", "instrucao_motorista",
            f"IA instruiu o motorista de {plate}: \"Reduza a velocidade e siga para o ponto de apoio "
            f"mais próximo.\"")
        if severity == "critica":
            operator = random.choice(OPERATORS)
            log("ia_agente", "escalonamento_humano",
                f"Parâmetro crítico detectado em {plate} — IA escalou automaticamente para o operador "
                f"{operator} e acionou a equipe de manutenção.")
            log("operador_humano", "ligacao_motorista",
                f"{operator} entrou em contato com {driver_name} para confirmar a parada segura.")
            return "escalado_humano"
        return "ia_atuando"

    if vtype == "alterar_rota":
        log("ia_agente", "recalculo_rota",
            "IA recalculou a rota em tempo real e enviou o desvio para o aplicativo do motorista, "
            "evitando o trecho de risco.")
        log("motorista", "confirmacao_motorista", f"{driver_name} confirmou o recebimento da nova rota.")
        return "resolvido"

    if vtype == "risco_atraso":
        log("ia_agente", "notificacao_cliente",
            "IA notificou automaticamente o cliente sobre o atraso estimado e sugeriu nova janela de entrega.")
        return "ia_atuando"

    log("ia_agente", "instrucao_motorista", "IA registrou a situação e está monitorando.")
    return "ia_atuando"


def process_new_situations(conn):
    """Varre situacoes com status 'novo' e faz o Agente de IA agir imediatamente."""
    ensure_schema(conn)
    now = datetime.utcnow().isoformat()
    df = pd.read_sql(
        """
        SELECT s.*, v.plate AS plate, d.name AS driver_name
        FROM situations s
        LEFT JOIN vehicles v ON v.id = s.vehicle_id
        LEFT JOIN drivers d ON d.id = s.driver_id
        WHERE s.status = 'novo'
        """,
        conn,
    )
    if df.empty:
        return 0
    cur = conn.cursor()
    for _, row in df.iterrows():
        new_status = _decide_and_act(cur, row, now)
        cur.execute("UPDATE situations SET status = ?, updated_at = ? WHERE id = ?", (new_status, now, row["id"]))
    conn.commit()
    return len(df)


def register_road_event(conn, driver_id, vehicle_id, trip_id, description):
    """Recebe o relato (transcrito) de um motorista, classifica com IA e propaga
    o impacto para os demais veiculos na mesma rota (inteligencia coletiva)."""
    ensure_schema(conn)
    now = datetime.utcnow().isoformat()
    cur = conn.cursor()

    trip = cur.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
    if trip is None:
        raise ValueError("viagem nao encontrada")

    event_type, severity, risk_bonus = classify_road_event(description)
    origin, dest = trip["origin_city"], trip["destination_city"]

    cur.execute(
        """INSERT INTO road_events
           (reported_by_driver_id, vehicle_id, trip_id, origin_city, destination_city,
            event_type, description, severity, timestamp, resolved)
           VALUES (?,?,?,?,?,?,?,?,?,0)""",
        (driver_id, vehicle_id, trip_id, origin, dest, event_type, description, severity, now),
    )

    affected_trip_ids = []
    if event_type == "veiculo_com_defeito":
        dedupe_key = f"alerta_critico:{vehicle_id}::"
        cur.execute("SELECT id FROM situations WHERE dedupe_key = ? AND status != 'resolvido'", (dedupe_key,))
        existing = cur.fetchone()
        title = "Motorista relatou problema no veículo por voz"
        desc = f'Relato do motorista: "{description}"'
        action = "Verificar o veículo imediatamente e avaliar necessidade de troca."
        if existing:
            cur.execute(
                """UPDATE situations SET title=?, description=?, recommended_action=?, severity=?,
                   score=?, status='novo', updated_at=? WHERE id=?""",
                (title, desc, action, severity, 85, now, existing["id"]),
            )
        else:
            cur.execute(
                """INSERT INTO situations
                   (type, vehicle_id, driver_id, trip_id, title, description, recommended_action,
                    severity, status, score, dedupe_key, created_at, updated_at)
                   VALUES ('alerta_critico',?,?,?,?,?,?,?,'novo',?,?,?,?)""",
                (vehicle_id, driver_id, trip_id, title, desc, action, severity, 85, dedupe_key, now, now),
            )
        affected_trip_ids = [trip_id]
    else:
        rows = cur.execute(
            """SELECT id, route_risk_score FROM trips WHERE status = 'em_andamento'
               AND ((origin_city = ? AND destination_city = ?) OR (origin_city = ? AND destination_city = ?))""",
            (origin, dest, dest, origin),
        ).fetchall()
        for r in rows:
            new_score = min(100.0, r["route_risk_score"] + risk_bonus)
            cur.execute("UPDATE trips SET route_risk_score = ? WHERE id = ?", (new_score, r["id"]))
            affected_trip_ids.append(r["id"])

    conn.commit()
    return {
        "event_type": event_type,
        "severity": severity,
        "affected_trips": len(affected_trip_ids),
    }
