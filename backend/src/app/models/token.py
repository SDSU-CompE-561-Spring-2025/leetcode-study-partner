# models/refresh_token.py

from datetime import UTC, datetime
from app.core.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    token = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now(UTC))

    user = relationship("User")
