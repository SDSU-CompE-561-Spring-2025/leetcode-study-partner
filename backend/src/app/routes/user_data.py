from app.schemas.user_data import UserDataCreate, UserDataResponse
from fastapi import APIRouter
from app.dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
import app.services.user_data as user_data_service

router = APIRouter()

#Creation of user_data is only at user to keep cohesiveness

@router.post("/users/{user_id}/data", response_model=UserDataResponse)
def create_user_data_endpoint(
    user_data_create: UserDataCreate,
    db: Session = Depends(get_db)
):
    user_data = user_data_service.create_user_data(db=db, user_data_create=user_data_create)
    return user_data

@router.put("/users/{user_id}/data", response_model=UserDataResponse)
def update_user_data_endpoint(
    user_id: str, user_data: UserDataCreate, db: Session = Depends(get_db)
):
    updated_user_data = user_data_service.update_user_data(db=db, user_id=user_id, user_data_update=user_data)
    return updated_user_data

@router.get("/users/{user_id}/data", response_model=UserDataResponse)
def get_user_data_endpoint(user_id: str, db: Session = Depends(get_db)):
    user_data = user_data_service.get_user_data(db=db, user_id=user_id)
    return user_data

@router.delete("/users/{user_id}/data", response_model=dict)
def delete_user_data_endpoint(user_id: str, db: Session = Depends(get_db)):
    result = user_data_service.delete_user_data(db=db, user_id=user_id)
    return result
