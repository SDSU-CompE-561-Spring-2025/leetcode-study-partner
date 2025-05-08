from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String

from app.core.database import Base

from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID



class UserData(Base):
    __tablename__ = "user_data"

    id = Column(Integer, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    profile_picture = Column(String, nullable=True)
    last_login = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    last_match_at = Column(DateTime, default=datetime.now(UTC))
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_streak_increment_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="user_data")

    __table_args__ = (
        Index('ix_user_data_user_id', 'user_id'),
    )
    