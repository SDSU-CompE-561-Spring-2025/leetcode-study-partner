import uuid
from sqlalchemy import Boolean, Column, DateTime, String
from datetime import datetime
from app.core.database import Base

from sqlalchemy.orm import relationship

from datetime import timezone
from sqlalchemy.dialects.postgresql import UUID


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    verification_code = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))

    user_data = relationship("UserData", back_populates="user", cascade="all, delete-orphan")
    reviews_as_host = relationship("Review", foreign_keys="Review.host_id", back_populates="host", cascade="all, delete-orphan")
    reviews_as_guest = relationship("Review", foreign_keys="Review.guest_id", back_populates="guest", cascade="all, delete-orphan")
    matches_as_host = relationship("Match", foreign_keys="Match.hostID", back_populates="host", cascade="all, delete-orphan")
    matches_as_guest = relationship("Match", foreign_keys="Match.guestID", back_populates="guest", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
