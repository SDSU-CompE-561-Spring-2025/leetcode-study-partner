from datetime import datetime
from pydantic import BaseModel


class UserDataBase(BaseModel):
    profile_picture: str
    last_login: datetime
    streak: int

class UserDataResponse(UserDataBase):
    id: int
    updated_at: datetime
