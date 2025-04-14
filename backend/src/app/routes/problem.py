from datetime import timedelta
from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from app.schemas.problem import ProblemCreate
from app.schemas.token import Token
from app.schemas.user import UserResponse, UserCreate
from fastapi import APIRouter, Depends

import app.services.user as user_service
import app.services.problem as problem_service
from app.dependencies import get_db
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

#from app.schemas.problem import UserReviewCreate, UserReviewRead
from app.models.problem import Problem as ProblemModel
from app.schemas.problem import Problem
from app.models.user import User
from app.schemas.user_match_history import UserMatchHistory

#from app.services.problem import ProblemService

router = APIRouter()

@router.post("/create", response_model=Problem)
def create_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    new_problem = problem_service.create_problem(db=db, problem=problem)
    return new_problem

@router.get("/{lc_id}")
def get_single_problem(lc_id: int, db: Session = Depends(get_db)):
    problem = problem_service.get_problem(db=db, lc_id=lc_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.put("/update/{lc_id}", response_model=Problem)
def update_problem(lc_id: int, problem: ProblemCreate, db: Session = Depends(get_db)):
    result = problem_service.update_problem(db=db, lc_id=lc_id, problem_update=problem)
    return result

@router.delete("/delete/{lc_id}")
def delete_problem(lc_id: int, db: Session = Depends(get_db)):
    result = problem_service.delete_problem(db=db, lc_id=lc_id)
    return result


# TODO: Figure out how to integrate with user match history (too difficult while they're separated)
# we dont know if we're gonna do this
#@router.get("/solved/{user_id}")
#def get_solved_problems(user_id: int, db: Session = Depends(get_db)):
#    given_user = db.query(User).filter(User.id == user_id)
#    solved_problems = db.query(Problem)
#    return given_user