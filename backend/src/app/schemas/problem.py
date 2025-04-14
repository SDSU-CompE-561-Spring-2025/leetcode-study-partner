from datetime import datetime
from typing import Annotated
from pydantic import AnyHttpUrl, BaseModel, StringConstraints, conlist, constr, EmailStr, Field

class Problem(BaseModel):
    id: int
    problem_id: int
    problem_link: AnyHttpUrl
    methods_video_link: AnyHttpUrl
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_]+$", max_length=32)], min_length=1, max_length=5)

class ProblemCreate(BaseModel):
    problem_id: int
    problem_link: AnyHttpUrl
    methods_video_link: AnyHttpUrl
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_]+$", max_length=32)], min_length=1, max_length=5)
    


