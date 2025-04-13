from datetime import timedelta
from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from app.schemas.token import Token
from app.schemas.user import UserResponse, UserCreate
from fastapi import APIRouter, Depends

import app.services.user as user_service
from app.dependencies import get_db
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

#from app.schemas.problem import UserReviewCreate, UserReviewRead
from app.models.problem import Problem
from app.models.user import User
from app.schemas.user_match_history import UserMatchHistory

#from app.services.problem import ProblemService

router = APIRouter()

@router.get("/api/problems")
def get_all_problems(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    problems = db.query(Problem).offset(skip).limit(limit).all()
    return problems

@router.get("/api/problems/{lc_id}")
def get_single_problem(lc_id: int, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == lc_id)
    
    return problem


# TODO: Figure out how to integrate with user match history (too difficult while they're separated)
@router.get("/api/problems/solved/{user_id}")
def get_solved_problems(user_id: int, db: Session = Depends(get_db)):
    given_user = db.query(User).filter(User.id == user_id)
    solved_problems = db.query(Problem)
    return given_user