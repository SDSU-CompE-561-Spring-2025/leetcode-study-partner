from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class UserMatchHistoryBase(BaseModel):
    host_id: UUID
    guest_id: UUID
    start_time: datetime
    end_time: datetime
    status: bool
    duration: int
    problem_link: str
    category: str

class UserMatchHistoryCreate(UserMatchHistoryBase):
    pass

class UserMatchHistory(UserMatchHistoryBase):
    match_id: UUID

    class Config:
        from_attributes = True
