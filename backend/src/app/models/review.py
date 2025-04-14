from sqlalchemy import Column, Integer, String, Boolean, DateTime, Interval, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

from sqlalchemy.dialects.postgresql import UUID

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    match_id = Column(UUID(as_uuid=True), ForeignKey("match.matchID"), nullable=False)
    to_host_rating = Column(Integer, nullable=False)
    to_guest_rating = Column(Integer, nullable=False)
    to_host_comment = Column(String, nullable=True)
    to_guest_comment = Column(String, nullable=True)
    problem_solved = Column(Boolean, nullable=False)
    time_given = Column(Integer, nullable=False)
    elapsed_time = Column(Interval, nullable=False)
    review_updated_at = Column(DateTime, nullable=True)

    host_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    guest_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    host = relationship("User", foreign_keys=[host_id], back_populates="reviews_as_host")
    guest = relationship("User", foreign_keys=[guest_id], back_populates="reviews_as_guest")

    match = relationship("Match", backref="reviews")
