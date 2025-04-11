from app.schemas.user_data import UserDataResponse
from fastapi import APIRouter
from app.dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.auth import oauth2_scheme, decode_access_token

router = APIRouter()

@router.post("/create/", response_model=UserDataResponse)
def create_userdata(
    userdata: UserDataResponse,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    username = decode_access_token(token).username
    return {
        "profile_picture": userdata.profile_picture,
        "last_login": userdata.last_login,
        "updated_at": userdata.updated_at,
        "username": username,
        "streak": userdata.streak,
    }

@router.put("/update/", response_model=UserDataResponse)
def update_userdata(
    userdata: UserDataResponse,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    username = decode_access_token(token).username
    return {
        "profile_picture": userdata.profile_picture,
        "last_login": userdata.last_login,
        "updated_at": userdata.updated_at,
        "username": username,
        "streak": userdata.streak,
    }
