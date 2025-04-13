from datetime import UTC, datetime
from sqlalchemy import Column, Index, Integer, String, Boolean, DateTime, Interval, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Rating(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key = True, index = True)

    match_id = Column(String, primary_key=True, unique=True, nullable=False)

    to_host_rating = Column(Integer, nullable=False)
    to_guest_rating = Column(Integer, nullable=False)

    to_host_comment = Column(String, nullable=True)
    to_guest_comment = Column(String, nullable=True)

    problem_solved = Column(Boolean, nullable=False)
    time_given = Column(Integer, nullable=False)

    elapsed_time = Column(Interval, nullable=False)
    review_updated_at = Column(DateTime, default=lambda:datetime.now(UTC), onupdate=lambda:datetime.now(UTC))

    host_id = Column(String, ForeignKey("users.id"), nullable=False)
    guest_id = Column(String, ForeignKey("users.id"), nullable=False)

    host = relationship("User", foreign_keys=[host_id], back_populates="reviews_as_host")
    guest = relationship("User", foreign_keys=[guest_id], back_populates="reviews_as_guest")

    __table_args__ = (
        Index('ix_matches_host_guest', 'host_id', 'guest_id'),
        Index('ix_matches_guest_host', 'guest_id', 'host_id'),
    )
