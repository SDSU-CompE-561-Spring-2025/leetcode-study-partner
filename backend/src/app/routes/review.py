from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.review import UserReviewCreate, UserReviewRead
from app.models.review import UserReviewModel
from app.core.database import get_db

router = APIRouter()

@router.post("/", response_model=UserReviewRead)
def create_review(review: UserReviewCreate, db: Session = Depends(get_db)):
    db_review = UserReviewModel(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/", response_model=List[UserReviewRead])
def get_all_reviews(db: Session = Depends(get_db)):
    return db.query(UserReviewModel).all()

@router.get("/user/{user_id}", response_model=List[UserReviewRead])
def get_reviews_by_user(user_id: int, db: Session = Depends(get_db)):
    reviews = db.query(UserReviewModel).filter(
        (UserReviewModel.host_id == user_id) | (UserReviewModel.guest_id == user_id)
    ).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this user")
    return reviews


@router.get("/{review_id}", response_model=UserReviewRead)
def get_review_by_id(review_id: int, db: Session = Depends(get_db)):
    review = db.query(UserReviewModel).filter(UserReviewModel.match_id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review