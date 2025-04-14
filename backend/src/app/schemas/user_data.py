from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class UserDataBase(BaseModel):
    profile_picture: Optional[str] = None
    last_login: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserDataCreate(UserDataBase):
    user_id: UUID

class UserDataResponse(UserDataBase):
    id: int
    user_id: UUID

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class UserDataBase(BaseModel):
    profile_picture: str | None = None

class UserDataUpdate(UserDataBase):
    pass
