from app.schemas.queue import QueueTicket
import asyncio

# global matchmaking queue
queue: dict[int, QueueTicket] = {}
queue_lock = asyncio.Lock()

