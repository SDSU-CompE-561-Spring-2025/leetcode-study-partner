from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import UTC, datetime
from app.core.database import Base

class Problem(Base):
    __tablename__ = "problems"

    ## ATTRIBUTES ## 
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    problem_id = Column(Integer, unique=True, index=True)
    problem_link = Column(String(512))
    methods_video_link = Column(String(512))
    categories = Column(ARRAY(String(64))) 
    
    