import uuid
from sqlalchemy import Boolean, Column, DateTime, String
from datetime import UTC, datetime
from app.core.database import Base

from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)
    is_verfied = Column(Boolean, default=True)
    verification_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now(UTC))

    user_data = relationship("UserData", back_populates="user")

    reviews_as_host = relationship("Rating", foreign_keys="Rating.host_id", back_populates="host")
    reviews_as_guest = relationship("Rating", foreign_keys="Rating.guest_id", back_populates="guest")

    matches_as_host = relationship("Match", foreign_keys="Match.hostID", back_populates="host")
    matches_as_guest = relationship("Match", foreign_keys="Match.guestID", back_populates="guest")
