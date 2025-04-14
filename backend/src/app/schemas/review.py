from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class UserReviewBase(BaseModel):
    to_host_rating: int
    to_guest_rating: int

    to_host_comment: Optional[str] = None
    to_guest_comment: Optional[str] = None

    problem_solved: bool
    time_given: int
    elapsed_time: timedelta

class UserReviewCreate(UserReviewBase):
    match_id: str
    host_id: UUID
    guest_id: UUID

class UserReviewRead(UserReviewBase):
    id: int
    match_id: UUID
    host_id: UUID
    guest_id: UUID
    review_updated_at: datetime

    class Config:
        orm_mode = True
