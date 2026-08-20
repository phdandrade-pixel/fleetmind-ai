"""
FleetMind AI - Treinamento dos modelos preditivos
1) Risco de falha mecanica por veiculo (classificacao binaria + probabilidade)
2) Risco/necessidade de apoio ao motorista (classificacao binaria + probabilidade)

Le a base sintetica (data/fleetmind.db), constroi features agregadas e treina
RandomForestClassifier para cada alvo. Salva os modelos em ml/models/.

Uso:
    python train_predictive_model.py
"""
import sqlite3
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).parent.parent
DB_PATH = BASE_DIR / "data" / "fleetmind.db"
MODELS_DIR = Path(__file__).parent / "models"
MODELS_DIR.mkdir(exist_ok=True)


def load_data():
    conn = sqlite3.connect(DB_PATH)
    vehicles = pd.read_sql("SELECT * FROM vehicles", conn)
    telemetry = pd.read_sql("SELECT * FROM telemetry", conn)
    maintenance = pd.read_sql("SELECT * FROM maintenance", conn)
    trips = pd.read_sql("SELECT * FROM trips", conn)
    behavior = pd.read_sql("SELECT * FROM driver_behavior", conn)
    drivers = pd.read_sql("SELECT * FROM drivers", conn)
    conn.close()
    return vehicles, telemetry, maintenance, trips, behavior, drivers


NOW = pd.Timestamp("2026-08-20")


def build_vehicle_features(vehicles, telemetry, maintenance):
    telem_agg = telemetry.groupby("vehicle_id").agg(
        avg_engine_temp=("engine_temp_c", "mean"),
        max_engine_temp=("engine_temp_c", "max"),
        avg_oil_pressure=("oil_pressure_psi", "mean"),
        min_oil_pressure=("oil_pressure_psi", "min"),
        avg_brake_wear=("brake_wear_pct", "mean"),
        avg_vibration=("vibration_index", "mean"),
        avg_battery=("battery_voltage", "mean"),
        harsh_braking_total=("harsh_braking", "sum"),
        harsh_accel_total=("harsh_accel", "sum"),
    ).reset_index()

    maint_agg = maintenance.groupby("vehicle_id").agg(
        maintenance_events=("id", "count"),
        failures_count=("failure_occurred", "sum"),
        avg_cost=("cost", "mean"),
    ).reset_index()

    maintenance = maintenance.copy()
    maintenance["date"] = pd.to_datetime(maintenance["date"])
    recent_failures = (
        maintenance[(maintenance["failure_occurred"] == 1) & (maintenance["date"] >= NOW - pd.Timedelta(days=180))]
        .groupby("vehicle_id").size().rename("recent_failures").reset_index()
    )

    df = vehicles.merge(telem_agg, left_on="id", right_on="vehicle_id", how="left")
    df = df.merge(maint_agg, on="vehicle_id", how="left")
    df = df.merge(recent_failures, on="vehicle_id", how="left")
    df["age"] = 2026 - df["year"]
    df[["maintenance_events", "failures_count", "avg_cost", "recent_failures"]] = df[
        ["maintenance_events", "failures_count", "avg_cost", "recent_failures"]
    ].fillna(0)

    # Risco iminente: falha recente (180 dias) OU sinais de telemetria em faixa critica agora.
    df["label_failure_risk"] = (
        (df["recent_failures"] > 0)
        | (df["min_oil_pressure"] < 20)
        | (df["max_engine_temp"] > 118)
    ).astype(int)
    return df


def build_driver_features(drivers, behavior):
    beh_agg = behavior.groupby("driver_id").agg(
        avg_fatigue=("fatigue_score", "mean"),
        max_fatigue=("fatigue_score", "max"),
        avg_speeding=("speeding_events", "mean"),
        avg_harsh_braking=("harsh_braking_events", "mean"),
        avg_harsh_accel=("harsh_accel_events", "mean"),
        avg_distraction=("distraction_events", "mean"),
        avg_overall_score=("overall_score", "mean"),
        trips_count=("trip_id", "count"),
    ).reset_index()

    df = drivers.merge(beh_agg, left_on="id", right_on="driver_id", how="left")
    df = df.dropna(subset=["trips_count"])
    df["label_needs_support"] = (df["avg_overall_score"] < 55).astype(int)
    return df


VEHICLE_FEATURE_COLS = [
    "age", "odometer_km", "avg_engine_temp", "max_engine_temp",
    "avg_oil_pressure", "min_oil_pressure", "avg_brake_wear", "avg_vibration",
    "avg_battery", "harsh_braking_total", "harsh_accel_total",
    "maintenance_events", "avg_cost",
]

DRIVER_FEATURE_COLS = [
    "experience_years", "avg_fatigue", "max_fatigue", "avg_speeding",
    "avg_harsh_braking", "avg_harsh_accel", "avg_distraction", "trips_count",
]


def train_and_save(df, feature_cols, label_col, model_name):
    X = df[feature_cols].fillna(0)
    y = df[label_col]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.25, random_state=42, stratify=y if y.nunique() > 1 else None
    )

    clf = RandomForestClassifier(
        n_estimators=300, max_depth=8, min_samples_leaf=3,
        class_weight="balanced", random_state=42, n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    if y_test.nunique() > 1:
        proba = clf.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, proba)
        print(f"\n[{model_name}] AUC: {auc:.3f}")
        print(classification_report(y_test, clf.predict(X_test)))
    else:
        print(f"\n[{model_name}] Apenas uma classe no teste - AUC nao calculado.")

    joblib.dump({"model": clf, "scaler": scaler, "features": feature_cols}, MODELS_DIR / f"{model_name}.joblib")
    print(f"Modelo salvo em ml/models/{model_name}.joblib")

    importances = pd.Series(clf.feature_importances_, index=feature_cols).sort_values(ascending=False)
    print("Top features:")
    print(importances.head(6).to_string())
    return clf, scaler


def main():
    vehicles, telemetry, maintenance, trips, behavior, drivers = load_data()

    vdf = build_vehicle_features(vehicles, telemetry, maintenance)
    train_and_save(vdf, VEHICLE_FEATURE_COLS, "label_failure_risk", "vehicle_failure_risk")

    ddf = build_driver_features(drivers, behavior)
    train_and_save(ddf, DRIVER_FEATURE_COLS, "label_needs_support", "driver_support_risk")

    print("\nTreinamento concluido.")


if __name__ == "__main__":
    main()
