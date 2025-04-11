from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.core.database import Base

class UserData(Base):
    __tablename__ = "user_data"

    id = Column(Integer, primary_key = True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True, nullable=False)

    profile_picutre = Column(String, nullable=True)
    last_login = Column(DateTime, default=datetime.now(UTC))
    updateded_at = Column(DateTime, default=datetime.now(UTC))
    streak = Column(Integer, nullable=False, default = 0)
