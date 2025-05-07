from app.core.auth import decode_access_token
from app.schemas.matchmaking import WebRTCSignal
from app.schemas.queue import QueueTicket, QueueTicketCreate
from fastapi.responses import HTMLResponse
from app.schemas.user import UserResponse, UserCreate
from fastapi import APIRouter, Depends, WebSocket
from fastapi import WebSocketDisconnect
import app.services.matchmaking as mm

import app.services.user as user_service
from app.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter()


# Temporary HTML for WebSocket
# This would be handled on the frontend application

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendConnect(event)">
            <input type="text" id="jwt_token" autocomplete="off", placeholder="JWT Token"/>
            <button>Connect</button>
        </form>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off", placeholder="json"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws;
            function sendConnect(event) {
                var input = document.getElementById("jwt_token")
                ws = new WebSocket("wss://localhost:8000/ws/connect?token=" + encodeURIComponent(input.value));
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode("Connected to WebSocket")
                message.appendChild(content)
                messages.appendChild(message)
                event.preventDefault()
                ws.onmessage = function(event) {
                    var messages = document.getElementById('messages')
                    var message = document.createElement('li')
                    var content = document.createTextNode(event.data)
                    message.appendChild(content)
                    messages.appendChild(message)
                };
            }
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

# Idk seems right
@router.get("/")
async def websocket_endpoint():
    return HTMLResponse(html)

# IDK SEEMS RIGHT...?
@router.websocket("/connect")
async def websocket_connect(websocket: WebSocket, db: Session = Depends(dependency=get_db)):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008, reason="Missing authentication token")
        return
        
    try:
        token_data = decode_access_token(token)
    except Exception as e:
        await websocket.close(code=1008, reason=f"Authentication failed: {str(e)}")
        return
        
    try:
        user = user_service.get_user_by_username(db, token_data.username)
        if not user:
            await websocket.close(code=1008, reason="User not found")
            return
    except Exception as e:
        await websocket.close(code=1008, reason=f"Error retrieving user: {str(e)}")
        return
        
    
    try:
        await websocket.accept()
        print(f"WebSocket accepted for user {user.id}")
    except Exception as e:
        print(f"Error accepting WebSocket: {e}")
        return
    
    # Register the websocket connection
    async with mm.websocket_lock:
        mm.websocket_connections[user.id] = websocket
    
    try:
        while True:
            # Wait for messages from the client
            try:
                message = await websocket.receive_json()
                print(f"Received message from user {user.id}: {message}")
            except Exception as e:
                print(f"Error receiving message: {e}")
                break
                
            event = message.get("event")
            # Handle different events
            if event == "disconnect":
                # Handle disconnection
                print(f"User {user.id} disconnected")
                async with mm.websocket_lock:
                    if user.id in mm.websocket_connections:
                        del mm.websocket_connections[user.id]
                await websocket.close()
                async with mm.queue_lock:
                    if user.id in mm.queue:
                        del mm.queue[user.id]
                        print(f"Removed user {user.id} from queue due to disconnection")
                break
            if event == "signal":
                try:
                    signal_data = WebRTCSignal(
                        to = message.get("to"),
                        data = message.get("data")
                    )
                except Exception as e:
                    print(f"Error parsing signal data: {e}")
                    await websocket.send_json({"error": "Invalid signal data"})
                    continue
                async with mm.websocket_lock:
                    target_connection = mm.websocket_connections.get(signal_data.to)
                    if not target_connection:
                        await websocket.send_json({"error": "Target user not connected"})
                        continue
                    await target_connection.send_json(signal_data.model_dump())
                    continue

            if event == "create_ticket":
                # Handle ticket creation
                print(f"Creating ticket for user {user.id}")
                # Validate the message structure
                if not all(key in message for key in ["programming_languages", "categories"]):
                    await websocket.send_json({"error": "Invalid ticket data"})
                    continue
                # Create a QueueTicket object and add it to the queue
                ticketRequest = QueueTicketCreate(**message)
                ticket = QueueTicket(
                    user_id=user.id,
                    programming_languages=ticketRequest.programming_languages,
                    categories=ticketRequest.categories,
                )
                print(ticket)
                async with mm.queue_lock:
                    mm.queue[ticket.user_id] = ticket
                    continue
            print("Unknown event type")
            await websocket.send_json({"error": "Unknown event type"})
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for user {user.id}")
        # Clean up the resources immediately when disconnection is detected
        async with mm.websocket_lock:
            if user.id in mm.websocket_connections:
                del mm.websocket_connections[user.id]
        
        async with mm.queue_lock:
            if user.id in mm.queue:
                del mm.queue[user.id]
                print(f"Removed user {user.id} from queue due to disconnection")
    except Exception as e:
        print(f"Error in websocket connection: {e}")
        # Also clean up on any other exceptions
        async with mm.websocket_lock:
            if user.id in mm.websocket_connections:
                del mm.websocket_connections[user.id]
        
        async with mm.queue_lock:
            if user.id in mm.queue:
                del mm.queue[user.id]
