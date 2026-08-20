import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "fleetmind.db"


def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn
