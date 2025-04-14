from datetime import timedelta
from app.core.auth import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, oauth2_scheme, create_access_token, create_refresh_token, decode_refresh_token
from app.models.token import RefreshToken
from app.schemas.token import Token
from app.schemas.user import DeleteUserRequest, UserResponse, UserCreate, UserUpdateRequest
from fastapi import APIRouter, Depends, Security

import app.services.user as user_service
import app.services.user_data as user_data_service
import app.services.token as token_service
from app.dependencies import get_db
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = user_service.create_user(db=db, user=user)
    user_data_service.create_user_data(db=db, user_id=new_user.id)
    return new_user


@router.post("/token", response_model=Token)
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

    token_service.store_refresh_token(db=db, user_id=user.id, refresh_token=refresh_token)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):

    token_in_db = db.query(RefreshToken).filter_by(token=refresh_token).first()
    if not token_in_db:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


    token_data = decode_refresh_token(refresh_token)
    new_access_token = create_access_token(data={"sub": token_data.username})
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(refresh_token: str, db: Session = Depends(get_db)):
    success = token_service.delete_token(db=db, refresh_token=refresh_token)
    if not success:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return {"message": "Logged out successfully"}


@router.get("/users/me", response_model=UserResponse)
def get_current_user(
    db: Session = Depends(get_db),
    token: str = Security(oauth2_scheme)
):
    return user_service.get_user_by_token(db=db, token=token)


@router.put("/update/{user_id}", response_model=UserResponse)
def update_user_route(
    user_id: str,
    user_update: UserUpdateRequest,
    db: Session = Depends(get_db)
):
    updated_user = user_service.update_user(db=db, user_id=user_id, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.delete("/users/{user_id}", response_model=dict)
def delete_user_route(user_id: str, delete_request: DeleteUserRequest, db: Session = Depends(get_db)):
    password = delete_request.password
    return user_service.delete_user(db=db, user_id=user_id, password=password)

#TODO if we make this app real, we will need this
# @router.post("/users/verify-email/{verification_code}")
# def verify_email(verification_code: str):
#     return {"message": "Email verified successfully"}
