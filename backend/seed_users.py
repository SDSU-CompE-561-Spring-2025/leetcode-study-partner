from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from app.models.user import User
from app.core.database import SessionLocal

host_id = UUID("c9c3b53f-6719-4c33-9f02-1927bdfb9ed9")
guest_id = UUID("e1483f9a-2dfc-4dbb-b7c3-5c1262b4a01c")

def seed_users():
    db: Session = SessionLocal()

    for user_id, username, email in [
        (host_id, "host_test", "host@example.com"),
        (guest_id, "guest_test", "guest@example.com"),
    ]:
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            db_user = User(
                id=user_id,
                username=username,
                email=email,
                password_hash="fakehash",  # or real bcrypt hash
                is_active=True,
                is_verified=True,
                created_at=datetime.now(timezone.utc)
            )
            db.add(db_user)
            print(f"✅ Added user {username}")
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_users()