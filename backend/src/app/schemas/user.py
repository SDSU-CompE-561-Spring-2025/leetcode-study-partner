from datetime import datetime
from typing import Optional
from pydantic import BaseModel, constr, EmailStr, Field
from uuid import UUID

class UserBase(BaseModel):
    username: constr(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9 ]+$")
    email: EmailStr


class UserCreate(UserBase):
    password: constr(min_length=8, max_length=64)

class User(UserBase):
    id: UUID = Field(...)
    username: constr(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: UUID = Field(...)
    username: constr(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdateRequest(BaseModel):
    current_password: str
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    new_password: Optional[constr(min_length=8, max_length=64)] = None

class DeleteUserRequest(BaseModel):
    password: str

class OAuthUserCreate(BaseModel):
    username: str
    email: EmailStr
    provider: str
    access_token: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str