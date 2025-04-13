from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey
from datetime import UTC, datetime
from app.core.database import Base
from uuid import UUID
from sqlalchemy.orm import relationship

class Match(Base):
    __tablename__ = "match"
    
    matchID= Column(String, primary_key=True, unique=True, index=True)
    hostID= Column(String, ForeignKey("users.id"), index=True)
    guestID= Column(String, ForeignKey("users.id"), index=True)
    
    startTime: DateTime = Column(DateTime, default=lambda:datetime.now(UTC))
    endTime: DateTime = Column(DateTime, default=lambda:datetime.now(UTC))
    status: Boolean = Column(Boolean, default=False)
    duration: Integer = Column(Integer, default=0)
    
    problemID = Column(Integer, ForeignKey("problems.id"), index=True)
    
    host = relationship("User", foreign_keys=[hostID])
    guest = relationship("User", foreign_keys=[guestID])
    problem = relationship("Problem", back_populates="matches")