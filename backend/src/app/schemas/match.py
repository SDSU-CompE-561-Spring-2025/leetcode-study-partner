from datetime import datetime
from pydantic import BaseModel
from uuid import UUID
  
class MatchCreate(BaseModel):
    hostID: UUID
    guestID: UUID
    problemID: int

class MatchResponse(BaseModel):
    matchID: UUID
    hostID: UUID
    guestID: UUID
    problemID: int

    class Config:
        from_attributes = True

class MatchStart(BaseModel):
    matchID: UUID
    startTime: datetime

class MatchEnd(BaseModel):
    matchID: UUID
    status: bool
    
class MatchEndResponse(BaseModel):
    matchID: UUID
    status: bool
    endTime: datetime
    duration: int

    class Config:
        from_attributes = True

class MatchHistory(BaseModel):
    matchID: UUID
    hostID: UUID
    guestID: UUID
    status: bool
    duration: int
    
    class Config:
        from_attributes = True

class MatchDetails(BaseModel):
    matchID: UUID
    hostID: UUID
    guestID: UUID
    status: bool
    duration: int
    problemID: int
    startTime: datetime
    endTime: datetime
    
    class Config:
        from_attributes = True