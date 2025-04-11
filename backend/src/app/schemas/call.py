from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class CallBase(BaseModel):
    match_id: UUID
    host_id: UUID
    guest_id: UUID
    start_time: datetime
    end_time: datetime
    status: bool
    duration: int
    problem_link: str
    category: str

class CallCreate(CallBase):
    pass

class Call(CallBase):
    class Config:
        from_attributes = True
