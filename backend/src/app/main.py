from contextlib import asynccontextmanager
from fastapi import FastAPI
import asyncio

from app.services.matchmaking_loop import matchmaking_loop
from app.routes import api_router
from app.routes.websocket import router as websocket_router
from app.core.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

background_tasks = set()

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(matchmaking_loop())
    background_tasks.add(task)
    task.add_done_callback(background_tasks.discard)
    print("[Startup] Matchmaking loop started")
    try:
        yield
    finally:
        print("[Shutdown] Stopping matchmaking loop")
        for task in background_tasks:
            task.cancel()
        if background_tasks:
            await asyncio.gather(*background_tasks, return_exceptions=True)
        print("[Shutdown] Matchmaking loop stopped")

Base.metadata.create_all(bind=engine)

app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix="")
#app.include_router(websocket_router, prefix="/ws", tags=["WebSocket"])

# CORS 
origins = [
    "http://localhost:3000",
    "https://localhost:3443", #reverse proxy 
    "http://localhost:8000",
    "https://localhost:8000",
    "ws://localhost:8000",
    "wss://localhost:8000",
    "http://frontend:3000",
    "https://frontend:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Leetcode Study Partner Backend"}