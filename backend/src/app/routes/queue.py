from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from uuid import UUID
from app.services.matchmaker import matchmaking_service
from app.schemas.queue import QueueTicket

router = APIRouter()

@router.websocket("/queue")
async def queue_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        init_data = await websocket.receive_json()
        user_id = UUID(init_data["user_id"])
        ticket_data = init_data["ticket"]

        ticket = QueueTicket(user_id=user_id, **ticket_data)

        await matchmaking_service.register_connection(user_id, websocket)
        await matchmaking_service.add_to_queue(user_id, ticket)

        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print(f"[queue] User {user_id} disconnected")
        await matchmaking_service.unregister_connection(user_id)
        await matchmaking_service.remove_from_queue(user_id)