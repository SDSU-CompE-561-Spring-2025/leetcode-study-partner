from fastapi import APIRouter

router = APIRouter()


@router.post("/register")
def register_user():
    return {"message": "User registered"}


@router.post("/token")
async def login_for_access_token():
    return {"message": "user logged in"}


@router.get("/users/me")
def read_users_me():
    return {"message": "User details returned successfully"}

@router.post("/users/verify-email/{verification_code}")
def verify_email(verification_code: str):
    return {"message": "Email verified successfully"}
