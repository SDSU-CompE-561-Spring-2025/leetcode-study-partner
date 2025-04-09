from sqlalchemy.orm import Session

from app.core.auth import get_password_hash
from app.core.config import get_settings
#from app.core.security import verify_password
from app.models.match import Match
from app.schemas.match import MatchHistory

settings = get_settings()

# USER CRUD

def create_match(db: Session, match: MatchHistory):
    new_match = Match(
        match_id=match.matchID,
        user_id=match.hostID,
        opponent_id=match.guestID,
        problem_id=match.problemID
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match
