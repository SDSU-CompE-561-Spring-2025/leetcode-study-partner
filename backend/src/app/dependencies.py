from app.core.database import SessionLocal
from fastapi.security import OAuth2PasswordBearer

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")