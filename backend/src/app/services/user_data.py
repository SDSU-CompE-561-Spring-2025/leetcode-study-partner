from collections import Counter
from datetime import UTC, datetime, timedelta
from uuid import UUID
from app.core.security import verify_password
from app.models.user_data import UserData
from app.schemas.user_data import PasswordUpdate, UserDataUpdate
from fastapi import HTTPException
from sqlalchemy.orm import Session

#from app.core.security import verify_password
from app.models.user import User
from app.models.match import Match

def create_user_data(db: Session, user_id: UUID):
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
    user_id: UUID,
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

def get_user_data(db: Session, user_id: UUID):
    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()

    if not user_data:
        raise HTTPException(status_code=404, detail="UserData not found for this user")

    return user_data

def delete_user_data(db: Session, user_id: UUID):
    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()

    if not user_data:
        raise HTTPException(status_code=404, detail="UserData not found for this user")

    db.delete(user_data)
    db.commit()

    return {"message": f"UserData for user {user_id} has been successfully deleted."}

def get_match_categories(db: Session, user_id: UUID):
    matches = (
        db.query(Match)
        .filter((Match.host_id == user_id) | (Match.guest_id == user_id))
        .all()
    )
    
    counter = Counter()
    for match in matches:
        for category in match.categories:
            counter[category] += 1

    return counter

def get_last_match(db: Session, user_id: UUID):
    last_match = (
        db.query(Match)
        .filter((Match.host_id == user_id) | (Match.guest_id == user_id))
        .order_by(Match.endTime.desc())
        .first()
    )
    return last_match.endTime.date() if last_match else None

def get_streaks(db: Session, user_id: UUID) -> dict:
    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="UserData not found for this user")
    
    last_match_time = get_last_match(db=db, user_id=user_id)
    if not last_match_time:
        user_data.current_streak = 0
        db.commit()
        db.refresh(user_data)
        return {"current_streak": user_data.current_streak, "longest_streak": user_data.longest_streak}
    
    time_diff = datetime.now(UTC) - last_match_time
    
    if time_diff <= timedelta(hours=36):
        user_data.current_streak += 1
        if user_data.current_streak > user_data.longest_streak:
            user_data.longest_streak = user_data.current_streak
        db.commit()
        db.refresh(user_data)
    else:
        user_data.current_streak = 1
        db.commit()
        db.refresh(user_data)
    
    user_data.last_match_at = last_match_time
    
    return {"current_streak": user_data.current_streak, "longest_streak": user_data.longest_streak}
