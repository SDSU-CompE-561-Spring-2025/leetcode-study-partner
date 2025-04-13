import uuid
from datetime import datetime, UTC, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID, uuid4

from app.core.config import get_settings
from app.models.match import Match
from app.schemas.match import MatchCreate, MatchDetails, MatchHistory, MatchStart, MatchEnd, MatchResponse

settings = get_settings()

# MATCH CRUD
# CREATE
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

# UPDATE - Start match
def start_match(db: Session, matchID: str):
    db_match = db.query(Match).filter(Match.matchID == matchID).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")

    db_match.startTime = datetime.now(timezone.utc) 
    db.commit()
    db.refresh(db_match)
    return db_match


# UPDATE - End match
def end_match(db: Session, matchID: str, match_data: MatchEnd):
    db_match = db.query(Match).filter(Match.matchID == matchID).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")

    if db_match.startTime.tzinfo is None:
        db_match.startTime = db_match.startTime.replace(tzinfo=timezone.utc)

    db_match.endTime = datetime.now(timezone.utc)
    db_match.status = match_data.status
    db_match.duration = int((db_match.endTime - db_match.startTime).total_seconds())

    db.commit()
    db.refresh(db_match)
    return db_match

# READ - Get match details
def get_match_details(db: Session, reqBody: str):
    return db.query(Match).filter(Match.matchID == reqBody).first()

# READ - Get all matches for a user
def get_all_matches(db: Session, reqBody: str):
    return db.query(Match).filter(
        or_(
            Match.hostID == reqBody,
            Match.guestID == reqBody
        )
    ).all()
