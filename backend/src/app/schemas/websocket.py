from datetime import datetime
from fastapi import WebSocket
from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID


class WebsocketConnection(BaseModel):
    user_id: UUID = Field(...)
    username: str = Field(...)
    websocket: WebSocket
    connected_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )
