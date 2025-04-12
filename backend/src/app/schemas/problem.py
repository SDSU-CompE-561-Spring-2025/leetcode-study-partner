from datetime import datetime
from pydantic import BaseModel, constr, EmailStr, Field

class Problem(BaseModel):
    id: int
    problem_link: str
    methods_video_link: str
    category: str