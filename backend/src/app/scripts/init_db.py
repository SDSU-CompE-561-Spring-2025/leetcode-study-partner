# backend/src/app/scripts/init_db.py
from app.core.database import Base, engine
import app.models  # Ensures all models are registered

if __name__ == "__main__":
    print("[init_db] Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("[init_db] All tables created.")
