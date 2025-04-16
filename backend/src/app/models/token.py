# models/refresh_token.py

from datetime import UTC, datetime
from app.core.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from sqlalchemy.dialects.postgresql import UUID
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(UTC))

    user = relationship("User", back_populates="refresh_tokens")
