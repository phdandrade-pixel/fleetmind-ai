"""
FleetMind AI - Gerador de Base de Dados Sintética
Gera uma base realista de frota (veiculos, motoristas, viagens, telemetria,
manutencao e alertas) para testes de analise preditiva.

Uso:
    python generate_synthetic_data.py
"""
import sqlite3
import random
import math
from datetime import datetime, timedelta
from pathlib import Path

from faker import Faker

fake = Faker("pt_BR")
random.seed(42)

DB_PATH = Path(__file__).parent / "fleetmind.db"

N_VEHICLES = 120
N_DRIVERS = 150
N_TRIPS = 4000
LIVE_TRIPS = 45  # viagens "em andamento agora", usadas pelo painel operacional (Kanban)
TELEMETRY_POINTS_PER_TRIP = 12

VEHICLE_MODELS = [
    ("Volvo FH 540", "Cavalo Mecanico"), ("Scania R450", "Cavalo Mecanico"),
    ("Mercedes-Benz Actros", "Cavalo Mecanico"), ("DAF XF", "Cavalo Mecanico"),
    ("Volkswagen Constellation", "Truck"), ("Iveco Way", "Truck"),
    ("Ford Cargo", "Truck"), ("Mercedes-Benz Sprinter", "Van"),
]

CITIES = [
    ("Sao Paulo", "SP"), ("Campinas", "SP"), ("Curitiba", "PR"),
    ("Belo Horizonte", "MG"), ("Rio de Janeiro", "RJ"), ("Porto Alegre", "RS"),
    ("Goiania", "GO"), ("Salvador", "BA"), ("Recife", "PE"), ("Uberlandia", "MG"),
    ("Ribeirao Preto", "SP"), ("Londrina", "PR"),
]

WEATHER_CONDITIONS = ["Ceu limpo", "Nublado", "Chuva leve", "Chuva forte", "Neblina", "Vento forte"]
ALERT_TYPES = [
    ("fadiga_motorista", "alta"), ("excesso_velocidade", "media"),
    ("temperatura_motor", "alta"), ("pressao_oleo_baixa", "critica"),
    ("desvio_rota", "media"), ("colisao_iminente", "critica"),
    ("manutencao_preventiva", "baixa"), ("clima_severo", "media"),
    ("pneu_pressao_baixa", "media"), ("frenagem_brusca", "baixa"),
]


def create_schema(conn):
    cur = conn.cursor()
    cur.executescript(
        """
        DROP TABLE IF EXISTS alerts;
        DROP TABLE IF EXISTS telemetry;
        DROP TABLE IF EXISTS driver_behavior;
        DROP TABLE IF EXISTS maintenance;
        DROP TABLE IF EXISTS trips;
        DROP TABLE IF EXISTS drivers;
        DROP TABLE IF EXISTS vehicles;

        CREATE TABLE vehicles (
            id INTEGER PRIMARY KEY,
            plate TEXT UNIQUE,
            model TEXT,
            category TEXT,
            year INTEGER,
            odometer_km REAL,
            fuel_type TEXT,
            base_city TEXT,
            base_state TEXT,
            active INTEGER DEFAULT 1
        );

        CREATE TABLE drivers (
            id INTEGER PRIMARY KEY,
            name TEXT,
            license_id TEXT,
            experience_years INTEGER,
            base_city TEXT,
            hire_date TEXT,
            active INTEGER DEFAULT 1
        );

        CREATE TABLE trips (
            id INTEGER PRIMARY KEY,
            vehicle_id INTEGER,
            driver_id INTEGER,
            origin_city TEXT,
            destination_city TEXT,
            start_time TEXT,
            end_time TEXT,
            distance_km REAL,
            avg_speed_kmh REAL,
            weather TEXT,
            traffic_level TEXT,
            route_risk_score REAL,
            status TEXT,
            delay_minutes REAL,
            FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
            FOREIGN KEY(driver_id) REFERENCES drivers(id)
        );

        CREATE TABLE telemetry (
            id INTEGER PRIMARY KEY,
            vehicle_id INTEGER,
            trip_id INTEGER,
            timestamp TEXT,
            speed_kmh REAL,
            rpm REAL,
            engine_temp_c REAL,
            oil_pressure_psi REAL,
            brake_wear_pct REAL,
            tire_pressure_psi REAL,
            fuel_level_pct REAL,
            battery_voltage REAL,
            vibration_index REAL,
            harsh_braking INTEGER,
            harsh_accel INTEGER,
            FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        );

        CREATE TABLE driver_behavior (
            id INTEGER PRIMARY KEY,
            driver_id INTEGER,
            trip_id INTEGER,
            fatigue_score REAL,
            distraction_events INTEGER,
            speeding_events INTEGER,
            harsh_braking_events INTEGER,
            harsh_accel_events INTEGER,
            overall_score REAL,
            FOREIGN KEY(driver_id) REFERENCES drivers(id),
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        );

        CREATE TABLE maintenance (
            id INTEGER PRIMARY KEY,
            vehicle_id INTEGER,
            date TEXT,
            type TEXT,
            cost REAL,
            description TEXT,
            failure_occurred INTEGER,
            FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
        );

        CREATE TABLE alerts (
            id INTEGER PRIMARY KEY,
            vehicle_id INTEGER,
            driver_id INTEGER,
            trip_id INTEGER,
            timestamp TEXT,
            type TEXT,
            severity TEXT,
            message TEXT,
            resolved INTEGER,
            FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
            FOREIGN KEY(driver_id) REFERENCES drivers(id)
        );
        """
    )
    conn.commit()


def gen_vehicles(conn):
    cur = conn.cursor()
    rows = []
    for i in range(1, N_VEHICLES + 1):
        model, category = random.choice(VEHICLE_MODELS)
        year = random.randint(2012, 2025)
        age = 2026 - year
        odometer = max(5000, random.gauss(age * 55000, 20000))
        city, state = random.choice(CITIES)
        rows.append((
            i, f"{fake.bothify('???-####').upper()}", model, category, year,
            round(odometer, 1), random.choice(["Diesel S10", "Diesel S500", "Flex"]),
            city, state, 1,
        ))
    cur.executemany(
        "INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?,?,?)", rows
    )
    conn.commit()
    return rows


def gen_drivers(conn):
    cur = conn.cursor()
    rows = []
    for i in range(1, N_DRIVERS + 1):
        city, _ = random.choice(CITIES)
        hire_date = fake.date_between(start_date="-10y", end_date="-30d")
        rows.append((
            i, fake.name(), fake.bothify("###########"),
            random.randint(0, 30), city, hire_date.isoformat(), 1,
        ))
    cur.executemany("INSERT INTO drivers VALUES (?,?,?,?,?,?,?)", rows)
    conn.commit()
    return rows


def vehicle_health_factor(vehicle_row):
    """Fator 0-1: quanto maior, pior a saude do veiculo (mais velho/rodado)."""
    year = vehicle_row[4]
    odometer = vehicle_row[5]
    age = 2026 - year
    return min(1.0, (age / 14) * 0.6 + (odometer / 700000) * 0.4)


def gen_trips_telemetry_behavior_maintenance(conn, vehicles, drivers):
    cur = conn.cursor()
    trip_rows, telemetry_rows, behavior_rows, alert_rows = [], [], [], []
    telemetry_id = 1
    alert_id = 1
    maintenance_rows = []
    maintenance_id = 1

    vehicle_by_id = {v[0]: v for v in vehicles}
    now = datetime(2026, 8, 20)

    for trip_id in range(1, N_TRIPS + 1):
        is_live = trip_id > N_TRIPS - LIVE_TRIPS
        vehicle = random.choice(vehicles)
        driver = random.choice(drivers)
        origin, dest = random.sample(CITIES, 2)
        if is_live:
            # Viagens que estao acontecendo agora, para alimentar o painel operacional.
            start_time = now - timedelta(hours=random.uniform(0.2, 6))
            distance = round(random.uniform(150, 900), 1)
        else:
            start_time = now - timedelta(days=random.uniform(0, 365), hours=random.uniform(0, 23))
            distance = round(random.uniform(80, 2200), 1)
        avg_speed = round(random.uniform(55, 95), 1)
        duration_h = distance / avg_speed
        end_time = start_time + timedelta(hours=duration_h)
        if is_live:
            # Viagens ao vivo tem maior chance de clima/transito adversos, para gerar
            # situacoes reais de "sugestao de rota alternativa" no Kanban.
            weather = random.choices(WEATHER_CONDITIONS, weights=[22, 20, 20, 16, 14, 8])[0]
            traffic = random.choices(["leve", "moderado", "intenso"], weights=[30, 35, 35])[0]
        else:
            weather = random.choices(WEATHER_CONDITIONS, weights=[40, 25, 15, 8, 7, 5])[0]
            traffic = random.choices(["leve", "moderado", "intenso"], weights=[50, 35, 15])[0]

        health = vehicle_health_factor(vehicle)
        driver_exp = driver[3]
        fatigue_base = max(0, random.gauss(30 + duration_h * 2.5 - driver_exp * 0.5, 12))
        fatigue_score = min(100, max(0, fatigue_base + (10 if "23" in start_time.strftime("%H") else 0)))

        weather_risk = {"Ceu limpo": 0, "Nublado": 3, "Chuva leve": 12, "Chuva forte": 30,
                         "Neblina": 25, "Vento forte": 15}[weather]
        traffic_risk = {"leve": 2, "moderado": 10, "intenso": 22}[traffic]
        route_risk = min(100, round(weather_risk + traffic_risk + health * 20 + random.uniform(-5, 5), 1))

        delay = max(0, random.gauss(route_risk * 0.6, 15))
        status = "em_andamento" if (is_live or end_time >= now) else "concluida"

        trip_rows.append((
            trip_id, vehicle[0], driver[0], origin[0], dest[0],
            start_time.isoformat(), end_time.isoformat(), distance, avg_speed,
            weather, traffic, route_risk, status, round(delay, 1),
        ))

        harsh_braking_total = 0
        harsh_accel_total = 0
        for p in range(TELEMETRY_POINTS_PER_TRIP):
            ts = start_time + timedelta(hours=duration_h * p / TELEMETRY_POINTS_PER_TRIP)
            engine_temp = round(85 + health * 25 + random.gauss(0, 4), 1)
            oil_pressure = round(max(10, 55 - health * 25 + random.gauss(0, 4)), 1)
            brake_wear = round(min(100, health * 70 + random.uniform(0, 20)), 1)
            tire_pressure = round(max(60, 100 - random.uniform(0, 20) - health * 15), 1)
            fuel_level = round(max(5, 100 - (p / TELEMETRY_POINTS_PER_TRIP) * random.uniform(60, 95)), 1)
            battery_voltage = round(max(10.5, 13.8 - health * 1.5 + random.gauss(0, 0.3)), 2)
            vibration = round(health * 8 + random.uniform(0, 3), 2)
            hb = 1 if random.random() < (0.05 + fatigue_score / 500) else 0
            ha = 1 if random.random() < (0.05 + fatigue_score / 600) else 0
            harsh_braking_total += hb
            harsh_accel_total += ha

            telemetry_rows.append((
                telemetry_id, vehicle[0], trip_id, ts.isoformat(),
                round(random.uniform(40, 110), 1), round(random.uniform(1200, 2400), 0),
                engine_temp, oil_pressure, brake_wear, tire_pressure, fuel_level,
                battery_voltage, vibration, hb, ha,
            ))
            telemetry_id += 1

            if engine_temp > 118 or oil_pressure < 18:
                alert_rows.append((
                    alert_id, vehicle[0], driver[0], trip_id, ts.isoformat(),
                    "temperatura_motor" if engine_temp > 118 else "pressao_oleo_baixa",
                    "critica", "Parametro fora da faixa segura detectado pela telemetria.", 0,
                ))
                alert_id += 1

        speeding_events = random.randint(0, 6) if route_risk > 40 else random.randint(0, 2)
        distraction_events = random.randint(0, 4) if fatigue_score > 55 else random.randint(0, 1)
        overall_score = round(max(0, 100 - fatigue_score * 0.5 - speeding_events * 5
                                   - harsh_braking_total * 3 - distraction_events * 4), 1)

        behavior_rows.append((
            trip_id, driver[0], trip_id, round(fatigue_score, 1), distraction_events,
            speeding_events, harsh_braking_total, harsh_accel_total, overall_score,
        ))

        if fatigue_score > 70:
            alert_rows.append((alert_id, vehicle[0], driver[0], trip_id, end_time.isoformat(),
                                "fadiga_motorista", "alta",
                                "Sinais de fadiga acima do limite recomendado.", 0))
            alert_id += 1
        if route_risk > 65:
            alert_rows.append((alert_id, vehicle[0], driver[0], trip_id, start_time.isoformat(),
                                "clima_severo" if weather_risk > traffic_risk else "desvio_rota",
                                "media", "Rota com risco elevado identificado pela IA.", 0))
            alert_id += 1

    # Manutencao: gerar historico correlacionado com saude do veiculo
    for vehicle in vehicles:
        health = vehicle_health_factor(vehicle)
        n_events = int(random.uniform(1, 3) + health * 6)
        for _ in range(n_events):
            date = fake.date_between(start_date="-2y", end_date="today")
            failure = 1 if random.random() < (0.15 + health * 0.5) else 0
            mtype = random.choice(["preventiva", "corretiva", "revisao_periodica", "troca_pneus", "freios"])
            cost = round(random.uniform(300, 1200) if mtype == "preventiva" else random.uniform(800, 9000), 2)
            maintenance_rows.append((
                maintenance_id, vehicle[0], date.isoformat(), mtype, cost,
                f"Servico de {mtype.replace('_',' ')} registrado.", failure,
            ))
            maintenance_id += 1

    cur.executemany(
        "INSERT INTO trips VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", trip_rows
    )
    cur.executemany(
        "INSERT INTO telemetry VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", telemetry_rows
    )
    cur.executemany(
        "INSERT INTO driver_behavior VALUES (?,?,?,?,?,?,?,?,?)", behavior_rows
    )
    cur.executemany(
        "INSERT INTO maintenance VALUES (?,?,?,?,?,?,?)", maintenance_rows
    )
    cur.executemany(
        "INSERT INTO alerts VALUES (?,?,?,?,?,?,?,?,?)", alert_rows
    )
    conn.commit()


def main():
    if DB_PATH.exists():
        DB_PATH.unlink()
    conn = sqlite3.connect(DB_PATH)
    create_schema(conn)
    vehicles = gen_vehicles(conn)
    drivers = gen_drivers(conn)
    gen_trips_telemetry_behavior_maintenance(conn, vehicles, drivers)
    conn.close()
    print(f"Base sintetica gerada em: {DB_PATH}")
    print(f"Veiculos: {N_VEHICLES} | Motoristas: {N_DRIVERS} | Viagens: {N_TRIPS}")


if __name__ == "__main__":
    main()
