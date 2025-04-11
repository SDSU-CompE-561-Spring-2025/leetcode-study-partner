from sqlalchemy import Column, Integer, String
from app.core.database import Base
from uuid import UUID
from sqlalchemy.orm import relationship
from .match import Match

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    problem_link = Column(String, index=True)
    method_link = Column(String, index=True)
    category = Column(String, index=True)

    matches = relationship("Match", back_populates="problem")