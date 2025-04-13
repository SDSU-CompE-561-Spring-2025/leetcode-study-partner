from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional

class UserReviewBase(BaseModel):
    to_host_rating: int
    to_guest_rating: int

    to_host_comment: Optional[str] = None
    to_guest_comment: Optional[str] = None

    problem_solved: bool
    time_given: int
    elapsed_time: timedelta

class UserReviewCreate(UserReviewBase):
    match_id: int
    host_id: int
    guest_id: int

class UserReviewRead(UserReviewBase):
    id: int
    match_id: int
    host_id: int
    guest_id: int
    review_updated_at: datetime

    class Config:
        orm_mode = True