from datetime import datetime
from pydantic import BaseModel
from uuid import UUID
  
class MatchHistory(BaseModel):
    hostID: UUID
    guestID: UUID
    problemID: int
    status: bool
    duration: int

class MatchDetails(BaseModel):
    matchID: UUID
    hostID: UUID
    guestID: UUID
    duration: int
    
class MatchStart(BaseModel):
    matchID: UUID
    startTime: datetime
    
class MatchEnd(BaseModel):
    matchID: UUID
    endTime: datetime
    status: bool
    
    
class MatchUpdate(BaseModel):
    matchID: UUID
    hostID: UUID
    guestID: UUID
    status: bool
    duration: int
    startTime: datetime
    endTime: datetime
    
    class Config:
        orm_mode = True
    
class MatchHistoryUpdate(BaseModel):
    matchID: UUID
    hostID: UUID
    guestID: UUID
    status: bool
    duration: int
    
    class Config:
        orm_mode = True