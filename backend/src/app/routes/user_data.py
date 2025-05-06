from collections import Counter
from datetime import UTC, datetime, timedelta
from uuid import UUID
from app.schemas.user_data import PasswordUpdate, UserDataResponse, UserDataUpdate
from fastapi import APIRouter, HTTPException, Depends, Security
from app.dependencies import get_db
from sqlalchemy.orm import Session
import app.services.user_data as user_data_service
from app.dependencies import oauth2_scheme

router = APIRouter()

@router.put("/users/{user_id}/update", response_model=UserDataResponse)
def update_user_data_endpoint(
    user_id: str,
    user_data: UserDataUpdate,
    password_data: PasswordUpdate,
    db: Session = Depends(get_db)
):
    updated_user_data = user_data_service.update_user_data(
        db=db,
        user_id=user_id,
        user_data_update=user_data,
        password_data=password_data
    )
    return updated_user_data

@router.get("/users/{user_id}/data", response_model=UserDataResponse)
def get_user_data_endpoint(user_id: UUID, db: Session = Depends(get_db)):
    user_data = user_data_service.get_user_data(db=db, user_id=user_id)
    return user_data

@router.get("/users/{user_id}/match-categories", response_model=dict[str, int])
def get_match_categories(
    user_id: UUID,
    db: Session = Depends(get_db),
    token: str = Security(oauth2_scheme)
):
    print(f"Fetching match categories for user_id: {user_id}")
    categories = user_data_service.get_match_categories(db=db, user_id=user_id)
    print(f"Match categories response: {categories}")
    return categories

@router.get("/users/{user_id}/last-match", response_model=str)
def get_last_match(
    user_id: UUID,
    db: Session = Depends(get_db),
    token: str = Security(oauth2_scheme)
):
    print(f"Fetching last match for user_id: {user_id}")
    last_match = user_data_service.get_last_match(db=db, user_id=user_id)
    response = last_match.isoformat() if last_match else ""
    print(f"Last match response: {response}")
    return response

@router.get("/users/{user_id}/dashboard")
def get_dashboard(
    user_id: UUID,
    db: Session = Depends(get_db),
    token: str = Security(oauth2_scheme)
):
    print(f"Fetching dashboard for user_id: {user_id}")
    streaks = user_data_service.get_streaks(db=db, user_id=user_id)
    print(f"Dashboard response: {streaks}")
    return {"streaks": streaks}