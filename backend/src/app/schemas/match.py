from datetime import datetime
from pydantic import BaseModel

# Need ideas
class MatchCreate(BaseModel):
    pass
  
class MatchHistory(MatchCreate):
    hostID: uuid.UUID
    guestID: uuid.UUID
    problemID: int
    status: bool
    duration: int

class MatchDetails(MatchCreate):
    matchID: uuid.UUID
    hostID: uuid.UUID
    guestID: uuid.UUID
    duration: datetime
    
class MatchStart(BaseModel):
    matchID: uuid.UUID
    startTime: datetime
    
class MatchEnd(BaseModel):
    matchID: uuid.UUID
    endTime: datetime
    status: bool
    
    
class MatchResponse(BaseModel):
    matchID: uuid.UUID
    hostID: uuid.UUID
    guestID: uuid.UUID
    status: bool
    duration: datetime
    startTime: datetime
    endTime: datetime
    
    class Config:
        orm_mode = True
    
class MatchHistoryResponse(BaseModel):
    matchID: uuid.UUID
    hostID: uuid.UUID
    guestID: uuid.UUID
    status: bool
    duration: datetime
    
    class Config:
        orm_mode = True