from collections import Counter
from datetime import UTC, datetime, timedelta
from uuid import UUID
from app.core.security import verify_password
from app.models.user_data import UserData
from app.schemas.user_data import PasswordUpdate, UserDataUpdate
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.match import Match
from app.models.problem import Problem
from zoneinfo import ZoneInfo

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

def get_match_categories_count(db: Session, user_id: UUID):
    matches = (
        db.query(Match)
        .filter((Match.host_id == user_id) | (Match.guest_id == user_id))
        .all()
    )
    
    counter = Counter()
    for match in matches:
        problem = db.query(Problem).filter(Problem.problem_id == match.problem_id).first()
        if problem and problem.categories:
            for category in problem.categories:
                counter[category] += 1

    return counter

def get_last_match(db: Session, user_id: UUID):
    last_match = (
        db.query(Match)
        .filter((Match.host_id == user_id) | (Match.guest_id == user_id))
        .order_by(Match.endTime.desc())
        .first()
    )
    if last_match and last_match.endTime:
        if last_match.endTime.tzinfo is None:
            last_match.endTime = last_match.endTime.replace(tzinfo=ZoneInfo("UTC"))
        return last_match.endTime
    return None

def get_streaks(db: Session, user_id: UUID) -> dict:
    user_data = db.query(UserData).filter(UserData.user_id == user_id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="UserData not found for this user")

    last_match_time = get_last_match(db=db, user_id=user_id)

    if not last_match_time:
        user_data.current_streak = 0
        db.commit()
        db.refresh(user_data)
        return {
            "current_streak": 0,
            "longest_streak": user_data.longest_streak
        }

    now = datetime.now(UTC)
    time_since_last_match = now - last_match_time

    if time_since_last_match > timedelta(hours=36):
        user_data.current_streak = 0
        user_data.last_streak_increment_at = None
        db.commit()
        db.refresh(user_data)
        return {
            "current_streak": 0,
            "longest_streak": user_data.longest_streak
        }

    if (
        user_data.last_streak_increment_at is None or
        last_match_time.date() > user_data.last_streak_increment_at.date()
    ):
        user_data.current_streak += 1
        user_data.last_streak_increment_at = last_match_time

        if user_data.current_streak > user_data.longest_streak:
            user_data.longest_streak = user_data.current_streak

        db.commit()
        db.refresh(user_data)

    return {
        "current_streak": user_data.current_streak,
        "longest_streak": user_data.longest_streak
    }