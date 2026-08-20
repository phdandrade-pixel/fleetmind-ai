"""
Carrega os modelos preditivos treinados e calcula scores de risco
por veiculo e por motorista a partir dos dados atuais do banco.
"""
from pathlib import Path

import joblib
import pandas as pd

from ml.train_predictive_model import (
    VEHICLE_FEATURE_COLS, DRIVER_FEATURE_COLS,
    build_vehicle_features, build_driver_features,
)

MODELS_DIR = Path(__file__).parent.parent / "ml" / "models"

_vehicle_bundle = None
_driver_bundle = None


def _load_bundles():
    global _vehicle_bundle, _driver_bundle
    if _vehicle_bundle is None:
        _vehicle_bundle = joblib.load(MODELS_DIR / "vehicle_failure_risk.joblib")
    if _driver_bundle is None:
        _driver_bundle = joblib.load(MODELS_DIR / "driver_support_risk.joblib")
    return _vehicle_bundle, _driver_bundle


def score_vehicles(vehicles, telemetry, maintenance) -> pd.DataFrame:
    vbundle, _ = _load_bundles()
    df = build_vehicle_features(vehicles, telemetry, maintenance)
    X = df[VEHICLE_FEATURE_COLS].fillna(0)
    X_scaled = vbundle["scaler"].transform(X)
    df["failure_risk_score"] = (vbundle["model"].predict_proba(X_scaled)[:, 1] * 100).round(1)
    return df[[
        "id", "plate", "model", "category", "year", "odometer_km",
        "base_city", "base_state", "failure_risk_score",
        "avg_engine_temp", "min_oil_pressure", "avg_brake_wear", "avg_vibration",
        "maintenance_events", "failures_count",
    ]].sort_values("failure_risk_score", ascending=False)


def score_drivers(drivers, behavior) -> pd.DataFrame:
    _, dbundle = _load_bundles()
    df = build_driver_features(drivers, behavior)
    X = df[DRIVER_FEATURE_COLS].fillna(0)
    X_scaled = dbundle["scaler"].transform(X)
    df["support_risk_score"] = (dbundle["model"].predict_proba(X_scaled)[:, 1] * 100).round(1)
    return df[[
        "id", "name", "experience_years", "base_city", "support_risk_score",
        "avg_fatigue", "avg_speeding", "avg_harsh_braking", "avg_overall_score", "trips_count",
    ]].sort_values("support_risk_score", ascending=False)
