import uuid
from sqlalchemy import Boolean, Column, DateTime, Index, Integer, ForeignKey
from datetime import UTC, datetime
from app.core.database import Base
from sqlalchemy.orm import relationship, backref
from sqlalchemy.dialects.postgresql import UUID

class Match(Base):
    __tablename__ = "match"

    matchID = Column(UUID(as_uuid=True), primary_key=True, unique=True, index=True, default=uuid.uuid4)
    hostID = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    guestID = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)

    startTime = Column(DateTime, default=lambda: datetime.now(UTC))
    endTime = Column(DateTime, default=lambda: datetime.now(UTC))

    status = Column(Boolean, default=False)
    duration = Column(Integer, default=0)

    problemID = Column(Integer, ForeignKey("problems.id"), index=True)

    host = relationship("User", foreign_keys=[hostID], back_populates="matches_as_host")
    guest = relationship("User", foreign_keys=[guestID], back_populates="matches_as_guest")

    problem = relationship("Problem", backref=backref("matches"))

    __table_args__ = (
        Index('ix_matches_host_guest', 'hostID', 'guestID'),
    )
