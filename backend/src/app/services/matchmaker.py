from typing import List, Tuple, Dict, Set
from uuid import UUID
from sqlalchemy.orm import Session
import asyncio
from fastapi import WebSocket
from app.schemas.match import MatchCreate
from app.schemas.queue import QueueTicket
import app.services.match as match_service

class MatchmakingService:
    def __init__(self):
        # Queue state
        self.queue: Dict[UUID, QueueTicket] = {}
        self.queue_lock = asyncio.Lock()
        
        # Active connections
        self.connections: Dict[UUID, WebSocket] = {}
        self.conn_lock = asyncio.Lock()
        
        # Track matched users to prevent duplicate processing
        self.matched_pairs: Set[Tuple[UUID, UUID]] = set()
    
    async def add_to_queue(self, user_id: UUID, ticket: QueueTicket):
        async with self.queue_lock:
            if user_id not in self.queue:
                self.queue[user_id] = ticket
                print(f"Added {user_id} to queue. Queue size: {len(self.queue)}")

    async def remove_from_queue(self, user_id: UUID):
        async with self.queue_lock:
            if user_id in self.queue:
                del self.queue[user_id]
                print(f"Removed {user_id} from queue")

    async def register_connection(self, user_id: UUID, websocket: WebSocket):
        async with self.conn_lock:
            self.connections[user_id] = websocket
            print(f"Registered connection for {user_id}")

    async def unregister_connection(self, user_id: UUID):
        async with self.conn_lock:
            if user_id in self.connections:
                del self.connections[user_id]
                print(f"Unregistered connection for {user_id}")

    async def find_pairs(self) -> List[Tuple[QueueTicket, QueueTicket]]:
        """Core matching algorithm"""
        async with self.queue_lock:
            candidates = list(self.queue.values())
        
        pairs = []
        processed = set()
        
        for i, ticket_a in enumerate(candidates):
            if ticket_a.user_id in processed:
                continue
                
            for j, ticket_b in enumerate(candidates[i+1:]):
                if ticket_b.user_id in processed:
                    continue
                    
                # Match condition check
                shared_lang = bool(
                    set(ticket_a.programming_languages) & 
                    set(ticket_b.programming_languages)
                )
                shared_cat = bool(
                    set(ticket_a.categories) & 
                    set(ticket_b.categories)
                )
                
                if shared_lang and shared_cat:
                    pairs.append((ticket_a, ticket_b))
                    processed.update({ticket_a.user_id, ticket_b.user_id})
                    break
        
        return pairs

    async def create_match(self, pair: Tuple[QueueTicket, QueueTicket], db: Session) -> UUID:
        """Database interaction"""
        shared_cats = list(
            set(pair[0].categories) & 
            set(pair[1].categories)
        )
        
        # Get problem ID - replace with real implementation
        problem_id = 1  # await self._find_problem_id(shared_cats, db)
        
        match_data = MatchCreate(
            host_id=pair[0].user_id,
            guest_id=pair[1].user_id,
            problem_id=problem_id
        )
        
        db_match = match_service.create_match(db, match_data)
        return db_match.match_id
    
    async def notify_match(self, user_id: UUID, match_id: UUID, peer_id: UUID, role: str):
        async with self.conn_lock:
            websocket = self.connections.get(user_id)

        if not websocket:
            print(f"[notify_match] User {user_id} disconnected before notification")
            return

        try:
            await websocket.send_json({
                "event": "match_found",
                "match_id": str(match_id),
                "signaling_url": f"/match/{match_id}",
                "peer_id": str(peer_id),
                "role": role
            })
        except Exception as e:
            print(f"[notify_match] Failed to notify {user_id}: {e}")
        finally:
            await self.unregister_connection(user_id)

    async def execute_matchmaking_cycle(self, db: Session):
        """Full matchmaking workflow (run every few seconds)"""
        pairs = await self.find_pairs()
        if not pairs:
            return

        for pair in pairs:
            host, guest = pair

            # Create match in DB
            match_id = await self.create_match(pair, db)

            # Send signaling info
            await self.notify_match(host.user_id, match_id, guest.user_id, "host")
            await self.notify_match(guest.user_id, match_id, host.user_id, "guest")

            # Remove from queue (they’re moving on)
            await self.remove_from_queue(host.user_id)
            await self.remove_from_queue(guest.user_id)

    async def execute_matchmaking_cycle(self, db: Session):
        """Full matchmaking workflow"""
        pairs = await self.find_pairs()
        if not pairs:
            return
        
        # Process pairs
        for pair in pairs:
            host, guest = pair
            match_id = await self.create_match(pair, db)
            
            # Send notifications
            await self.notify_match(host.user_id, match_id, guest.user_id, "host")
            await self.notify_match(guest.user_id, match_id, host.user_id, "guest")
            
            # Cleanup
            await self.remove_from_queue(host.user_id)
            await self.remove_from_queue(guest.user_id)

# Singleton instance for the service
matchmaking_service = MatchmakingService()