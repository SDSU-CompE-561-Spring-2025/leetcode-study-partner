import uuid
from datetime import datetime, UTC, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID, uuid4
from sqlalchemy.orm import joinedload
from sqlalchemy import or_

from app.core.config import get_settings
from app.models.match import Match
from app.models.user import User
from app.schemas.match import MatchCreate, MatchDetails, MatchHistory, MatchStart, MatchEnd, MatchResponse

settings = get_settings()

# MATCH CRUD

# CREATE - Create match
def create_match(db: Session, match: MatchCreate):
    new_match_id: UUID = uuid.uuid4()
    
    check_same_users(db, match.host_id, match.guest_id)
    
    new_match = Match(
        match_id=new_match_id,
        host_id=match.host_id,
        guest_id=match.guest_id,
        problem_id=match.problem_id
    )
    
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    
    print({
        "message": "Match created successfully",
        "match_id": new_match_id
    })
    return new_match

# UPDATE - Start match
def start_match(db: Session, match_id: UUID):
    check_match_id(db, match_id)
    
    db_match = db.query(Match).filter(Match.match_id == match_id).first()

    db_match.startTime = datetime.now(timezone.utc) 
    db.commit()
    db.refresh(db_match)
    return db_match

# UPDATE - End match
def end_match(db: Session, match_id: UUID, match_data: MatchEnd):
    check_match_id(db, match_id)

    db_match = db.query(Match).filter(Match.match_id == match_id).first()
    
    if db_match.startTime.tzinfo is None:
        db_match.startTime = db_match.startTime.replace(tzinfo=timezone.utc)

    db_match.endTime = datetime.now(timezone.utc)
    db_match.status = match_data.status
    db_match.duration = int((db_match.endTime - db_match.startTime).total_seconds())

    db.commit()
    db.refresh(db_match)
    return db_match

# READ - Get match details
def get_match_details(db: Session, match_id: UUID):
    return db.query(Match).filter(Match.match_id == match_id).all()

# READ - Get all matches for a user
def get_all_matches(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    check_user(db, user_id)
    return db.query(Match).options(joinedload(Match.problem)).filter(
        or_(
            Match.host_id == user_id,
            Match.guest_id == user_id
        )
    ).offset(skip).limit(limit).all()

####### Helper Function #######

# Check if host and guest are the same
def check_same_users(db: Session, host_id: UUID, guest_id: UUID):
    if host_id == guest_id:
        raise HTTPException(status_code=400, detail="Host and guest cannot be the same")
    return

def check_match_id(db: Session, match_id: UUID):
    if not db.query(Match).filter(Match.match_id == match_id).first():
        raise HTTPException(status_code=404, detail="Match not found")
    return

def check_user(db: Session, user_id: UUID):
    if not db.query(User).filter(User.id == user_id).first():
        raise HTTPException(status_code=404, detail="User not found")
    return