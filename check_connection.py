import redis
from pymongo import MongoClient
import psycopg2
from minio import Minio

def check_connections():
    # Redis
    try:
        r = redis.Redis(host='localhost', port=6379, db=0)
        r.ping()
        print("✅ Redis connected!")
    except Exception as e:
        print(f"❌ Redis failed: {e}")

    # MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017/')
        client.admin.command('ping')
        print("✅ MongoDB connected!")
    except Exception as e:
        print(f"❌ MongoDB failed: {e}")

    # Postgres
    try:
        conn = psycopg2.connect("dbname=signals_db user=user password=password host=localhost port=5432")
        conn.close()
        print("✅ PostgreSQL connected!")
    except Exception as e:
        print(f"❌ PostgreSQL failed: {e}")

    # MinIO
    try:
        client = Minio("localhost:9000", access_key="minioadmin", secret_key="minioadmin", secure=False)
        client.list_buckets()
        print("✅ MinIO connected!")
    except Exception as e:
        print(f"❌ MinIO failed: {e}")

if __name__ == "__main__":
    check_connections()