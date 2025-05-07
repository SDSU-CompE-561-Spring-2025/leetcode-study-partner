from datetime import datetime
from typing import Annotated
from pydantic import AnyHttpUrl, BaseModel, StringConstraints, conlist, constr, EmailStr, Field
from typing import Literal

Difficulty = Literal["Easy", "Medium", "Hard"]

class ProblemResponse(BaseModel):
    id: int
    problem_id: int
    problem_link: AnyHttpUrl
    methods_video_link: AnyHttpUrl
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9-\s()]+$", max_length=32)], min_length=0, max_length=8)
    difficulty: Difficulty

    class Config:
        from_attributes = True

class ProblemCreate(BaseModel):
    problem_id: int
    problem_link: AnyHttpUrl
    methods_video_link: AnyHttpUrl
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9-\s()]+$", max_length=32)], min_length=0, max_length=8)
    difficulty: Difficulty

    class Config:
        from_attributes = True
    # class Config:
    #     json_schema_extra = {
    #         "example": {
    #             "problem_id": 1,
    #             "problem_link": "https://leetcode.com/problems/two-sum/description/",
    #             "methods_video_link": "https://www.youtube.com/watch?v=KLlXCFG5TnA",
    #             "categories": ["Array", "HashTable"]
    #         }
    #     }

class UniqueTagsResponse(BaseModel):
    tags: list[Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9-\s()]+$", max_length=64)]]

    class Config:
        schema_extra = {
            "example": {
                "tags": ["array", "of", "tags"]
            }
        }