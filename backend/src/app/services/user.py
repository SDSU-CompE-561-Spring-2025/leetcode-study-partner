
#from app.core.auth import get_password_hash
from app.core.config import get_settings
#from app.core.security import verify_password

settings = get_settings()

# USER CRUD

def create_user():
    print("User created succesfully")
    return {
  "id": 1,
  "username": "x3LM7lmez_u8eY4PK3kqRfZBP0QS1BVxbx2TqGFAYnBK",
  "email": "user@example.com",
  "created_at": "2025-04-08T21:26:39.937Z"
}
