import uuid
from app.core.security import verify_password
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.auth import decode_access_token, get_password_hash
from app.core.config import get_settings
#from app.core.security import verify_password
from app.models.user import User
from app.schemas.user import UserCreate

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
