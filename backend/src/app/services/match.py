from sqlalchemy.orm import Session
import uuid

from app.core.config import get_settings
from app.models.match import Match
from app.schemas.match import MatchHistory

settings = get_settings()

# MATCH CRUD

def start_match(db: Session, match: MatchHistory):
    new_match = Match(
        match_id=str(uuid.uuid4()),
        user_id=match.hostID,
        opponent_id=match.guestID,
        problem_id=match.problemID
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match

def end_match(db: Session, match: MatchHistory):
    db_match = Match(
        match_id=match.matchID,
        user_id=match.hostID,
        opponent_id=match.guestID,
        problem_id=match.problemID
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

def get_match(db: Session, matchID: str):
    return db.query(Match).filter(Match.match_id == matchID).first()

def get_all_matches(db: Session):
    return db.query(Match).all()
