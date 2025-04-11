from fastapi import FastAPI

from app.core.database import Base, engine
from app.routes import api_router
from app.routes.websocket import router as websocket_router

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.include_router(api_router, prefix="")
app.include_router(websocket_router, prefix="/ws", tags=["WebSocket"])


@app.get("/")
async def root():
    return {"message": "Hello World"}
