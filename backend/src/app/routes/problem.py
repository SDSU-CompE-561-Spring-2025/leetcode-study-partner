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
from app.models.problem import Problems

router = APIRouter()

@router.get("/api/problems")
def get_all_problems(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    problems = db.query(models.problem).offset(skip).limit(limit).all()
    return problems

@router.get("/api/problems/{lc_id}")
def get_single_problem():
    return {"message": "Single problem retrieved."}

@router.get("/api/problems/solved/{lc_id}")
def get_solved_problems():
    return {"message": "Solved problems retrieved."}