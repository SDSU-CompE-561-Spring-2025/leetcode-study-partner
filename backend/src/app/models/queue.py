from sqlalchemy import Boolean, Column, DateTime, Integer, String, Enum, ForeignKey, Table
from datetime import UTC, datetime
from app.core.database import Base
from app.schemas.queuemodel import ProgrammingLanguage, Status

# Deprecated, queue is managed in-memory in the matchmaking service

#class Queue(Base):
#    __tablename__ = "queues"
#
#    id = Column(Integer, primary_key=True, index=True)
#    user_id = Column(Integer, ForeignKey("users.id"))
#    programming_languages = Column(String)
#    categories = Column(String)
#    status = Column(Enum(Status), default="Searching")
#    queued_at = Column(DateTime, default=datetime.now(UTC))
#    resulting_match = Column(Integer, ForeignKey("matches.id"), nullable=True)