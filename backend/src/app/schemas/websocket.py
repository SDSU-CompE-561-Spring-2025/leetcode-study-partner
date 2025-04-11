from datetime import datetime
from fastapi import WebSocket
from pydantic import BaseModel, ConfigDict, Field


class WebsocketConnection(BaseModel):
    user_id: int = Field(...)
    username: str = Field(...)
    websocket: WebSocket
    connected_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        arbirtaty_types=True
    )
