from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import asyncio

from app.core.database import Base, engine
from app.dependencies import get_db
from app.routes import api_router
from app.routes.websocket import router as websocket_router
from app.services.matchmaking import matchmaking_poll

# Store background tasks reference to prevent garbage collection
background_tasks = set()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create a background task for matchmaking
    db = next(get_db())
    task = asyncio.create_task(matchmaking_poll(db))
    # Add task to the set to prevent it being garbage collected
    background_tasks.add(task)
    task.add_done_callback(background_tasks.discard)
    print("Matchmaking service started")
    
    yield  # This is where the app runs and handles requests
    
    # Cleanup code when the app is shutting down
    print("Shutting down matchmaking service")
    # Cancel any running background tasks
    for task in background_tasks:
        task.cancel()
    
    # Wait for tasks to complete cancellation
    if background_tasks:
        await asyncio.gather(*background_tasks, return_exceptions=True)
    print("Matchmaking service stopped")

Base.metadata.create_all(bind=engine)
app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix="")
app.include_router(websocket_router, prefix="/ws", tags=["WebSocket"])

@app.get("/")
async def root():
    return {"message": "Hello World"}

