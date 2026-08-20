"""
FleetMind AI - Backend (FastAPI)
Expoe a operacao da frota: veiculos, motoristas, viagens, alertas,
scores preditivos de risco e o endpoint do "Super Agente" de IA.

Uso:
    uvicorn backend.main:app --reload --port 8000
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.database import get_conn
from backend.scoring import score_vehicles, score_drivers
from backend import ai_agent, agent_engine
from backend.situations_engine import refresh_situations, ensure_schema, fetch_situations

app = FastAPI(title="FleetMind AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _records(df: pd.DataFrame):
    """Converte um DataFrame para list[dict] JSON-safe, trocando NaN/NaT por None
    (assign direto em coluna float64 volta a virar NaN, por isso o astype(object))."""
    df = df.astype(object)
    df = df.where(pd.notnull(df), None)
    return df.to_dict(orient="records")


def _read_tables():
    conn = get_conn()
    tables = {
        "vehicles": pd.read_sql("SELECT * FROM vehicles", conn),
        "drivers": pd.read_sql("SELECT * FROM drivers", conn),
        "trips": pd.read_sql("SELECT * FROM trips", conn),
        "telemetry": pd.read_sql("SELECT * FROM telemetry", conn),
        "maintenance": pd.read_sql("SELECT * FROM maintenance", conn),
        "behavior": pd.read_sql("SELECT * FROM driver_behavior", conn),
        "alerts": pd.read_sql("SELECT * FROM alerts", conn),
    }
    conn.close()
    return tables


class QuestionRequest(BaseModel):
    question: str


class SituationStatusUpdate(BaseModel):
    status: str  # 'novo' | 'ia_atuando' | 'escalado_humano' | 'resolvido'


class RoadEventRequest(BaseModel):
    trip_id: int
    description: str


@app.get("/")
def root():
    return {"service": "FleetMind AI API", "status": "online"}


@app.get("/vehicles")
def get_vehicles():
    t = _read_tables()
    scored = score_vehicles(t["vehicles"], t["telemetry"], t["maintenance"])
    return _records(scored)


@app.get("/drivers")
def get_drivers():
    t = _read_tables()
    scored = score_drivers(t["drivers"], t["behavior"])
    return _records(scored)


@app.get("/trips")
def get_trips(status: str | None = None, limit: int = 200):
    t = _read_tables()
    trips = t["trips"]
    if status:
        trips = trips[trips["status"] == status]
    return _records(trips.sort_values("start_time", ascending=False).head(limit))


@app.get("/alerts")
def get_alerts(only_open: bool = True, limit: int = 100):
    t = _read_tables()
    alerts = t["alerts"]
    if only_open:
        alerts = alerts[alerts["resolved"] == 0]
    return _records(alerts.sort_values("timestamp", ascending=False).head(limit))


@app.get("/maintenance")
def get_maintenance(limit: int = 200):
    t = _read_tables()
    return _records(t["maintenance"].sort_values("date", ascending=False).head(limit))


@app.get("/summary")
def get_summary():
    t = _read_tables()
    v_scored = score_vehicles(t["vehicles"], t["telemetry"], t["maintenance"])
    d_scored = score_drivers(t["drivers"], t["behavior"])
    alerts = t["alerts"]
    trips = t["trips"]
    return {
        "total_vehicles": len(t["vehicles"]),
        "total_drivers": len(t["drivers"]),
        "trips_in_progress": int((trips["status"] == "em_andamento").sum()),
        "open_alerts": int((alerts["resolved"] == 0).sum()),
        "critical_alerts": int(((alerts["resolved"] == 0) & (alerts["severity"] == "critica")).sum()),
        "avg_vehicle_failure_risk": round(v_scored["failure_risk_score"].mean(), 1),
        "avg_driver_support_risk": round(d_scored["support_risk_score"].mean(), 1),
        "top_risk_vehicle": v_scored.iloc[0]["plate"] if len(v_scored) else None,
        "top_risk_driver": d_scored.iloc[0]["name"] if len(d_scored) else None,
    }


@app.get("/situations")
def get_situations():
    """Painel operacional (Kanban): situacoes recalculadas a partir dos dados e
    scores preditivos mais recentes. O Agente de IA ja processa e age sobre
    toda situacao nova antes de retornar (novo -> ia_atuando/escalado_humano)."""
    t = _read_tables()
    conn = get_conn()
    ensure_schema(conn)
    refresh_situations(
        conn, t["vehicles"], t["drivers"], t["telemetry"], t["maintenance"],
        t["behavior"], t["trips"], t["alerts"],
    )
    agent_engine.process_new_situations(conn)
    df = fetch_situations(conn)
    conn.close()
    return _records(df)


@app.patch("/situations/{situation_id}")
def update_situation_status(situation_id: int, body: SituationStatusUpdate):
    if body.status not in ("novo", "ia_atuando", "escalado_humano", "resolvido"):
        raise HTTPException(status_code=400, detail="status invalido")
    conn = get_conn()
    ensure_schema(conn)
    cur = conn.cursor()
    cur.execute(
        "UPDATE situations SET status = ?, updated_at = datetime('now') WHERE id = ?",
        (body.status, situation_id),
    )
    conn.commit()
    updated = cur.rowcount
    conn.close()
    if not updated:
        raise HTTPException(status_code=404, detail="situacao nao encontrada")
    return {"id": situation_id, "status": body.status}


@app.get("/agent-actions")
def get_agent_actions(situation_id: int | None = None, limit: int = 500):
    """Linha do tempo de acoes executadas pelo Agente de IA (e por humanos)."""
    conn = get_conn()
    ensure_schema(conn)
    if situation_id is not None:
        df = pd.read_sql(
            "SELECT * FROM agent_actions WHERE situation_id = ? ORDER BY timestamp DESC LIMIT ?",
            conn, params=(situation_id, limit),
        )
    else:
        df = pd.read_sql("SELECT * FROM agent_actions ORDER BY timestamp DESC LIMIT ?", conn, params=(limit,))
    conn.close()
    return _records(df)


@app.get("/road-events")
def get_road_events(limit: int = 50):
    """Relatos recentes reportados por voz pelos motoristas da rede."""
    conn = get_conn()
    ensure_schema(conn)
    df = pd.read_sql("SELECT * FROM road_events ORDER BY timestamp DESC LIMIT ?", conn, params=(limit,))
    conn.close()
    return _records(df)


@app.post("/road-events")
def post_road_event(body: RoadEventRequest):
    """Recebe o relato (transcrito) de um motorista em viagem e aciona o Agente
    de IA para classificar o evento e propagar o impacto na rede de veiculos."""
    conn = get_conn()
    ensure_schema(conn)
    trip = conn.execute("SELECT * FROM trips WHERE id = ?", (body.trip_id,)).fetchone()
    if trip is None:
        conn.close()
        raise HTTPException(status_code=404, detail="viagem nao encontrada")
    result = agent_engine.register_road_event(
        conn, trip["driver_id"], trip["vehicle_id"], trip["id"], body.description
    )
    conn.close()
    return result


@app.post("/ask")
def ask_agent(req: QuestionRequest):
    t = _read_tables()
    ctx = {
        "vehicles_scored": score_vehicles(t["vehicles"], t["telemetry"], t["maintenance"]),
        "drivers_scored": score_drivers(t["drivers"], t["behavior"]),
        "trips": t["trips"],
        "alerts": t["alerts"],
        "maintenance": t["maintenance"],
    }
    result = ai_agent.answer(req.question, ctx)
    table = result["table"]
    return {
        "text": result["text"],
        "table": _records(table) if table is not None else None,
    }
