import uuid
from sqlalchemy import Boolean, Column, DateTime, String
from datetime import UTC, datetime
from app.core.database import Base

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
