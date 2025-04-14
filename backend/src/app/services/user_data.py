from datetime import UTC, datetime
from app.core.security import verify_password
from app.models.user_data import UserData
from app.schemas.user_data import PasswordUpdate, UserDataUpdate
from fastapi import HTTPException
from sqlalchemy.orm import Session

#from app.core.security import verify_password
from app.models.user import User

def create_user_data(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = UserData(
        user_id=user.id,
        profile_picture=None,
        last_login=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

    db.add(user_data)
    db.commit()
    db.refresh(user_data)

    return user_data

def update_user_data(
    db: Session,
    user_id: str,
    user_data_update: UserDataUpdate,
    password_data: PasswordUpdate
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(password_data.current_password, user.password_hash):
        raise HTTPException(status_code=403, detail="Incorrect password")

    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="UserData not found for this user")

    if user_data_update.profile_picture is not None:
        user_data.profile_picture = user_data_update.profile_picture

    user_data.updated_at = datetime.now(UTC)

    db.commit()
    db.refresh(user_data)

    return user_data

def get_user_data(db: Session, user_id: str):
    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()

    if not user_data:
        raise HTTPException(status_code=404, detail="UserData not found for this user")

    return user_data

def delete_user_data(db: Session, user_id: str):
    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()

    if not user_data:
        raise HTTPException(status_code=404, detail="UserData not found for this user")

    db.delete(user_data)
    db.commit()

    return {"message": f"UserData for user {user_id} has been successfully deleted."}
