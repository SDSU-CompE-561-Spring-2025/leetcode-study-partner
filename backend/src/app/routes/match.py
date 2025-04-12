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

# Will be removed, only for testing
@router.delete("/match/{matchID}")
def delete_match(reqBody: str, db: Session = Depends(get_db)):
    match = db.query(Match).filter(Match.matchID == reqBody).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    db.delete(match)
    db.commit()
    return {"message": "Match deleted successfully"}


@router.post("/match/create", response_model=MatchResponse, tags=["Match"])
def create_match(reqBody: MatchCreate, db: Session = Depends(get_db)):
    new_match = match_service.create_match(db=db, match=reqBody)
    return new_match

@router.put("/match/start", response_model=MatchStart, tags=["Match"])
def start_match(reqBody: str, db: Session = Depends(get_db)):
    existing = db.query(Match).filter(Match.matchID == reqBody).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Match not found")
    
    start = match_service.start_match(db=db, match=existing)
    return start

# TODO: Fix the other endpoints: match end and match history

@router.put("/match/end/{matchID}", response_model=MatchEndResponse, tags=["Match"])
def end_match(matchID:str, match: MatchEnd, db: Session = Depends(get_db)):
    match_over = match_service.end_match(db=db, matchID=matchID, match_data=match)
    return match_over

@router.get("/match/{matchID}", response_model=MatchDetails, tags=["Match"])
def get_match_details(reqBody: str, db: Session = Depends(get_db)):
    details = match_service.get_match_details(db=db, match_id=reqBody)
    if not details:
        raise HTTPException(status_code=404, detail="Match not found")
    return details

@router.get("/match/history/{userID}", response_model=list[MatchHistory], tags=["Match"])
def get_match_history(reqBody: str, db: Session = Depends(get_db)):
    matches = match_service.get_all_matches(db=db, reqBody=reqBody)
    if not matches:
        raise HTTPException(status_code=404, detail="No match history found")
    return matches

