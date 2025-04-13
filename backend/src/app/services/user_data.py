from datetime import datetime
from app.models.user_data import UserData
from app.schemas.user_data import UserDataCreate
from fastapi import HTTPException
from sqlalchemy.orm import Session

#from app.core.security import verify_password
from app.models.user import User

def create_user_data(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = UserDataCreate(
        user_id=user.id,
        profile_picture=None,
        last_login=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(user_data)
    db.commit()
    db.refresh(user_data)
    return user_data

def update_user_data(db: Session, user_id: str, user_data_update: UserDataCreate):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()

    if not user_data:
        raise HTTPException(status_code=404, detail="UserData not found for this user")

    user_data.profile_picture = user_data_update.profile_picture
    user_data.last_login = user_data_update.last_login
    user_data.updated_at = datetime.now()  # Automatically update the timestamp

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
