import uuid
from app.core.security import verify_password
from app.models.user_data import UserData
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.auth import decode_access_token, get_password_hash
from app.core.config import get_settings
#from app.core.security import verify_password
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.user_data import delete_user_data

settings = get_settings()

# USER CRUD

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    verification_code = "1234" #TODO: Implement verification code

    db_user = User(
        id=str(uuid.uuid4()),
        username=user.username,
        email= user.email,
        password_hash=hashed_password,
        verification_code=verification_code,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, user_update: UserCreate):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.username:
        user.username = user_update.username
    if user_update.email:
        user.email = user_update.email
    if user_update.password:
        user.password_hash = get_password_hash(user_update.password)

    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: str):
    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()
    if user_data:
        delete_user_data(db=db, user_id=user_id)

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user


def get_user_by_username(db: Session, username: str):
    user = db.query(User).filter(User.username == username).first()
    return user

def get_user_by_token(db: Session, token: str) -> User:
    token_data = decode_access_token(token)
    username = token_data.username

    if not username:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
