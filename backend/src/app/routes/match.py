from app.schemas.match import MatchDetails, MatchUpdate, MatchHistoryUpdate, MatchStart, MatchEnd, MatchHistory
from fastapi import APIRouter, Depends

import app.services.match as match_service
from app.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/match/start", response_model=MatchStart, tags=["Match"])
def start_match(match: MatchStart, db: Session = Depends(get_db)):
    new_match = match_service.start_match(db=db, match=match)
    return new_match

@router.put("/match/end/{matchID}", response_model=MatchEnd, tags=["Match"])
def end_match(match: MatchEnd, db: Session = Depends(get_db)):
    match_over = match_service.end_match(db=db, match=match)
    return match_over

@router.get("/match/{matchID}", response_model=MatchDetails, tags=["Match"])
def get_match_details(matchID: str, db: Session = Depends(get_db)):
    match = match_service.get_match_details(db=db, matchID=matchID)
    return match

@router.get("/match/history/{userID}", response_model=list[MatchHistory], tags=["Match"])
def get_match_history(userID: str, db: Session = Depends(get_db)):
    match_history = match_service.get_match_history(db=db, userID=userID)
    return match_history

