from app.schemas.problem import ProblemCreate
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.core.config import get_settings
from app.models.problem import Problem
from app.models.user import User

## TODO: Finalize my schema ##
# from app.schemas.problem import MatchCreate, MatchDetails, MatchHistory, MatchStart

settings = get_settings()

def create_problem(db: Session, problem: ProblemCreate) -> Problem:
    db_problem = Problem(
        problem_id = problem.problem_id,
        problem_link = str(problem.problem_link),
        methods_video_link = str(problem.methods_video_link),
        categories = problem.categories,
        difficulty = problem.difficulty
    )
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem

def delete_problem(db: Session, lc_id: int):
    existing_problem = db.query(Problem).filter(Problem.id == lc_id).first()
    if not existing_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    db.delete(existing_problem)
    db.commit()
    return {"message": "Problem deleted successfully"}

def update_problem(db: Session, lc_id: int, problem_update: ProblemCreate):
    existing_problem: Problem = db.query(Problem).filter(Problem.id == lc_id).first()
    if not existing_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    existing_problem.problem_id = problem_update.problem_id,
    existing_problem.problem_link = str(problem_update.problem_link),
    existing_problem.methods_video_link = str(problem_update.methods_video_link),
    existing_problem.categories = problem_update.categories
    existing_problem.difficulty = problem_update.difficulty
    db.commit()
    db.refresh(existing_problem)
    return existing_problem


def get_problem(db: Session, lc_id: int):
    return db.query(Problem).filter(Problem.id == lc_id).first()

def get_solved_problems(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id)