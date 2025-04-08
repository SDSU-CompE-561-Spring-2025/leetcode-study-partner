from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey
from datetime import UTC, datetime
from app.core.database import Base

class MatchHistory(Base):
    __tablename__ = "matchHistory"
    
    matchID: UUID = Column(String, primary_key=True, index=True)
    hostID: UUID = Column(String, ForeignKey("users.id"), index=True)
    guestID: UUID = Column(String, ForeignKey("users.id"), index=True)
    startTime: DateTime = Column(DateTime, default=datetime.now(UTC))
    endTime: DateTime = Column(DateTime, default=datetime.now(UTC))
    status: Boolean = Column(Boolean, default=True)
    duration: Integer = Column(Integer, default=0)
    