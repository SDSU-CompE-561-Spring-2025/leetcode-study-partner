from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.match import Match
from app.schemas.match import MatchHistory

settings = get_settings()

# MATCH CRUD

def create_match(db: Session, match: MatchHistory):
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
