
from uuid import UUID

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.services.match_signlaing import match_signaling_service

router = APIRouter()


@router.websocket("/match/{match_id}")
async def match_signaling_endpoint(websocket: WebSocket, match_id: UUID, user_id: UUID):
    await websocket.accept()
    room = await match_signaling_service.get_or_create_room(match_id)
    await room.connect(user_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            await room.relay(user_id, data)
    except WebSocketDisconnect:
        await room.disconnect(user_id)
        await match_signaling_service.cleanup_room(match_id)