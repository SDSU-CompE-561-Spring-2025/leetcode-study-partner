from datetime import datetime
from pydantic import BaseModel
from uuid import UUID
  
class MatchCreate(BaseModel):
    host_id: UUID
    guest_id: UUID
    problem_id: int

class MatchResponse(BaseModel):
    match_id: UUID
    host_id: UUID
    guest_id: UUID
    problem_id: int

    class Config:
        from_attributes = True

class MatchStart(BaseModel):
    match_id: UUID
    startTime: datetime

class MatchEnd(BaseModel):
    match_id: UUID
    status: bool
    
class MatchEndResponse(BaseModel):
    match_id: UUID
    status: bool
    endTime: datetime
    duration: int

    class Config:
        from_attributes = True

class MatchHistory(BaseModel):
    match_id: UUID
    host_id: UUID
    guest_id: UUID
    status: bool
    duration: int
    
    class Config:
        from_attributes = True

class MatchDetails(BaseModel):
    match_id: UUID
    host_id: UUID
    guest_id: UUID
    status: bool
    duration: int
    problem_id: int
    startTime: datetime
    endTime: datetime
    
    class Config:
        from_attributes = True