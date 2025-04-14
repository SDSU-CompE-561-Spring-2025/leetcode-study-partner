from app.models.token import RefreshToken
from sqlalchemy.orm import Session

#from app.core.security import verify_password

def store_refresh_token(db: Session, user_id: str, refresh_token: str):
    db_token = RefreshToken(token=refresh_token, user_id=user_id)
    db.add(db_token)
    db.commit()

def delete_token(db: Session, refresh_token: str):
    token_entry = db.query(RefreshToken).filter_by(token=refresh_token).first()
    if not token_entry:
        return False

    db.delete(token_entry)
    db.commit()
    return True
