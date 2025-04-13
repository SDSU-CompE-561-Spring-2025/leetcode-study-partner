from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.review import UserReviewModel
from app.schemas.review import UserReviewCreate, UserReviewRead
from app.core.database import get_db

router = APIRouter()

# POST: /api/reviews/submit
@router.post("/submit", response_model=UserReviewRead)
def submit_review(review: UserReviewCreate, db: Session = Depends(get_db)):
    db_review = UserReviewModel(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

# GET: /api/reviews/received/{user_id}
@router.get("/received/{user_id}", response_model=List[UserReviewRead])
def get_reviews_received(user_id: int, db: Session = Depends(get_db)):
    reviews = db.query(UserReviewModel).filter(UserReviewModel.guest_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews received for this user")
    return reviews

# GET: /api/reviews/given/{user_id}
@router.get("/given/{user_id}", response_model=List[UserReviewRead])
def get_reviews_given(user_id: int, db: Session = Depends(get_db)):
    reviews = db.query(UserReviewModel).filter(UserReviewModel.host_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews given by this user")
    return reviews

# GET: /api/reviews/{match_id}
@router.get("/{match_id}", response_model=UserReviewRead)
def get_review_by_match(match_id: int, db: Session = Depends(get_db)):
    review = db.query(UserReviewModel).filter(UserReviewModel.match_id == match_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review for this match not found")
    return review
