from datetime import datetime
from pydantic import BaseModel

class UserDataBase(BaseModel):
    profile_picture: str
    last_login: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserDataResponse(UserDataBase):
    id: int
