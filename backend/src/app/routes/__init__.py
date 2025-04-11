from fastapi import APIRouter

from app.routes import user, user_data

api_router = APIRouter()
api_router.include_router(user.router, prefix="/auth", tags=["User"])
api_router.include_router(user_data.router, prefix="/data", tags=["User Data"])
