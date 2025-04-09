from app.schemas.match import MatchDetails, MatchUpdate, MatchHistoryUpdate, MatchStart, MatchEnd, MatchHistory
from fastapi import APIRouter, Depends

import app.services.user as user_service
from app.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/match/start", response_model=MatchStart, tags=["Match"])
def start_match(match: MatchStart, db: Session = Depends(get_db)):
    new_match = user_service.start_match(db=db, match=match)
    return new_match

@router.post("/match/end/{matchID}", response_model=MatchEnd, tags=["Match"])
def end_match(match: MatchEnd, db: Session = Depends(get_db)):
    match_over = user_service.end_match(db=db, match=match)
    return match_over