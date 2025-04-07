
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, constr

from app.core.database import Base, engine
from app.routes.user import router as user_router

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(user_router, prefix="/auth", tags=["User"])


@app.get("/")
async def root():
    return {"message": "Hello World"}





class UserBase(BaseModel):
    username: constr(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9 ]+$")
    email: EmailStr


class UserCreate(UserBase):
    password: constr(min_length=8, max_length=64)
