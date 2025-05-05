# tests/services/test_matchmaking.py

from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
import pytest
import asyncio
from uuid import uuid4
from app.services.matchmaker import MatchmakingService
from app.schemas.queue import ProgrammingLanguage, QueueTicket
from sqlalchemy import UUID

def make_queue_ticket(
    user_id: UUID | None = None,
    languages: list[ProgrammingLanguage] | None = None,
    categories: list[str] | None = None,
    match_id: UUID | None = None
) -> QueueTicket:
    return QueueTicket(
        user_id=user_id or uuid4(),
        programming_languages=languages or [ProgrammingLanguage.python],
        categories=categories or ["arrays"],
        queued_at=datetime.now(timezone.utc),
        resulting_match_id=match_id
    )

@pytest.mark.asyncio
@patch("app.services.match.create_match")
async def test_full_match_flow_with_connection_cleanup(mock_create_match):
    service = MatchmakingService()

    # Create user IDs and queue tickets
    user1 = uuid4()
    user2 = uuid4()
    ticket1 = make_queue_ticket(user_id=user1, languages=[ProgrammingLanguage.python], categories=["dp"])
    ticket2 = make_queue_ticket(user_id=user2, languages=[ProgrammingLanguage.python], categories=["dp"])

    # Add to queue
    await service.add_to_queue(user1, ticket1)
    await service.add_to_queue(user2, ticket2)

    # Register mock WebSocket connections
    mock_ws1 = AsyncMock()
    mock_ws2 = AsyncMock()
    await service.register_connection(user1, mock_ws1)
    await service.register_connection(user2, mock_ws2)

    # Stub match creation to return fake match object with match_id
    fake_match_id = uuid4()
    mock_create_match.return_value = MagicMock(match_id=fake_match_id)

    # Run matchmaking cycle
    mock_db = MagicMock()
    await service.execute_matchmaking_cycle(mock_db)

    # Assert DB call
    mock_create_match.assert_called_once()

    # Assert that send_json was called with match_found payload
    mock_ws1.send_json.assert_called_once()
    mock_ws2.send_json.assert_called_once()

    # Check payload structure (optional but recommended)
    args1 = mock_ws1.send_json.call_args[0][0]
    args2 = mock_ws2.send_json.call_args[0][0]
    assert args1["event"] == "match_found"
    assert args1["match_id"] == str(fake_match_id)
    assert args2["peer_id"] == str(user1)

    # Assert queue is cleared
    assert user1 not in service.queue
    assert user2 not in service.queue

    # ✅ NEW: Assert connections are cleaned up automatically
    assert user1 not in service.connections
    assert user2 not in service.connections