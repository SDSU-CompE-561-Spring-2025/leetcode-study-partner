from datetime import UTC, datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.review import Review
from app.schemas.review import UserReviewCreate
from app.models.match import Match

def create_review(db: Session, review: UserReviewCreate):
    
    match = db.query(Match).filter(Match.matchID == review.match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found.")
    
    existing_review = db.query(Review).filter(Review.match_id == review.match_id).first()
    if existing_review:
        raise HTTPException(status_code=409, detail="Review already exists for this match.")

    db_review = Review(
        match_id=match.matchID,
        to_host_rating=review.to_host_rating,
        to_guest_rating=review.to_guest_rating,
        to_host_comment=review.to_host_comment,
        to_guest_comment=review.to_guest_comment,
        problem_solved=review.problem_solved,
        time_given=review.time_given,
        elapsed_time=review.elapsed_time,
        host_id=review.host_id,
        guest_id=review.guest_id,
        review_updated_at=datetime.now(UTC)
    )

    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_received(db: Session, user_id: int):
    reviews = db.query(Review).filter(Review.guest_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews received for this user.")
    return reviews

def get_reviews_given(db: Session, user_id: int):
    reviews = db.query(Review).filter(Review.host_id == user_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews given by this user.")
    return reviews

def get_review_by_match_id(db: Session, match_id: int):
    review = db.query(Review).filter(Review.match_id == match_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review for this match not found.")
    return review