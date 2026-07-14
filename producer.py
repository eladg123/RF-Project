import redis
import json
import time
import uuid
import random
from datetime import datetime

r = redis.Redis(host='localhost', port=6379, db=0)

def generate_packet():
    start_freq = random.randint(100, 500)
    rbw = 0.1
    end_freq = start_freq + random.randint(10, 50)
    num_points = int((end_freq - start_freq) / rbw)
    
    packet = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "rbw": rbw,
        "start_freq": start_freq,
        "end_freq": end_freq,
        "num_points": num_points,
        "samples": [random.uniform(-120, -20) for _ in range(num_points)],
        "is_processed": False
    }
    return packet

def run_producer():
    print("Producer started. Sending data to Redis...")
    while True:
        packet = generate_packet()
        r.lpush('rf_data_queue', json.dumps(packet))
        print(f"Sent packet: {packet['id']}")
        time.sleep(2) 

if __name__ == "__main__":
    run_producer()