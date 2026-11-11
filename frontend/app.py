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

st.set_page_config(
    page_title="FleetMind AI",
    page_icon=str(Path(__file__).parent.parent / "assets" / "logo_icon.png"),
    layout="wide",
)


def _get_api_url() -> str:
    """Em produção (Streamlit Community Cloud), defina API_URL em st.secrets ou
    na variável de ambiente, apontando para o backend hospedado (ex.: Render).
    Localmente, cai no padrão http://127.0.0.1:8000."""
    if os.environ.get("API_URL"):
        return os.environ["API_URL"]
    try:
        if "API_URL" in st.secrets:
            return st.secrets["API_URL"]
    except Exception:
        pass
    return "http://127.0.0.1:8000"


API_URL = _get_api_url()
ASSETS_DIR = Path(__file__).parent.parent / "assets"


def _logo_data_uri(filename: str) -> str | None:
    path = ASSETS_DIR / filename
    if not path.exists():
        return None
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode()


LOGO_ICON_URI = _logo_data_uri("logo_icon_transparent.png")
LOGO_FULL_URI = _logo_data_uri("logo.png")

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

tab_kanban, tab_roi, tab_esg, tab_overview, tab_vehicles, tab_drivers, tab_alerts, tab_copilot = st.tabs(
    ["🗂️ Painel Operacional", "💰 Economia & ROI", "🌱 ESG", "📊 Visão Geral", "🚛 Veículos", "🧑‍✈️ Motoristas", "🚨 Alertas", "🚚 Copiloto de IA"]
)

# ---------------- ESG ----------------
with tab_esg:
    st.subheader("ESG: emissões de carbono e impacto ambiental")
    st.caption(
        "Escopo 1 (diesel). Km, viagens e alertas vêm dos dados da frota; fator de emissão, consumo e percentuais "
        "de redução são **premissas editáveis**. Substitua o fator pelo oficial do Programa Brasileiro GHG Protocol "
        "antes de divulgar."
    )

    @st.cache_data(ttl=300)
    def load_esg_data():
        return (
            pd.DataFrame(api_get("/trips", {"limit": 5000})),
            pd.DataFrame(api_get("/alerts", {"only_open": False, "limit": 5000})),
            pd.DataFrame(api_get("/vehicles")),
        )

    e_trips, e_alerts, e_veh = load_esg_data()

    with st.expander("⚙️ Premissas ambientais", expanded=False):
        p1, p2, p3 = st.columns(3)
        ef = p1.number_input("Fator de emissão do diesel (kgCO₂e/l)", 1.0, 4.0, 2.6, 0.05)
        e_kml = p2.number_input("Consumo médio (km/l)", 1.5, 5.0, 2.8, 0.1, key="esg_kml")
        idle_lh = p3.number_input("Consumo em marcha lenta (l/h)", 0.5, 6.0, 2.5, 0.1)
        q1, q2 = st.columns(2)
        e_diesel = q1.number_input("Preço do diesel (R$/l)", 4.0, 10.0, 6.2, 0.1, key="esg_diesel")
        tree = q2.number_input("CO₂ absorvido por árvore (kg/ano)", 5.0, 60.0, 22.0, 1.0)

    esg_scn = st.radio("Cenário", ["Conservador", "Base", "Otimista"], index=1, horizontal=True, key="esg_scn")
    g = {"Conservador": (0.02, 0.10), "Base": (0.04, 0.20), "Otimista": (0.07, 0.35)}[esg_scn]

    e_trips["start_time"] = pd.to_datetime(e_trips["start_time"], errors="coerce")
    yrs = max((e_trips["start_time"].max() - e_trips["start_time"].min()).days / 365, 0.1)
    km_y = e_trips["distance_km"].sum() / yrs
    trips_y = len(e_trips) / yrs
    n_v = len(e_veh)
    idle_h = e_trips["delay_minutes"].sum() / yrs / 60

    fuel_l = km_y / e_kml
    base_t = fuel_l * ef / 1000
    saved_l = fuel_l * g[0] + idle_h * idle_lh * g[1]
    saved_t = saved_l * ef / 1000
    new_t = base_t - saved_t

    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Emissões (linha de base)", f"{base_t:,.0f} tCO₂e/ano")
    m2.metric("Intensidade", f"{base_t*1000/km_y:,.3f} kgCO₂e/km")
    m3.metric("CO₂e evitado", f"{saved_t:,.1f} t/ano", delta=f"-{saved_t/base_t*100:.1f}%", delta_color="inverse")
    m4.metric("Árvores equivalentes", f"{saved_t*1000/tree:,.0f}/ano")

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("**Emissões antes e depois (tCO₂e/ano)**")
        ba = pd.DataFrame({"Situação": ["Sem FleetMind", "Com FleetMind"], "tCO₂e": [base_t, new_t]})
        fig_ba = px.bar(ba, x="Situação", y="tCO₂e", text_auto=".0f", color="Situação",
                        color_discrete_map={"Sem FleetMind": FM_GRAY_TEXT, "Com FleetMind": FM_TEAL})
        fig_ba.update_layout(height=320, showlegend=False, margin=dict(l=0, r=0, t=10, b=0))
        st.plotly_chart(fig_ba, use_container_width=True)
    with c2:
        st.markdown("**CO₂e evitado por cenário (t/ano)**")
        rows = []
        for name, (fc, ic) in {"Conservador": (0.02, 0.10), "Base": (0.04, 0.20), "Otimista": (0.07, 0.35)}.items():
            rows.append({"Cenário": name, "tCO₂e evitadas": (fuel_l * fc + idle_h * idle_lh * ic) * ef / 1000})
        fig_sc = px.bar(pd.DataFrame(rows), x="Cenário", y="tCO₂e evitadas", text_auto=".1f",
                        color_discrete_sequence=[FM_TEAL])
        fig_sc.update_layout(height=320, margin=dict(l=0, r=0, t=10, b=0))
        st.plotly_chart(fig_sc, use_container_width=True)

    st.markdown("**Índices da operação**")
    i1, i2, i3, i4 = st.columns(4)
    i1.metric("Distância", f"{km_y/1e6:,.2f} mi km/ano")
    i2.metric("Diesel consumido", f"{fuel_l/1e6:,.2f} mi l/ano")
    i3.metric("Por viagem", f"{base_t*1000/trips_y:,.0f} kgCO₂e")
    i4.metric("Por veículo", f"{base_t/n_v:,.1f} tCO₂e/ano")

    j1, j2, j3 = st.columns(3)
    j1.metric("Diesel não consumido", f"{saved_l:,.0f} l/ano")
    j2.metric("Economia em diesel", f"R$ {saved_l*e_diesel/1e3:,.0f} mil/ano")
    j3.metric("Marcha lenta em atrasos", f"{idle_h:,.0f} h/ano")

    st.markdown("**Sinais que apoiam a redução (alertas por ano)**")
    cnt = e_alerts["type"].value_counts() / yrs
    sig = pd.DataFrame({
        "Alerta": [t.replace("_", " ").capitalize() for t in cnt.index],
        "Ocorrências/ano": cnt.values.round(0),
    })
    st.dataframe(sig, use_container_width=True, hide_index=True)

    st.caption(
        "Social e governança: alertas de fadiga e eventos críticos geram ação preventiva, e toda decisão do agente "
        "fica registrada com autor e horário (aba Painel Operacional). Fora deste cálculo: Escopo 2 e 3, emissões do "
        "próprio FleetMind e poluentes como NOx e material particulado. A base é sintética; valide os percentuais "
        "no piloto de 90 a 120 dias."
    )

# ---------------- ECONOMIA & ROI ----------------
with tab_roi:
    st.subheader("Onde o FleetMind AI gera economia para a empresa")
    st.caption(
        "Base de custos calculada a partir dos dados da frota (viagens, manutenção, alertas). "
        "Os percentuais de redução são **hipóteses a validar em piloto** — ajuste os controles abaixo."
    )

    @st.cache_data(ttl=300)
    def load_roi_data():
        trips = pd.DataFrame(api_get("/trips", {"limit": 5000}))
        maint = pd.DataFrame(api_get("/maintenance", {"limit": 5000}))
        alerts = pd.DataFrame(api_get("/alerts", {"only_open": False, "limit": 5000}))
        veh = pd.DataFrame(api_get("/vehicles"))
        return trips, maint, alerts, veh

    trips_df, maint_df, alerts_df, veh_df = load_roi_data()
    n_veh = len(veh_df)

    with st.expander("⚙️ Premissas (ajuste para a sua operação)", expanded=False):
        a1, a2, a3 = st.columns(3)
        diesel = a1.number_input("Preço do diesel (R$/l)", 4.0, 10.0, 6.2, 0.1)
        kml = a2.number_input("Consumo médio (km/l)", 1.5, 5.0, 2.8, 0.1)
        delay_cost = a3.number_input("Custo de atraso (R$/min)", 0.0, 50.0, 8.0, 1.0)
        b1, b2, b3 = st.columns(3)
        crash_cost = b1.number_input("Custo médio de sinistro (R$)", 10000, 500000, 80000, 5000)
        crash_prob = b2.slider("% dos alertas críticos que viram sinistro", 0.0, 5.0, 1.0, 0.1) / 100
        price_veh = b3.number_input("Assinatura FleetMind (R$/veículo/mês)", 100, 1500, 390, 10)
        setup = st.number_input("Implantação e integrações (R$, ano 1)", 0, 1_000_000, 90_000, 10_000)

    scenario = st.radio(
        "Cenário de ganho (hipótese a validar em piloto)",
        ["Conservador", "Base", "Otimista"], index=1, horizontal=True,
    )
    gain = {
        "Conservador": dict(fuel=0.02, maint=0.30, delay=0.10, crash=0.10),
        "Base": dict(fuel=0.04, maint=0.50, delay=0.20, crash=0.25),
        "Otimista": dict(fuel=0.07, maint=0.70, delay=0.35, crash=0.40),
    }[scenario]

    # ---- Base de custos anualizada (FATO: vem dos dados da frota) ----
    trips_df["start_time"] = pd.to_datetime(trips_df["start_time"], errors="coerce")
    span_years = max((trips_df["start_time"].max() - trips_df["start_time"].min()).days / 365, 0.1)
    km_year = trips_df["distance_km"].sum() / span_years
    fuel_cost = km_year / kml * diesel
    delay_min_year = trips_df["delay_minutes"].sum() / span_years

    maint_df["date"] = pd.to_datetime(maint_df["date"], errors="coerce")
    m_years = max((maint_df["date"].max() - maint_df["date"].min()).days / 365, 0.1)
    fails_year = maint_df["failure_occurred"].sum() / m_years
    corr = maint_df[maint_df["type"] == "corretiva"]["cost"].mean()
    prev = maint_df[maint_df["type"] == "preventiva"]["cost"].mean()
    corr = corr if pd.notna(corr) else maint_df["cost"].mean()
    prev = prev if pd.notna(prev) else maint_df["cost"].mean() * 0.3
    maint_year = maint_df["cost"].sum() / m_years

    crit = alerts_df[alerts_df["severity"].isin(["critica", "alta"])]
    crit_year = len(crit) / span_years

    savings = {
        "Combustível (rotas e condução)": fuel_cost * gain["fuel"],
        "Manutenção corretiva evitada": fails_year * gain["maint"] * max(corr - prev, 0),
        "Atrasos reduzidos": delay_min_year * delay_cost * gain["delay"],
        "Sinistros evitados": crit_year * crash_prob * crash_cost * gain["crash"],
    }
    total_save = sum(savings.values())
    invest_y1 = n_veh * price_veh * 12 + setup
    net = total_save - invest_y1
    roi = net / invest_y1 * 100 if invest_y1 else 0
    payback = invest_y1 / (total_save / 12) if total_save else float("inf")

    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Economia anual estimada", f"R$ {total_save/1e6:,.2f} mi")
    k2.metric("Investimento (ano 1)", f"R$ {invest_y1/1e6:,.2f} mi")
    k3.metric("ROI ano 1", f"{roi:,.0f}%")
    k4.metric("Payback", f"{payback:,.1f} meses" if payback != float("inf") else "—")

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("**Economia por alavanca (R$/ano)**")
        sv = pd.DataFrame({"Alavanca": list(savings), "Economia": list(savings.values())}).sort_values("Economia")
        fig_sv = px.bar(sv, x="Economia", y="Alavanca", orientation="h", text_auto=".3s",
                        color_discrete_sequence=[FM_TEAL])
        fig_sv.update_layout(height=340, margin=dict(l=0, r=0, t=10, b=0), xaxis_title="R$/ano", yaxis_title="")
        st.plotly_chart(fig_sv, use_container_width=True)
    with c2:
        st.markdown("**Fluxo de caixa acumulado (12 meses)**")
        months = list(range(0, 13))
        cum = [(-setup) + (total_save / 12 - n_veh * price_veh) * m for m in months]
        cf = pd.DataFrame({"Mês": months, "Saldo acumulado (R$)": cum})
        fig_cf = px.area(cf, x="Mês", y="Saldo acumulado (R$)", color_discrete_sequence=[FM_TEAL])
        fig_cf.add_hline(y=0, line_dash="dash", line_color=FM_GRAY_TEXT)
        fig_cf.update_layout(height=340, margin=dict(l=0, r=0, t=10, b=0))
        st.plotly_chart(fig_cf, use_container_width=True)

    st.markdown("**Base de custo que o projeto ataca (dados da frota, anualizados)**")
    b1, b2, b3, b4 = st.columns(4)
    b1.metric("Combustível", f"R$ {fuel_cost/1e6:,.2f} mi", help=f"{km_year:,.0f} km/ano ÷ {kml} km/l × R$ {diesel}")
    b2.metric("Manutenção", f"R$ {maint_year/1e6:,.2f} mi", help=f"{fails_year:,.0f} falhas/ano")
    b3.metric("Atrasos", f"{delay_min_year/60:,.0f} h/ano", help=f"≈ R$ {delay_min_year*delay_cost/1e6:,.2f} mi")
    b4.metric("Alertas altos/críticos", f"{crit_year:,.0f}/ano")

    st.markdown("**Onde agir primeiro: veículos com maior risco e histórico de falha**")
    cost_by_v = maint_df.groupby("vehicle_id")["cost"].sum().rename("custo_manutencao")
    top = veh_df.merge(cost_by_v, left_on="id", right_index=True, how="left").fillna({"custo_manutencao": 0})
    top["prioridade"] = top["failure_risk_score"] * (1 + top["custo_manutencao"] / max(top["custo_manutencao"].max(), 1))
    st.dataframe(
        top.sort_values("prioridade", ascending=False).head(10)[
            ["plate", "model", "failure_risk_score", "failures_count", "custo_manutencao"]
        ].rename(columns={"plate": "Placa", "model": "Modelo", "failure_risk_score": "Risco de falha (%)",
                          "failures_count": "Falhas", "custo_manutencao": "Custo manutenção (R$)"}),
        use_container_width=True, hide_index=True,
    )
    st.caption(
        "FATO: custos-base (km, manutenção, atrasos, alertas) vêm dos dados da frota; combustível = 30–35% do custo "
        "operacional (CNT/NTC&Logística). HIPÓTESE: percentuais de ganho por alavanca, custo de sinistro e preço "
        "da assinatura — validar no piloto de 90–120 dias."
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
