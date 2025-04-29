from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import asyncio

from app.core.database import Base, engine
from app.dependencies import get_db
from app.routes import api_router
from app.routes.websocket import router as websocket_router
from app.services.matchmaking import matchmaking_poll
from fastapi.middleware.cors import CORSMiddleware


# Store background tasks reference to prevent garbage collection
background_tasks = set()

@asynccontextmanager
async def lifespan(app: FastAPI):
    gen = get_db()
    db = next(gen)
    try:
        task = asyncio.create_task(matchmaking_poll(db))
        background_tasks.add(task)
        task.add_done_callback(background_tasks.discard)
        print("Matchmaking service started")
        yield  # This is where the app runs and handles requests
    finally:
        print("Shutting down matchmaking service")
        for task in background_tasks:
            task.cancel()
        if background_tasks:
            await asyncio.gather(*background_tasks, return_exceptions=True)
        print("Matchmaking service stopped")
        gen.close()

Base.metadata.create_all(bind=engine)
app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix="")
app.include_router(websocket_router, prefix="/ws", tags=["WebSocket"])

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    # Added for Next.js frontend and WebRTC signaling
    "http://localhost:3000",
    "https://localhost:3000",
    "ws://localhost:3000",
    "wss://localhost:3000",
    "ws://localhost:8000",
    "wss://localhost:8000"
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
    return {"message": "Hello World"}

