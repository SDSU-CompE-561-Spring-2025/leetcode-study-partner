from fastapi import FastAPI

from app.core.database import Base, engine
from app.routes.user import router as user_router
from app.routes.websocket import router as websocket_router

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(user_router, prefix="/auth", tags=["User"])
app.include_router(websocket_router, prefix="/ws", tags=["WebSocket"])


@app.get("/")
async def root():
    return {"message": "Hello World"}
