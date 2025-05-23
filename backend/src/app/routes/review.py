from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.review import Review
from app.schemas.review import UserReviewCreate, UserReviewRead
from app.services.review import create_review as create_review_service
from app.dependencies import get_db

router = APIRouter()

@router.post("/", response_model=UserReviewRead)
def create_review(review: UserReviewCreate, db: Session = Depends(get_db)): 
    review = create_review_service(db=db, review=review)
    return review

@router.get("/received/{user_id}", response_model=List[UserReviewRead])
def get_reviews_received(user_id: UUID, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.guest_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews received for this user")
    return reviews

@router.get("/given/{user_id}", response_model=List[UserReviewRead])
def get_reviews_given(user_id: UUID, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.host_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews given by this user")
    return reviews

@router.get("/{match_id}", response_model=UserReviewRead)
def get_review_by_match(match_id: UUID, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.match_id == match_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review for this match not found")
    return review