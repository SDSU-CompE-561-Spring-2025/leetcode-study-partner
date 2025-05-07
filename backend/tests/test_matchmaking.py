from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
import pytest
import asyncio
from uuid import uuid4, UUID
from app.services.matchmaker import MatchmakingService
from app.services.match_signaling import MatchSignalingService
from app.schemas.queue import ProgrammingLanguage, QueueTicket

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
async def test_full_backend_match_and_signaling(mock_create_match):
    # Initialize services
    matchmaking = MatchmakingService()
    signaling = MatchSignalingService()

    # Set user UUIDs
    user1 = UUID("6b3af3da-1e7a-4e34-9991-eeed0f14dff7")
    user2 = UUID("1a9d5cf4-a7b6-4173-b4d4-0b5a929172aa")

    # Create queue tickets
    ticket1 = make_queue_ticket(user_id=user1, languages=[ProgrammingLanguage.python], categories=["dp"])
    ticket2 = make_queue_ticket(user_id=user2, languages=[ProgrammingLanguage.python], categories=["dp"])

    # Add to queue
    await matchmaking.add_to_queue(user1, ticket1)
    await matchmaking.add_to_queue(user2, ticket2)

    # Register fake WebSocket connections
    mock_ws1 = AsyncMock()
    mock_ws2 = AsyncMock()
    await matchmaking.register_connection(user1, mock_ws1)
    await matchmaking.register_connection(user2, mock_ws2)

    # Stub DB match creation
    fake_match_id = uuid4()
    mock_create_match.return_value = MagicMock(match_id=fake_match_id)

    # Run matchmaking
    mock_db = MagicMock()
    await matchmaking.execute_matchmaking_cycle(mock_db)

    # ✅ Match notifications sent
    mock_ws1.send_json.assert_called_once()
    mock_ws2.send_json.assert_called_once()

    # Extract signaling info
    payload1 = mock_ws1.send_json.call_args[0][0]
    payload2 = mock_ws2.send_json.call_args[0][0]

    assert payload1["match_id"] == str(fake_match_id)
    assert payload2["match_id"] == str(fake_match_id)

    
    # ✅ Reset mocks now, to isolate signaling test
    mock_ws1.send_json.reset_mock()
    mock_ws2.send_json.reset_mock()

    # ✅ Create signaling room
    room = await signaling.get_or_create_room(fake_match_id)

    # Connect users to signaling room
    await room.connect(user1, mock_ws1)
    await room.connect(user2, mock_ws2)

    # ✅ Simulate signaling message: user1 sends offer to user2
    offer = {
        "type": "offer",
        "sdp": "fake_sdp_offer"
    }
    await room.relay(sender_id=user1, message=offer)

    # user2 should have received it, and it should be printed from relay()
    assert mock_ws2.send_json.call_count == 1
    assert mock_ws2.send_json.call_args[0][0]["type"] == "offer"
    mock_ws2.send_json.reset_mock()

    # ✅ Simulate user2 responding with answer
    answer = {
        "type": "answer",
        "sdp": "fake_sdp_answer"
    }
    await room.relay(sender_id=user2, message=answer)

    # user1 should receive the answer, which is also printed from relay()
    assert mock_ws1.send_json.call_count == 1
    assert mock_ws1.send_json.call_args[0][0]["type"] == "answer"

    # ✅ Disconnect both users
    await room.disconnect(user1)
    await room.disconnect(user2)

    # ✅ Clean up the room
    await signaling.cleanup_room(fake_match_id)
    assert fake_match_id not in signaling.rooms
