from pydantic import BaseModel, conlist, AnyHttpUrl
from typing import Annotated
from pydantic import StringConstraints
from typing import Literal

Difficulty = Literal["Easy", "Medium", "Hard"]

class Problem(BaseModel):
    id: int
    problem_id: int
    problem_link: AnyHttpUrl
    methods_video_link: AnyHttpUrl
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_]+$", max_length=32)], min_length=1, max_length=5)
    difficulty: Difficulty

    class Config:
        from_attributes = True

class ProblemCreate(BaseModel):
    problem_id: int
    problem_link: AnyHttpUrl
    methods_video_link: AnyHttpUrl
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_]+$", max_length=32)], min_length=1, max_length=5)
    difficulty: Difficulty