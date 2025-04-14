from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class UserDataBase(BaseModel):
    profile_picture: Optional[str] = None
    last_login: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserDataCreate(UserDataBase):
    user_id: str

class UserDataResponse(UserDataBase):
    id: int
    user_id: str
