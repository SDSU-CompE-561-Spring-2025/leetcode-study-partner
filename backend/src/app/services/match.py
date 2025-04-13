import uuid
from datetime import datetime, UTC, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID, uuid4

from app.core.config import get_settings
from app.models.match import Match
from app.schemas.match import MatchCreate, MatchDetails, MatchHistory, MatchStart

settings = get_settings()

# MATCH CRUD

def create_match(db: Session, match: MatchCreate):
    new_match_id: UUID = uuid.uuid4()
    
    rows = db.query(Match).filter(Match.matchID == new_match_id).first()
    
    if rows:
        raise HTTPException(status_code=409, detail="Match already exists")
    
    new_match = Match(
        matchID=str(new_match_id),
        hostID=str(match.hostID),
        guestID=str(match.guestID),
        problemID=match.problemID
    )
    
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    
    print( {
        "message": "Match created successfully",
        "matchID": new_match_id} )
    return new_match

def start_match(db: Session, match: MatchStart):
    match.startTime = datetime.now(timezone.utc)
    db.commit()
    db.refresh(match) 
    return match

# TODO: Fix CRUD for endmatch, match history
def end_match(db: Session, match: MatchHistory):
    end = datetime.now(timezone.utc)
    start = match.startTime
    db_match = Match(
        match_id=match.matchID,
        user_id=match.hostID,
        opponent_id=match.guestID,
        problem_id=match.problemID,
        end_time=end,
        duration=(end - start).total_seconds()
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

def get_match_details(db: Session, reqBody: str):
    return db.query(Match).filter(Match.matchID == reqBody).first()

def get_all_matches(db: Session, reqBody: str):
    return db.query(Match).filter(Match.hostID == reqBody | Match.guestID == reqBody).all()
