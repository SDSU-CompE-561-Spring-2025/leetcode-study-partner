from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.core.config import get_settings
from app.models.problem import Problem
from app.models.user import User

## TODO: Finalize my schema ##
# from app.schemas.problem import MatchCreate, MatchDetails, MatchHistory, MatchStart

settings = get_settings()

def get_all_problems(db: Session):
    return db.query(Problem).all()

def get_problem(db: Session, lc_id: str):
    return db.query(Problem).filter(Problem.id == lc_id)

def get_solved_problems(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id)