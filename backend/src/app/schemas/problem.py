from datetime import datetime
from typing import Annotated
from pydantic import AnyHttpUrl, BaseModel, StringConstraints, conlist, constr, EmailStr, Field
from typing import Literal

Difficulty = Literal["easy", "medium", "hard"]
class Problem(BaseModel):
    id: int
    problem_id: int
    problem_link: AnyHttpUrl
    methods_video_link: AnyHttpUrl
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_\-\s\(\)]+$", max_length=32)], min_length=0, max_length=8)

class ProblemCreate(BaseModel):
    problem_id: int
    problem_link: AnyHttpUrl
    methods_video_link: AnyHttpUrl
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_\-\s\(\)]+$", max_length=32)], min_length=0, max_length=8)

class UniqueTagsResponse(BaseModel):
    tags: list[Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_\-\s\(\)]+$", max_length=64)]]

    class Config:
        schema_extra = {
            "example": {
                "tags": ["array", "of", "tags"]
            }
        }



