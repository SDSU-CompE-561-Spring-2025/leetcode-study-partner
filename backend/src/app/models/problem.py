from sqlalchemy import Boolean, Column, DateTime, Integer, String
from datetime import UTC, datetime
from app.core.database import Base

class Problem(Base):
    __tablename__ = "problems"

    ## ATTRIBUTES ## 
    lc_id = Column(Integer, primary_key=True, index=True)
    problem_link = Column(String)
    methods_video_link = Column(String)
    category = Column(String)
    
    ## RELATIONSHIPS ##