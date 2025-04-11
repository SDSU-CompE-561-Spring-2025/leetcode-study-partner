from datetime import datetime, timezone
from fastapi import HTTPException
from uuid import UUID
from app.schemas.match import MatchCreate, MatchStart, MatchEnd, MatchDetails, MatchHistory
from fastapi import APIRouter, Depends
from app.models.match import Match

import app.services.match as match_service
from app.dependencies import get_db
from sqlalchemy.orm import Session

router = APIRouter()
