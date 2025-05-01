import uuid
from sqlalchemy import Boolean, Column, DateTime, Index, Integer, ForeignKey
from datetime import UTC, datetime
from app.core.database import Base
from sqlalchemy.orm import relationship, backref
from sqlalchemy.dialects.postgresql import UUID

class Match(Base):
    __tablename__ = "match"

    match_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, index=True, default=uuid.uuid4)
    host_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    guest_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)

    startTime = Column(DateTime, default=lambda: datetime.now(UTC))
    endTime = Column(DateTime, default=lambda: datetime.now(UTC))

    status = Column(Boolean, default=False)
    duration = Column(Integer, default=0)

    problem_id = Column(Integer, ForeignKey("problems.id"), index=True)
<<<<<<< HEAD
<<<<<<< HEAD
=======

    host = relationship("User", foreign_keys=[host_id], back_populates="matches_as_host")
    guest = relationship("User", foreign_keys=[guest_id], back_populates="matches_as_guest")
>>>>>>> d3e9def56e57ef205b470c2faa52b1c2f8ec8ae9
=======
>>>>>>> 9c41fcb5c32e234d148c6c534c861f1c8b522f03

    host = relationship("User", foreign_keys=[host_id], back_populates="matches_as_host")
    guest = relationship("User", foreign_keys=[guest_id], back_populates="matches_as_guest")
    problem = relationship("Problem", backref=backref("matches"))

    __table_args__ = (
        Index('ix_matches_host_guest', 'host_id', 'guest_id'),
    )
