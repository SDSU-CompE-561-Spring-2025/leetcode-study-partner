from fastapi import FastAPI

from app.core.database import Base, engine
from app.routes import api_router

Base.metadata.create_all(bind=engine)
app = FastAPI()
# app.include_router(api_router, prefix="")
app.include_router(user_router, prefix="/auth", tags=["User"])
app.include_router(match_router, prefix="/api", tags=["Match"])


@app.get("/")
async def root():
    return {"message": "Hello World"}
