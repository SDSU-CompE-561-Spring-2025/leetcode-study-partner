from fastapi import APIRouter

from app.routes import user, user_data, match, review, problem, match_signaling

api_router = APIRouter()
api_router.include_router(user.router, prefix="/auth", tags=["User"])
api_router.include_router(user_data.router, prefix="/data", tags=["User Data"])
api_router.include_router(match.router, prefix="/api/match", tags=["Match"])
api_router.include_router(review.router, prefix="/api/reviews", tags=["Reviews"])
api_router.include_router(problem.router, prefix="/api/problem", tags=["Problem"])
api_router.include_router(match_signaling.router, prefix="/ws/signaling", tags=["Signaling","Websocket"])