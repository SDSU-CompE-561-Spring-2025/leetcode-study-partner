from datetime import timedelta
from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, create_access_token, create_refresh_token, decode_refresh_token
from app.schemas.token import Token
from app.schemas.user import UserResponse, UserCreate
from fastapi import APIRouter, Depends

import app.services.user as user_service
from app.dependencies import get_db
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = user_service.create_user(db=db, user=user)
    return new_user


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = user_service.authenticate_user(
        db, username=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    refresh_token_expires = timedelta(days = REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = create_refresh_token(
        data={"sub": user.username}, expires_delta=refresh_token_expires
    )
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/refresh")
def refresh_token(refresh_token: str):
    username = decode_refresh_token(refresh_token)
    access_token_expires = timedelta(days = REFRESH_TOKEN_EXPIRE_DAYS)
    new_access_token = create_access_token(
        data={"sub": username}, expires_delta=access_token_expires
    )
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(refresh_token: str):

    return {"message": "Logged out successfully"}


@router.get("/users/me")
def read_users_me():
    return {"message": "User details returned successfully"}

#TODO if we make this app real, we will need this
# @router.post("/users/verify-email/{verification_code}")
# def verify_email(verification_code: str):
#     return {"message": "Email verified successfully"}
