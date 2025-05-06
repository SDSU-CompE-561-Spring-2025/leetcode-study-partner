from datetime import datetime, timezone
from fastapi import HTTPException
from uuid import UUID
from app.schemas.match import MatchCreate, MatchStart, MatchEnd, MatchDetails, MatchHistory, MatchResponse, MatchEndResponse
from fastapi import APIRouter, Depends
from app.models.match import Match

import app.services.match as match_service
from app.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/create", response_model=MatchResponse, tags=["Match"])
def create_match(reqBody: MatchCreate, db: Session = Depends(get_db)):
    new_match = match_service.create_match(db=db, match=reqBody)
    return new_match

@router.delete("/delete{match_id}")
def delete_match(reqBody: UUID, db: Session = Depends(get_db)):
    match = db.query(Match).filter(Match.match_id == reqBody).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    db.delete(match)
    db.commit()
    return {"message": "Match deleted successfully"}

@router.put("/start/{match_id}", response_model=MatchStart, tags=["Match"])
def start_match(reqBody: UUID, db: Session = Depends(get_db)):
    existing = db.query(Match).filter(Match.match_id == reqBody).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Match not found")
    
    start = match_service.start_match(db=db, match_id=reqBody)
    return start

@router.put("/end/{match_id}", response_model=MatchEndResponse, tags=["Match"])
def end_match(match_id:UUID, match: MatchEnd, db: Session = Depends(get_db)):
    match_over = match_service.end_match(db=db, match_id=match_id, match_data=match)
    return match_over

@router.get("/details/{match_id}", response_model=MatchDetails, tags=["Match"])
def get_match_details(match_id: UUID, db: Session = Depends(get_db)):
    details = match_service.get_match_details(db=db, match_id=match_id)
    if not details:
        raise HTTPException(status_code=404, detail="Match not found")
    return details


@router.get("/history/{user_id}", response_model=list[MatchHistory], tags=["Match"])
def get_match_history(match_id: UUID, db: Session = Depends(get_db)):
    matches = match_service.get_all_matches(db=db, match_id=match_id)
    if not matches:
        raise HTTPException(status_code=404, detail="No match history found")
    return matches

