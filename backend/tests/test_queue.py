# test_queue.py
import websocket
import json
import threading
import time
import uuid

BASE_WS_URL = "ws://localhost:8000/queue"

def run_user(user_id, langs, categories):
    def on_message(ws, message):
        data = json.loads(message)
        print(f"[{user_id}] Received:", data)
        if data["event"] == "match_found":
            ws.close()

    def on_open(ws):
        ticket_payload = {
            "user_id": str(user_id),
            "ticket": {
                "programming_languages": langs,
                "categories": categories
            }
        }
        ws.send(json.dumps(ticket_payload))

    ws = websocket.WebSocketApp(
        BASE_WS_URL,
        on_message=on_message,
        on_open=on_open
    )
    ws.run_forever()

# Simulate two users with matching preferences
user1_id = uuid.uuid4()
user2_id = uuid.uuid4()

thread1 = threading.Thread(target=run_user, args=(user1_id, ["Python"], ["dp"]))
thread2 = threading.Thread(target=run_user, args=(user2_id, ["Python"], ["dp"]))

thread1.start()
time.sleep(1)  # slight delay to stagger connections
thread2.start()
