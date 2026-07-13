from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from pymongo import MongoClient
from minio import Minio
import json

app = FastAPI()

# הגדרת CORS כדי שהדשבורד ב-React יוכל לגשת ל-API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# חיבורים
pg_conn = psycopg2.connect("dbname=signals_db user=user password=password host=localhost port=5432")
mongo_client = MongoClient('mongodb://localhost:27017/')
mongo_db = mongo_client['rf_system']
minio_client = Minio("localhost:9000", access_key="minioadmin", secret_key="minioadmin", secure=False)

@app.get("/samples")
def get_samples(freq: float = None):
    cur = pg_conn.cursor()
    cur.execute("SELECT id, timestamp, avg_val, file_path FROM samples ORDER BY timestamp DESC LIMIT 50")
    samples = cur.fetchall()
    cur.close()
    return [{"id": s[0], "timestamp": s[1], "avg_val": s[2], "file_path": s[3]} for s in samples]

@app.get("/raw/{sample_id}")
def get_raw_data(sample_id: str):
    try:
        response = minio_client.get_object("rf-data", f"{sample_id}.json")
        return json.loads(response.data.decode('utf-8'))
    except Exception:
        raise HTTPException(status_code=404, detail="Sample not found")

@app.get("/alerts")
def get_alerts():
    alerts = list(mongo_db.alerts.find({}, {"_id": 0}))
    return alerts