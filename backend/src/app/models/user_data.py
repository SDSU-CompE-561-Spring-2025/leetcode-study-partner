from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String

from app.core.database import Base

from sqlalchemy.orm import relationship


class UserData(Base):
    __tablename__ = "user_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)

    profile_picture = Column(String, nullable=True)
    last_login = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    user = relationship("User", back_populates="user_data")

    __table_args__ = (
        Index('ix_user_data_user_id', 'user_id'),
    )
