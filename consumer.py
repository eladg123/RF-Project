import redis
import json
import psycopg2
import io
from pymongo import MongoClient
from minio import Minio
from datetime import datetime

r = redis.Redis(host='localhost', port=6379, db=0)
mongo_client = MongoClient('mongodb://localhost:27017/')
mongo_db = mongo_client['rf_system']

minio_client = Minio("localhost:9000", access_key="minioadmin", secret_key="minioadmin", secure=False)
if not minio_client.bucket_exists("rf-data"):
    minio_client.make_bucket("rf-data")

pg_conn = psycopg2.connect("dbname=signals_db user=user password=password host=localhost port=5432")

def ensure_table_exists():
    with pg_conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS samples (
                id VARCHAR(50) PRIMARY KEY,
                timestamp TIMESTAMP,
                avg_val FLOAT,
                file_path TEXT
            )
        """)
        pg_conn.commit()

def process_data():
    ensure_table_exists()
    print("Consumer started. Waiting for data...")
    
    while True:
        result = r.brpop('rf_data_queue', timeout=0)
        if not result:
            continue
            
        _, message = result
        data = json.loads(message)
        
       
        samples = data['samples']
        avg = sum(samples[-5:]) / 5
        
        
        if avg > -40:
            alert = {
                "id": data['id'],
                "start_freq": data['start_freq'],
                "end_freq": data['end_freq'],
                "timestamp": data['timestamp'],
                "samples_window": samples[-5:],
                "average": avg
            }
            mongo_db.alerts.insert_one(alert)
            print(f"⚠️ Alert detected for {data['id']}")

        
        file_name = f"{data['id']}.json"
        json_bytes = json.dumps(data).encode('utf-8')
        minio_client.put_object(
            "rf-data", 
            file_name, 
            data=io.BytesIO(json_bytes), 
            length=len(json_bytes)
        )

       
        with pg_conn.cursor() as cur:
            cur.execute("""
                INSERT INTO samples (id, timestamp, avg_val, file_path) 
                VALUES (%s, %s, %s, %s)
            """, (data['id'], data['timestamp'], avg, file_name))
            pg_conn.commit()

        
        data['is_processed'] = True
        print(f"✅ Processed {data['id']}")

if __name__ == "__main__":
    process_data()