"""
FleetMind AI - Dashboard (Streamlit)
Tela principal em formato Kanban (painel operacional) apontando quais
veiculos/motoristas precisam de atencao agora, alem de visao geral da frota,
ranking de risco preditivo, alertas em tempo (quase) real e o
Copiloto/Super Agente de IA para perguntas em linguagem natural.

Uso:
    streamlit run frontend/app.py
"""
import base64
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import pandas as pd
import plotly.express as px
import requests
import streamlit as st

import os


def _get_api_url() -> str:
    """Em produção (Streamlit Community Cloud), defina API_URL em st.secrets ou
    na variável de ambiente, apontando para o backend hospedado (ex.: Render).
    Localmente, cai no padrão http://127.0.0.1:8000."""
    try:
        if "API_URL" in st.secrets:
            return st.secrets["API_URL"]
    except Exception:
        pass
    return os.environ.get("API_URL", "http://127.0.0.1:8000")


API_URL = _get_api_url()
ASSETS_DIR = Path(__file__).parent.parent / "assets"


def _logo_data_uri(filename: str) -> str | None:
    path = ASSETS_DIR / filename
    if not path.exists():
        return None
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode()


LOGO_ICON_URI = _logo_data_uri("logo_icon_transparent.png")
LOGO_FULL_URI = _logo_data_uri("logo.png")

st.set_page_config(
    page_title="FleetMind AI",
    page_icon=str(ASSETS_DIR / "logo_icon.png") if (ASSETS_DIR / "logo_icon.png").exists() else "🚚",
    layout="wide",
)

# Paleta oficial da marca FleetMind AI
FM_NAVY = "#001028"
FM_NAVY_2 = "#0C2440"   # navy secundario (cards/bordas sobre navy)
FM_TEAL = "#007880"
FM_TEAL_LIGHT = "#4FD1D9"  # teal claro, para texto/acento sobre fundo navy
FM_GRAY_BG = "#E9EEF2"
FM_GRAY_TEXT = "#4A5560"

CUSTOM_CSS = f"""
<style>
.big-title {{ font-size: 2.1rem; font-weight: 800; color: {FM_NAVY}; display: flex; align-items: center; gap: 0.6rem; }}
.big-title img {{ height: 2.4rem; width: auto; }}
.subtitle {{ color: {FM_GRAY_TEXT}; margin-top: -8px; }}
div[data-testid="stMetric"] {{
    background: {FM_NAVY}; border-radius: 12px; padding: 14px 18px; border: 1px solid {FM_NAVY_2};
}}
div[data-testid="stMetric"] [data-testid="stMetricLabel"] {{ color: #AFC3CC !important; }}
div[data-testid="stMetric"] [data-testid="stMetricValue"] {{ color: #FFFFFF !important; }}
div[data-testid="stMetric"] [data-testid="stMetricDelta"] {{ color: #FFFFFF !important; }}
div[data-testid="stMetric"] [data-testid="stMetricLabel"] p {{ color: #AFC3CC !important; }}
.kanban-col-title {{
    font-weight: 700; font-size: 1.05rem; padding: 8px 10px; border-radius: 8px;
    margin-bottom: 10px; text-align: center; color: #FFFFFF !important;
}}
.kanban-card {{
    border-radius: 10px; padding: 12px 14px; margin-bottom: 12px;
    background: {FM_NAVY}; border: 1px solid {FM_NAVY_2}; border-left: 5px solid var(--sev-color);
}}
.kanban-card .badge {{
    display: inline-block; font-size: 0.72rem; font-weight: 700; padding: 2px 8px;
    border-radius: 999px; background: var(--sev-color); color: {FM_NAVY}; margin-bottom: 6px;
}}
.kanban-card .card-title {{ font-weight: 700; font-size: 0.95rem; margin: 2px 0 4px 0; color: #FFFFFF !important; }}
.kanban-card .card-desc {{ font-size: 0.82rem; color: #AFC3CC; margin-bottom: 6px; }}
.kanban-card .card-action {{ font-size: 0.82rem; color: {FM_TEAL_LIGHT}; }}
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

SEVERITY_COLOR = {"critica": "#ef4444", "alta": "#f97316", "media": "#eab308", "baixa": "#22c55e"}
TYPE_LABEL = {
    "manutencao_urgente": "🔧 Manutenção Urgente",
    "atencao_motorista": "🧑‍✈️ Atenção ao Motorista",
    "alterar_rota": "🗺️ Alteração de Rota",
    "risco_atraso": "⏱️ Risco de Atraso",
    "alerta_critico": "🚨 Alerta Crítico",
}


@st.cache_data(ttl=30)
def api_get(path, params=None):
    r = requests.get(f"{API_URL}{path}", params=params, timeout=15)
    r.raise_for_status()
    return r.json()


def api_get_fresh(path, params=None):
    r = requests.get(f"{API_URL}{path}", params=params, timeout=20)
    r.raise_for_status()
    return r.json()


def api_post(path, payload):
    r = requests.post(f"{API_URL}{path}", json=payload, timeout=30)
    r.raise_for_status()
    return r.json()


def api_patch(path, payload):
    r = requests.patch(f"{API_URL}{path}", json=payload, timeout=15)
    r.raise_for_status()
    return r.json()


_logo_img = f'<img src="{LOGO_ICON_URI}" alt="FleetMind AI" />' if LOGO_ICON_URI else "🚚"
st.markdown(f'<div class="big-title">{_logo_img} FleetMind AI</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">A inteligência que move o transporte</div>', unsafe_allow_html=True)
st.write("")

try:
    summary = api_get("/summary")
except requests.exceptions.ConnectionError:
    st.error(
        "Não foi possível conectar ao backend do FleetMind AI. "
        "Inicie a API com: `uvicorn backend.main:app --reload --port 8000`"
    )
    st.stop()

tab_kanban, tab_overview, tab_vehicles, tab_drivers, tab_alerts, tab_copilot = st.tabs(
    ["🗂️ Painel Operacional", "📊 Visão Geral", "🚛 Veículos", "🧑‍✈️ Motoristas", "🚨 Alertas", "🚚 Copiloto de IA"]
)

# ---------------- KANBAN (PAINEL OPERACIONAL) ----------------
with tab_kanban:
    st.subheader("O Agente de IA já está agindo — veja o que está acontecendo agora")
    st.caption(
        "A IA detecta a situação, decide e executa a ação em tempo real (instrui o motorista, "
        "recalcula a rota, notifica o cliente...). Quando o motorista não responde ou o risco é "
        "crítico, o próprio agente escala o caso para um operador humano. Clique em cada grupo "
        "para explorar os casos individuais e a linha do tempo de ações."
    )

    with st.expander("🎙️ Central de Comunicação — motorista relata por voz o que vê na via", expanded=False):
        st.caption(
            "Simulação: o áudio do motorista é transcrito e enviado à IA, que classifica o evento "
            "(acidente, via interditada, trânsito, defeito no veículo...) e propaga o alerta para os "
            "demais veículos que trafegam pela mesma rota — a inteligência coletiva da rede."
        )
        try:
            live_trips_raw = api_get_fresh("/trips", {"status": "em_andamento", "limit": 300})
        except requests.exceptions.ConnectionError:
            live_trips_raw = []
        live_trips = pd.DataFrame(live_trips_raw)

        if live_trips.empty:
            st.info("Nenhuma viagem em andamento no momento.")
        else:
            drivers_map = {d["id"]: d["name"] for d in api_get("/drivers")}
            vehicles_map = {v["id"]: v["plate"] for v in api_get("/vehicles")}
            live_trips["label"] = live_trips.apply(
                lambda r: f"{vehicles_map.get(r['vehicle_id'], '?')} • "
                          f"{drivers_map.get(r['driver_id'], '?')} • "
                          f"{r['origin_city']} → {r['destination_city']}",
                axis=1,
            )
            chosen_label = st.selectbox("Motorista/viagem que está relatando", live_trips["label"])
            chosen_trip_id = int(live_trips.loc[live_trips["label"] == chosen_label, "id"].iloc[0])

            presets = {
                "🚧 Acidente com pista parcialmente interditada": "Acidente à frente, a pista está parcialmente interditada",
                "🚦 Trânsito parado por obras": "Trânsito intenso e parado por causa de obras na pista",
                "🌧 Chuva forte alagando a via": "Chuva muito forte, a via está alagando em alguns pontos",
                "🔧 Barulho estranho no motor": "Estou ouvindo um barulho estranho no motor, parece que vai quebrar",
            }
            pcols = st.columns(len(presets))
            preset_clicked = None
            for pc, (label, _) in zip(pcols, presets.items()):
                if pc.button(label, use_container_width=True, key=f"preset_{label}"):
                    preset_clicked = label

            transcript = st.text_area(
                "Transcrição do áudio (ou edite/dite livremente)",
                value=presets.get(preset_clicked, ""),
                key="voice_transcript",
            )
            if st.button("📢 Enviar relato à IA", type="primary"):
                text = transcript or presets.get(preset_clicked, "")
                if text.strip():
                    result = api_post("/road-events", {"trip_id": chosen_trip_id, "description": text})
                    st.success(
                        f"IA classificou como **{result['event_type'].replace('_',' ')}** "
                        f"(severidade {result['severity']}) e já atuou em "
                        f"**{result['affected_trips']} viagem(ns)** afetada(s) na rede."
                    )
                    api_get.clear()
                    st.rerun()
                else:
                    st.warning("Digite ou selecione um relato antes de enviar.")

    top_col1, top_col2 = st.columns([3, 1])
    with top_col1:
        type_filter = st.multiselect(
            "Filtrar por tipo de situação",
            options=list(TYPE_LABEL.keys()),
            format_func=lambda k: TYPE_LABEL[k],
        )
    with top_col2:
        st.write("")
        if st.button("🔄 Atualizar painel", use_container_width=True):
            api_get.clear()

    try:
        situations = pd.DataFrame(api_get_fresh("/situations"))
        actions_log = pd.DataFrame(api_get_fresh("/agent-actions", {"limit": 1000}))
    except requests.exceptions.ConnectionError:
        st.error("Não foi possível conectar ao backend do FleetMind AI.")
        situations = pd.DataFrame()
        actions_log = pd.DataFrame()

    if not situations.empty and type_filter:
        situations = situations[situations["type"].isin(type_filter)]

    # KPIs do agente
    k1, k2, k3, k4 = st.columns(4)
    ia_action_count = int((actions_log["actor"] == "ia_agente").sum()) if not actions_log.empty else 0
    acting_now = int((situations["status"] == "ia_atuando").sum()) if not situations.empty else 0
    escalated = int((situations["status"] == "escalado_humano").sum()) if not situations.empty else 0
    resolved = int((situations["status"] == "resolvido").sum()) if not situations.empty else 0
    k1.metric("Ações executadas pela IA", ia_action_count)
    k2.metric("IA atuando agora", acting_now)
    k3.metric("Escalados para humano", escalated)
    k4.metric("Resolvidos", resolved)

    ACTOR_ICON = {"ia_agente": "🚚", "operador_humano": "🧑‍💼", "motorista": "🧑‍✈️"}

    def render_card(row, actions_log):
        sev_color = SEVERITY_COLOR.get(row["severity"], FM_GRAY_TEXT)
        subject = row.get("plate") or row.get("driver_name") or ""
        st.markdown(
            f"""
            <div class="kanban-card" style="--sev-color:{sev_color}">
                <span class="badge">{row['severity'].upper()}</span>
                <div class="card-title">{row['title']}</div>
                <div class="card-desc">{subject + ' • ' if subject else ''}{row['description']}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        acts = (
            actions_log[actions_log["situation_id"] == row["id"]].sort_values("timestamp")
            if not actions_log.empty else pd.DataFrame()
        )
        # st.expander/st.popover nao podem ficar aninhados dentro do expander do grupo,
        # entao a linha do tempo usa um toggle simples guardado no session_state.
        toggle_key = f"show_timeline_{row['id']}"
        st.session_state.setdefault(toggle_key, False)
        if st.button(f"🕓 Linha do tempo da IA ({len(acts)} ação(ões))", key=f"btn_{toggle_key}", use_container_width=True):
            st.session_state[toggle_key] = not st.session_state[toggle_key]
        if st.session_state[toggle_key]:
            if acts.empty:
                st.caption("Nenhuma ação registrada ainda.")
            else:
                for _, a in acts.iterrows():
                    icon = ACTOR_ICON.get(a["actor"], "•")
                    hhmm = a["timestamp"][11:16] if isinstance(a["timestamp"], str) and len(a["timestamp"]) > 16 else ""
                    st.markdown(f"{icon} **{hhmm}** — {a['message']}")
        c1, c2 = st.columns(2)
        if row["status"] != "resolvido":
            if c1.button("✅ Marcar resolvido", key=f"resolve_{row['id']}", use_container_width=True):
                api_patch(f"/situations/{int(row['id'])}", {"status": "resolvido"})
                api_get.clear()
                st.rerun()
            if row["status"] != "escalado_humano":
                if c2.button("🧑‍💼 Escalar p/ humano", key=f"escalate_{row['id']}", use_container_width=True):
                    api_patch(f"/situations/{int(row['id'])}", {"status": "escalado_humano"})
                    api_get.clear()
                    st.rerun()
        else:
            if c1.button("↩ Reabrir", key=f"reopen_{row['id']}", use_container_width=True):
                api_patch(f"/situations/{int(row['id'])}", {"status": "ia_atuando"})
                api_get.clear()
                st.rerun()

    columns_spec = [
        ("ia_atuando", "🚚 IA Atuando Agora", FM_TEAL),
        ("escalado_humano", "🧑‍💼 Escalado para Operador", "#8A5A22"),
        ("resolvido", "✅ Resolvido", "#1E6B4F"),
    ]

    kcols = st.columns(3)
    for kcol, (status_key, title, color) in zip(kcols, columns_spec):
        with kcol:
            subset = situations[situations["status"] == status_key] if not situations.empty else pd.DataFrame()
            st.markdown(
                f'<div class="kanban-col-title" style="background:{color}">{title} ({len(subset)})</div>',
                unsafe_allow_html=True,
            )
            if subset.empty:
                st.caption("Nenhuma situação nesta coluna.")
                continue

            group_limit = 15 if status_key != "resolvido" else 8
            for type_key, group in subset.groupby("type"):
                type_label = TYPE_LABEL.get(type_key, type_key)
                crit = int((group["severity"] == "critica").sum())
                header = f"{type_label} — {len(group)} caso(s)"
                if crit:
                    header += f" • {crit} crítico(s)"
                with st.expander(header, expanded=(status_key == "escalado_humano" and crit > 0)):
                    for _, row in group.sort_values("score", ascending=False).head(group_limit).iterrows():
                        render_card(row, actions_log)

# ---------------- OVERVIEW ----------------
with tab_overview:
    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Veículos monitorados", summary["total_vehicles"])
    c2.metric("Motoristas ativos", summary["total_drivers"])
    c3.metric("Viagens em andamento", summary["trips_in_progress"])
    c4.metric("Alertas abertos", summary["open_alerts"], delta=f"{summary['critical_alerts']} críticos", delta_color="inverse")
    c5.metric("Risco médio de falha", f"{summary['avg_vehicle_failure_risk']}%")

    st.write("")
    col1, col2 = st.columns(2)

    vehicles = pd.DataFrame(api_get("/vehicles"))
    drivers = pd.DataFrame(api_get("/drivers"))

    with col1:
        st.subheader("Top 10 veículos por risco de falha")
        fig = px.bar(
            vehicles.head(10), x="failure_risk_score", y="plate", orientation="h",
            color="failure_risk_score", color_continuous_scale="Reds",
            labels={"failure_risk_score": "Risco de falha (%)", "plate": "Placa"},
        )
        fig.update_layout(yaxis={"categoryorder": "total ascending"}, height=420)
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.subheader("Top 10 motoristas que precisam de apoio")
        fig2 = px.bar(
            drivers.head(10), x="support_risk_score", y="name", orientation="h",
            color="support_risk_score", color_continuous_scale="Oranges",
            labels={"support_risk_score": "Risco (%)", "name": "Motorista"},
        )
        fig2.update_layout(yaxis={"categoryorder": "total ascending"}, height=420)
        st.plotly_chart(fig2, use_container_width=True)

    st.subheader("Distribuição da frota por base")
    dist = vehicles.groupby("base_city").size().reset_index(name="veiculos")
    fm_palette = ["#007880", "#001028", "#4FD1D9", "#4A5560", "#8A5A22", "#1E6B4F", "#0C2440", "#AFC3CC"]
    fig3 = px.pie(dist, names="base_city", values="veiculos", hole=0.45, color_discrete_sequence=fm_palette)
    st.plotly_chart(fig3, use_container_width=True)

# ---------------- VEHICLES ----------------
with tab_vehicles:
    st.subheader("Ranking preditivo de risco de falha mecânica")
    vehicles = pd.DataFrame(api_get("/vehicles"))
    min_risk = st.slider("Filtrar por risco mínimo (%)", 0, 100, 0)
    filtered = vehicles[vehicles["failure_risk_score"] >= min_risk]
    st.dataframe(
        filtered.rename(columns={
            "plate": "Placa", "model": "Modelo", "category": "Categoria", "year": "Ano",
            "odometer_km": "Odômetro (km)", "base_city": "Base", "failure_risk_score": "Risco de falha (%)",
            "avg_engine_temp": "Temp. média motor (°C)", "min_oil_pressure": "Pressão mín. óleo (psi)",
            "avg_brake_wear": "Desgaste médio freio (%)", "maintenance_events": "Eventos de manutenção",
            "failures_count": "Falhas registradas",
        }),
        use_container_width=True, hide_index=True,
    )

# ---------------- DRIVERS ----------------
with tab_drivers:
    st.subheader("Ranking preditivo de risco/apoio a motoristas")
    drivers = pd.DataFrame(api_get("/drivers"))
    min_risk_d = st.slider("Filtrar por risco mínimo (%)", 0, 100, 0, key="driver_slider")
    filtered_d = drivers[drivers["support_risk_score"] >= min_risk_d]
    st.dataframe(
        filtered_d.rename(columns={
            "name": "Motorista", "experience_years": "Experiência (anos)", "base_city": "Base",
            "support_risk_score": "Risco (%)", "avg_fatigue": "Fadiga média",
            "avg_speeding": "Excesso vel. médio", "avg_harsh_braking": "Frenagens bruscas médias",
            "avg_overall_score": "Score geral", "trips_count": "Viagens",
        }),
        use_container_width=True, hide_index=True,
    )

# ---------------- ALERTS ----------------
with tab_alerts:
    st.subheader("Alertas operacionais em aberto")
    alerts = pd.DataFrame(api_get("/alerts", {"only_open": True, "limit": 200}))
    if alerts.empty:
        st.success("Nenhum alerta em aberto no momento.")
    else:
        sev_order = {"critica": 0, "alta": 1, "media": 2, "baixa": 3}
        alerts["ordem"] = alerts["severity"].map(sev_order)
        alerts = alerts.sort_values(["ordem", "timestamp"], ascending=[True, False])
        for _, row in alerts.head(50).iterrows():
            color = {"critica": "🔴", "alta": "🟠", "media": "🟡", "baixa": "🟢"}.get(row["severity"], "⚪")
            st.markdown(f"{color} **{row['type'].replace('_',' ').title()}** — {row['message']} "
                        f"_(veículo #{row['vehicle_id']}, {row['timestamp'][:16].replace('T',' ')})_")

# ---------------- COPILOT ----------------
with tab_copilot:
    st.subheader("🚚 Copiloto / Super Agente de IA")
    st.caption(
        "Pergunte em linguagem natural sobre a operação: risco de veículos, motoristas, "
        "rotas mais seguras, entregas com risco de atraso, alertas críticos ou manutenção."
    )

    examples = [
        "Qual veículo apresenta maior risco de falha?",
        "Qual motorista precisa de apoio?",
        "Qual rota é mais segura neste momento?",
        "Quais entregas correm risco de atraso?",
        "Me dê um resumo da frota",
    ]
    cols = st.columns(len(examples))
    clicked = None
    for c, ex in zip(cols, examples):
        if c.button(ex, use_container_width=True):
            clicked = ex

    question = st.text_input("Sua pergunta:", value=clicked or "")
    if st.button("Perguntar", type="primary") or clicked:
        q = question if question else clicked
        if q:
            with st.spinner("O FleetMind AI está analisando a operação..."):
                result = api_post("/ask", {"question": q})
            st.markdown(f"**Resposta:** {result['text']}")
            if result["table"]:
                st.dataframe(pd.DataFrame(result["table"]), use_container_width=True, hide_index=True)
