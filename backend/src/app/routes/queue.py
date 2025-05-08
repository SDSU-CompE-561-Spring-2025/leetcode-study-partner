from app.core.auth import decode_access_token
from app.core.database import SessionLocal
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from uuid import UUID
from app.services.matchmaker import matchmaking_service
from app.schemas.queue import QueueTicket
import app.services.user as user_service
from app.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.websocket("/queue")
async def queue_websocket(websocket: WebSocket, db: Session = Depends(dependency=get_db)):
    await websocket.accept()

    try:
        init_data = await websocket.receive_json()
        token = init_data["token"]
        if not token:
            await websocket.close(code=1008, reason="Missing authentication token")
            return
        print(token)
        try:
            token_data = decode_access_token(token)
        except Exception as e:
            await websocket.close(code=1008, reason=f"Authentication failed: {str(e)}")
            return
        user_id = user_service.get_user_by_username(db, token_data.username).id
        ticket_data = init_data["ticket"]

        ticket = QueueTicket(user_id=user_id, **ticket_data)

        await matchmaking_service.register_connection(user_id, websocket)
        await matchmaking_service.add_to_queue(user_id, ticket)

        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception) as e:
        print(f"[queue] {'User ' + str(user_id) + ' disconnected' if isinstance(e, WebSocketDisconnect) else f'Error: {e}'}")
        await matchmaking_service.unregister_connection(user_id)
        await matchmaking_service.remove_from_queue(user_id)
        if not isinstance(e, WebSocketDisconnect):
            await websocket.close(code=1008, reason=f"Error: {str(e)}")
