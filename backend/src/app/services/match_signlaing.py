# app/services/match_signaling.py
from typing import Dict, Set
from uuid import UUID
from fastapi import WebSocket
import asyncio

class MatchRoom:
    """Handles a single match's signaling room"""
    def __init__(self, match_id: UUID):
        self.match_id = match_id
        self.connections: Dict[UUID, WebSocket] = {}
        self.lock = asyncio.Lock()

    async def connect(self, user_id: UUID, websocket: WebSocket):
        async with self.lock:
            self.connections[user_id] = websocket
            print(f"[match:{self.match_id}] {user_id} joined")

    async def disconnect(self, user_id: UUID):
        async with self.lock:
            if user_id in self.connections:
                del self.connections[user_id]
                print(f"[match:{self.match_id}] {user_id} left")

    async def relay(self, sender_id: UUID, message: dict):
        """Relay signaling message to the other user in the room"""
        async with self.lock:
            for uid, ws in self.connections.items():
                if uid != sender_id:
                    try:
                        await ws.send_json(message)
                    except Exception as e:
                        print(f"Relay failed to {uid}: {e}")

class MatchSignalingService:
    def __init__(self):
        self.rooms: Dict[UUID, MatchRoom] = {}
        self.lock = asyncio.Lock()

    async def get_or_create_room(self, match_id: UUID) -> MatchRoom:
        async with self.lock:
            if match_id not in self.rooms:
                self.rooms[match_id] = MatchRoom(match_id)
            return self.rooms[match_id]

    async def cleanup_room(self, match_id: UUID):
        """Remove room if empty"""
        async with self.lock:
            room = self.rooms.get(match_id)
            if room and not room.connections:
                del self.rooms[match_id]
                print(f"[match:{match_id}] Room cleaned up")

# Singleton instance
match_signaling_service = MatchSignalingService()
