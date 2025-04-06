from fastapi import FastAPI
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)
app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
