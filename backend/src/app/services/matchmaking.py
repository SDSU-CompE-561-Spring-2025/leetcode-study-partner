from typing import List, Tuple
from uuid import UUID
from app.schemas.match import MatchCreate
from app.schemas.queue import QueueTicket
from sqlalchemy.orm import Session
import asyncio

from fastapi import Depends, WebSocket

# global matchmaking queue
queue: dict[UUID, QueueTicket] = {}
queue_lock: asyncio.Lock = asyncio.Lock()

websocket_connections: dict[UUID, WebSocket] = {}
websocket_lock: asyncio.Lock = asyncio.Lock()

async def cleanup_disconnected_users():
    dead_users = []
    async with websocket_lock:
        for user_id, connection in websocket_connections.items():
            if connection.client_state == WebSocket.CLOSED:
                dead_users.append(user_id)

    if dead_users:
        async with websocket_lock:
            for user_id in dead_users:
                del websocket_connections[user_id]

        async with queue_lock:
            for user_id in dead_users:
                del queue[user_id]

async def find_matchmaking_pairs():
    async with queue_lock:
        if len(queue) < 2:
            return None

        user_ids = list(queue.keys())
        matched_pairs: List[Tuple[QueueTicket,QueueTicket]] = []

        for i, user_id_a in enumerate(user_ids):
            ticket_a = queue[user_id_a]

        for user_id_b in user_ids[i + 1:]:
            ticket_b = queue[user_id_b]

            shared_lang = set(ticket_a.languages).intersection(ticket_b.languages)
            shared_categories = set(ticket_a.categories).intersection(ticket_b.categories)

            if shared_lang and shared_categories:
                matched_pairs.append((queue[user_id_a], queue[user_id_b]))
                break

        return matched_pairs

async def create_matches_from_pairs(pairs: List[Tuple[QueueTicket,QueueTicket]]):
    for pair in pairs:
        match = MatchCreate(
            hostID=pairs[0].user_id,
            guestID=pairs[1].user_id,
            problemID=1 # placeholder
        )



async def matchmaking_poll():
    cleanup_disconnected_users()