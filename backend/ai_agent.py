"""
FleetMind AI - "Super Agente" de IA
Motor de perguntas e respostas em linguagem natural (PT-BR) sobre a operacao
da frota. E um motor baseado em regras/intencoes + consultas sobre os dados
e scores preditivos - pensado para funcionar 100% offline no prototipo,
com um ponto de extensao claro para plugar um LLM real (OpenAI/Anthropic)
no lugar da funcao `answer()` quando houver chave de API disponivel.
"""
import re
import unicodedata

import pandas as pd


def _norm(text: str) -> str:
    text = text.lower().strip()
    text = "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")
    return text


INTENT_PATTERNS = [
    ("risco_falha_veiculo", [r"risco.*falha", r"veiculo.*falhar", r"maior risco de falha", r"veiculo.*risco"]),
    ("motorista_apoio", [r"motorista.*apoio", r"motorista.*ajuda", r"motorista.*risco", r"motorista.*fadiga"]),
    ("rota_segura", [r"rota.*segura", r"melhor rota", r"rota.*risco"]),
    ("entregas_atraso", [r"atraso", r"entrega.*risco", r"viagem.*atraso"]),
    ("alertas_criticos", [r"alerta", r"critico", r"urgente"]),
    ("manutencao", [r"manutencao", r"custo.*manutencao", r"oficina"]),
    ("resumo_frota", [r"resumo", r"visao geral", r"status da frota", r"como esta a frota"]),
]


def classify_intent(question: str) -> str:
    q = _norm(question)
    for intent, patterns in INTENT_PATTERNS:
        for p in patterns:
            if re.search(p, q):
                return intent
    return "desconhecido"


def answer(question: str, ctx: dict) -> dict:
    """
    ctx deve conter DataFrames: vehicles_scored, drivers_scored, trips, alerts, maintenance
    Retorna dict com 'text' (resposta em linguagem natural) e 'table' (DataFrame opcional).
    """
    intent = classify_intent(question)

    if intent == "risco_falha_veiculo":
        df = ctx["vehicles_scored"].head(5)
        top = df.iloc[0]
        text = (
            f"O veiculo com maior risco de falha mecanica e a placa **{top['plate']}** "
            f"({top['model']}), com score de risco de **{top['failure_risk_score']}%**. "
            f"Recomendo agendar inspecao preventiva prioritaria, verificando temperatura do motor "
            f"({top['avg_engine_temp']:.1f}C em media) e pressao do oleo "
            f"({top['min_oil_pressure']:.1f} psi minimo registrado)."
        )
        return {"text": text, "table": df}

    if intent == "motorista_apoio":
        df = ctx["drivers_scored"].head(5)
        top = df.iloc[0]
        text = (
            f"O motorista que mais precisa de apoio agora e **{top['name']}**, com score de risco "
            f"de **{top['support_risk_score']}%** (fadiga media {top['avg_fatigue']:.1f}/100). "
            f"Sugestao: contato do copiloto virtual, pausa programada e revisao de escala de viagens."
        )
        return {"text": text, "table": df}

    if intent == "rota_segura":
        trips = ctx["trips"].copy()
        trips["route"] = trips["origin_city"] + " -> " + trips["destination_city"]
        agg = trips.groupby("route").agg(
            risco_medio=("route_risk_score", "mean"), viagens=("id", "count")
        ).reset_index()
        agg = agg[agg["viagens"] >= 3].sort_values("risco_medio")
        if agg.empty:
            return {"text": "Nao ha dados suficientes de rotas recorrentes ainda.", "table": None}
        best = agg.iloc[0]
        text = (
            f"A rota mais segura no momento e **{best['route']}**, com risco medio de "
            f"**{best['risco_medio']:.1f}/100** com base em {int(best['viagens'])} viagens analisadas."
        )
        return {"text": text, "table": agg.head(8)}

    if intent == "entregas_atraso":
        trips = ctx["trips"]
        risky = trips[(trips["status"] == "em_andamento") & (trips["delay_minutes"] > 20)]
        risky = risky.sort_values("delay_minutes", ascending=False)
        if risky.empty:
            return {"text": "Nenhuma entrega em andamento apresenta risco relevante de atraso agora.", "table": None}
        text = (
            f"Ha **{len(risky)} entregas em andamento** com risco de atraso acima de 20 minutos. "
            f"A mais critica e a viagem #{int(risky.iloc[0]['id'])} "
            f"({risky.iloc[0]['origin_city']} -> {risky.iloc[0]['destination_city']}), "
            f"com atraso estimado de {risky.iloc[0]['delay_minutes']:.0f} minutos."
        )
        return {"text": text, "table": risky.head(10)}

    if intent == "alertas_criticos":
        alerts = ctx["alerts"]
        critical = alerts[(alerts["severity"].isin(["critica", "alta"])) & (alerts["resolved"] == 0)]
        text = f"Existem **{len(critical)} alertas criticos/altos** nao resolvidos na operacao."
        return {"text": text, "table": critical.sort_values("timestamp", ascending=False).head(10)}

    if intent == "manutencao":
        m = ctx["maintenance"]
        total_cost = m["cost"].sum()
        failures = m["failure_occurred"].sum()
        text = (
            f"O custo total de manutencao registrado e de **R$ {total_cost:,.2f}**, "
            f"com **{int(failures)} falhas** confirmadas no periodo analisado."
        )
        return {"text": text, "table": m.sort_values("cost", ascending=False).head(10)}

    if intent == "resumo_frota":
        v = ctx["vehicles_scored"]
        d = ctx["drivers_scored"]
        a = ctx["alerts"]
        text = (
            f"Resumo da operacao: **{len(v)} veiculos** monitorados "
            f"(risco medio de falha {v['failure_risk_score'].mean():.1f}%), "
            f"**{len(d)} motoristas** ativos (risco medio {d['support_risk_score'].mean():.1f}%), "
            f"e **{int((a['resolved']==0).sum())} alertas** em aberto."
        )
        return {"text": text, "table": None}

    return {
        "text": (
            "Ainda nao sei responder essa pergunta especifica. Tente perguntar sobre: "
            "risco de falha de veiculos, motoristas que precisam de apoio, rota mais segura, "
            "entregas com risco de atraso, alertas criticos, manutencao ou um resumo da frota."
        ),
        "table": None,
    }
