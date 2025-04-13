from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.review import UserReviewModel
from app.schemas.review import UserReviewCreate

def create_review(db: Session, review: UserReviewCreate):
    db_review = UserReviewModel(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_received(db: Session, user_id: int):
    reviews = db.query(UserReviewModel).filter(UserReviewModel.guest_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews received for this user.")
    return reviews

def get_reviews_given(db: Session, user_id: int):
    reviews = db.query(UserReviewModel).filter(UserReviewModel.host_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews given by this user.")
    return reviews

def get_review_by_match_id(db: Session, match_id: int):
    review = db.query(UserReviewModel).filter(UserReviewModel.match_id == match_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review for this match not found.")
    return review