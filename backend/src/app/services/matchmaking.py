from typing import List, Tuple
from uuid import UUID
from app.schemas.match import MatchCreate
from app.schemas.queue import QueueTicket
from sqlalchemy.orm import Session
import app.services.match as match_service
import asyncio

from fastapi import Depends, WebSocket
from starlette.websockets import WebSocketDisconnect
from app.models.problem import Problem
import random

# global matchmaking queue
queue: dict[UUID, QueueTicket] = {}
queue_lock: asyncio.Lock = asyncio.Lock()

websocket_connections: dict[UUID, WebSocket] = {}
websocket_lock: asyncio.Lock = asyncio.Lock()

# The cleanup_disconnected_users function has been removed as disconnections are now
# handled directly in the WebSocket connection handler

async def find_matchmaking_pairs():
    async with queue_lock:
        if len(queue) < 2:
            return []

        user_ids = list(queue.keys())
        matched_pairs: List[Tuple[QueueTicket,QueueTicket]] = []

        for i, user_id_a in enumerate(user_ids):
            ticket_a = queue[user_id_a]
            
            for user_id_b in user_ids[i + 1:]:
                ticket_b = queue[user_id_b]

                shared_lang = set(ticket_a.programming_languages).intersection(ticket_b.programming_languages)
                shared_categories = set(ticket_a.categories).intersection(ticket_b.categories)

                if shared_lang and shared_categories:
                    matched_pairs.append((queue[user_id_a], queue[user_id_b]))
                    break

        return matched_pairs

async def find_problem_id_from_preferences(categories: list[str], db: Session = None):
    # If "None" is in categories, include uncategorized problems
    include_uncategorized = "None" in categories
    filtered_categories = [c for c in categories if c != "None"]
    
    # Build query step by step to avoid boolean operation errors
    query = db.query(Problem)
    
    # Create the appropriate filtering conditions
    if filtered_categories and include_uncategorized:
        # Either match one of the categories OR it has no categories
        query = query.filter(
            (Problem.categories.overlap(filtered_categories)) | 
            (Problem.categories == None)
        )
    elif filtered_categories:
        # Only match the specified categories
        query = query.filter(Problem.categories.overlap(filtered_categories))
    elif include_uncategorized:
        # Only include uncategorized problems
        query = query.filter(Problem.categories == None)
    else:
        return None
        
    problems = query.all()
    if not problems:
        return None

    # Score problems by number of shared categories
    scored = []
    for p in problems:
        if p.categories:
            shared = len(set(p.categories) & set(filtered_categories))
        else:
            shared = 0
        scored.append((p, shared))
    # Sort by shared count descending
    scored.sort(key=lambda x: x[1], reverse=True)
    # Weighted random selection: more weight for higher shared count
    weights = []
    for s in scored:
        if not s[0].categories:
            # Uncategorized problems get half weight
            weights.append(max(1, s[1]) * 0.5)
        else:
            weights.append(max(1, s[1]))
    selected = random.choices(scored, weights=weights, k=1)[0][0]
    return selected.problem_id

async def create_matches_from_pairs(pairs: List[Tuple[QueueTicket,QueueTicket]], db: Session):
    created_match_ids = []
    for pair in pairs:
        shared_categories = list(set(pair[0].categories).intersection(pair[1].categories))
        problem_id = await find_problem_id_from_preferences(
            categories=shared_categories,
            db=db
        )
        
        match = MatchCreate(
            host_id=pair[0].user_id,
            guest_id=pair[1].user_id,
            problem_id=problem_id
        )
        created_match = match_service.create_match(db, match)
        created_match_ids.append(created_match.match_id)
        
        # Update the tickets with the resulting match ID
        pair[0].resulting_match_id = created_match.match_id
        pair[1].resulting_match_id = created_match.match_id
    
    return created_match_ids

async def notify_matched_users(matched_pairs: List[Tuple[QueueTicket, QueueTicket]]):
    """Notify users that they have been matched."""
    async with websocket_lock:
        print("Accessing websocket connections.")
        for pair in matched_pairs:
            host_id = pair[0].user_id
            guest_id = pair[1].user_id
            match_id = pair[0].resulting_match_id
            print(f"Notifying host {host_id} and guest {guest_id} of match {match_id}")
            
            # Send notification to host
            if host_id in websocket_connections:
                try:
                    await websocket_connections[host_id].send_json({
                        "event": "match_found",
                        "match_id": str(match_id),
                        "role": "host",
                        "peer_id": str(guest_id)
                    })
                except Exception as e:
                    print(f"Error sending match notification to host {host_id}: {e}")
            
            # Send notification to guest
            if guest_id in websocket_connections:
                try:
                    await websocket_connections[guest_id].send_json({
                        "event": "match_found",
                        "match_id": str(match_id),
                        "role": "guest",
                        "peer_id": str(host_id)
                    })
                except Exception as e:
                    print(f"Error sending match notification to guest {guest_id}: {e}")

async def remove_matched_users_from_queue(matched_pairs: List[Tuple[QueueTicket, QueueTicket]]):
    """Remove matched users from the queue."""
    matched_user_ids = set()
    for pair in matched_pairs:
        matched_user_ids.add(pair[0].user_id)
        matched_user_ids.add(pair[1].user_id)
    
    async with queue_lock:
        for user_id in matched_user_ids:
            if user_id in queue:
                del queue[user_id]

async def matchmaking_poll(db: Session):
    """Main matchmaking loop that runs continuously to match users."""
    poll_interval = 5  # seconds between matchmaking attempts
    
    while True:
        try:
            # No need to clean up disconnected users as this is handled
            # directly in the WebSocket connection handler
            
            # Find pairs of users that can be matched
            matched_pairs = await find_matchmaking_pairs()
            
            if matched_pairs:
                # Create match entries in the database
                await create_matches_from_pairs(matched_pairs, db)
                
                # Notify matched users via WebSocket
                await notify_matched_users(matched_pairs)
                
                # Remove matched users from the queue
                await remove_matched_users_from_queue(matched_pairs)
                
                print(f"Created {len(matched_pairs)} matches")
            
            # Sleep to avoid excessive CPU usage
            await asyncio.sleep(poll_interval)
            
        except Exception as e:
            print(f"Error in matchmaking poll: {e}")
            # Continue the loop even if there's an error
            await asyncio.sleep(poll_interval)
