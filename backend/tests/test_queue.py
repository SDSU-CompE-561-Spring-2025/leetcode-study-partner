# test_queue.py

import websocket
import json
import threading
import time
import uuid

BASE_WS_URL = "ws://localhost:8000/ws/queue"

# Store match ID results here
match_results = {}

def run_user(user_id, langs, categories, role_label):
    def on_message(ws, message):
        data = json.loads(message)
        print(f"[{role_label}] 🎯 Received:", data)
        if data["event"] == "match_found":
            match_results[role_label] = data
            ws.close()

    def on_error(ws, error):
        print(f"[{role_label}] ❌ Error:", error)

    def on_close(ws, close_status_code, close_msg):
        print(f"[{role_label}] 🔌 Closed connection")

    def on_open(ws):
        print(f"[{role_label}] ✅ Connected")
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
        on_open=on_open,
        on_error=on_error,
        on_close=on_close
    )
    ws.run_forever()

# Simulate two compatible users
user1_id = "6b3af3da-1e7a-4e34-9991-eeed0f14dff7"
user2_id = "1a9d5cf4-a7b6-4173-b4d4-0b5a929172aa"

thread1 = threading.Thread(target=run_user, args=(user1_id, ["Python"], ["Array", "Hash Table"], "user1"))
thread2 = threading.Thread(target=run_user, args=(user2_id, ["Python"], ["Array", "Hash Table"], "user2"))

thread1.start()
time.sleep(1)  # slight stagger for testing
thread2.start()

# Wait for matchmaking to complete
print("⏳ Waiting for match...")
timeout = 10  # seconds
elapsed = 0
while elapsed < timeout:
    if "user1" in match_results and "user2" in match_results:
        break
    time.sleep(1)
    elapsed += 1

if "user1" in match_results and "user2" in match_results:
    print("\n✅ Match Successful!")
    print("Match ID:", match_results["user1"]["match_id"])
    print("Signaling URL:", match_results["user1"]["signaling_url"])
    print("User1 Role:", match_results["user1"]["role"])
    print("User2 Role:", match_results["user2"]["role"])
else:
    print("\n❌ Match did not complete in time.")
