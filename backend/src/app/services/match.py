import uuid
from datetime import datetime, UTC, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID, uuid4

from app.core.config import get_settings
from app.models.match import Match
from app.models.user import User
from app.schemas.match import MatchCreate, MatchDetails, MatchHistory, MatchStart, MatchEnd, MatchResponse

settings = get_settings()

# MATCH CRUD

# CREATE - Create match
def create_match(db: Session, match: MatchCreate):
    new_match_id: UUID = uuid.uuid4()
    
    check_same_users(db, str(match.hostID), str(match.guestID))
    
    check_matchID(db, str(new_match_id))
    
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
    check_matchID(db, matchID)
    
    db_match = db.query(Match).filter(Match.matchID == matchID).first()

    db_match.startTime = datetime.now(timezone.utc) 
    db.commit()
    db.refresh(db_match)
    return db_match

# UPDATE - End match
def end_match(db: Session, matchID: str, match_data: MatchEnd):
    check_matchID(db, matchID)

    db_match = db.query(Match).filter(Match.matchID == matchID).first()
    
    if db_match.startTime.tzinfo is None:
        db_match.startTime = db_match.startTime.replace(tzinfo=timezone.utc)

    db_match.endTime = datetime.now(timezone.utc)
    db_match.status = match_data.status
    db_match.duration = int((db_match.endTime - db_match.startTime).total_seconds())

    db.commit()
    db.refresh(db_match)
    return db_match

# READ - Get match details
def get_match_details(db: Session, match_id: str):
    return db.query(Match).filter(Match.matchID == match_id).first()

# READ - Get all matches for a user
def get_all_matches(db: Session, reqBody: str):
    
    check_user(db, reqBody)
    
    return db.query(Match).filter(
        or_(
            Match.hostID == reqBody,
            Match.guestID == reqBody
        )
    ).all()
    

####### Helper Function #######

# Check if host and guest are the same
def check_same_users(db: Session, hostID: str, guestID: str):
    if hostID == guestID:
        raise HTTPException(status_code=400, detail="Host and guest cannot be the same")
    return

def check_matchID(db: Session, matchID: str):
    if not db.query(Match).filter(Match.matchID == matchID).first():
        raise HTTPException(status_code=404, detail="Match not found")
    return

def check_user(db: Session, userID: str):
    if not db.query(User).filter(User.id == userID).first():
        raise HTTPException(status_code=404, detail="User not found")
    return