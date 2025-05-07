
from uuid import UUID

from app.core.auth import decode_access_token
from app.dependencies import get_db
from app.models.user import User
from app.services.match import get_match_by_id
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Query
from app.services.match_signaling import match_signaling_service
from sqlalchemy.orm import Session

router = APIRouter()


# @router.websocket("/match/{match_id}")
# async def match_signaling_endpoint(
#     websocket: WebSocket,
#     match_id: UUID,
#     db: Session = Depends(get_db)
# ):
    
#     print(f"🔌 WS connection incoming: match={match_id}")

#     # ✅ Check if the match exists and includes the user
#     match = get_match_by_id(db, match_id)
#     if not match:
#         print(f"[match WS] Match {match_id} not found")
#         await websocket.close(code=1008)
#         return


#     # ✅ All good, accept the connection
#     await websocket.accept()

#     room = await match_signaling_service.get_or_create_room(match_id)

#     # Send confirmation event
#     await websocket.send_json({"event": "room_ready"})

#     await room.connect(match_id, websocket)

#     try:
#         while True:
#             data = await websocket.receive_json()
#             await room.relay(match_id, data)
#     except WebSocketDisconnect:
#         await room.disconnect(match_id)
#         await match_signaling_service.cleanup_room(match_id)

@router.websocket("/match/{match_id}")
async def queue_websocket(websocket: WebSocket, db: Session = Depends(dependency=get_db)):
    await websocket.accept()
    try:

        while True:
            await websocket.receive_text()
    except (WebSocketDisconnect, Exception) as e:
        if not isinstance(e, WebSocketDisconnect):
            await websocket.close(code=1008, reason=f"Error: {str(e)}")