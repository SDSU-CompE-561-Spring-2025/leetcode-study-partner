import uuid
from app.core.security import verify_password
from app.models.token import RefreshToken
from sqlalchemy.orm import Session

from app.core.auth import get_password_hash
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

def store_refresh_token(db: Session, user_id: str, refresh_token: str):
    db_token = RefreshToken(token=refresh_token, user_id=user_id)
    db.add(db_token)
    db.commit()

def delete_token(db: Session, refresh_token: str):
    token_entry = db.query(RefreshToken).filter_by(token=refresh_token).first()
    if not token_entry:
        return False

    db.delete(token_entry)
    db.commit()
    return True
