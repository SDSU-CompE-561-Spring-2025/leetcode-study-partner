# tests/services/test_matchmaking.py

import pytest
import asyncio
from uuid import uuid4
from app.services.matchmaker import MatchmakingService
from app.schemas.queue import QueueTicket

@pytest.fixture
def matchmaking_service():
    return MatchmakingService()

@pytest.mark.asyncio
async def test_add_to_queue_adds_ticket(matchmaking_service):
    user_id = uuid4()
    ticket = QueueTicket(
        user_id=user_id,
        programming_languages=["Python", "JavaScript"],
        categories=["dynamic programming"]
    )
    await matchmaking_service.add_to_queue(user_id, ticket)
    assert user_id in matchmaking_service.queue
    assert matchmaking_service.queue[user_id] == ticket

@pytest.mark.asyncio
async def test_find_pairs_matches_by_lang_and_category(matchmaking_service):
    # Two users with compatible languages and categories
    user1 = uuid4()
    user2 = uuid4()
    
    ticket1 = QueueTicket(
        user_id=user1,
        programming_languages=["python"],
        categories=["arrays"]
    )
    
    ticket2 = QueueTicket(
        user_id=user2,
        programming_languages=["python", "java"],
        categories=["arrays", "graphs"]
    )
    
    await matchmaking_service.add_to_queue(user1, ticket1)
    await matchmaking_service.add_to_queue(user2, ticket2)
    
    pairs = await matchmaking_service.find_pairs()
    assert len(pairs) == 1
    assert (ticket1, ticket2) == pairs[0] or (ticket2, ticket1) == pairs[0]
