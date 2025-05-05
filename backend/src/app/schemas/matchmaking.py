from uuid import UUID
from pydantic import BaseModel


class WebRTCSignal(BaseModel):
    to: UUID
    data: dict # signaling data can be any JSON serializable object