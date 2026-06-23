from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.schemas.v1 import LoginRequest, Token, UserOut

router = APIRouter(tags=["auth"])


def _get_current_user():
    """Placeholder auth dependency."""
    return None


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


@router.post("/", response_model=Token, status_code=status.HTTP_200_OK)
async def login(payload: LoginRequest):
    """Login placeholder — returns a fake token."""
    # TODO: implement real authentication
    return Token(access_token="fake-token", token_type="bearer")


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    """Register placeholder — creates a fake user and returns it."""
    # Note: this is a placeholder implementation for local development.
    username = payload.email.split("@")[0]
    return UserOut(id=None, username=username, email=payload.email)


@router.post("/refresh", response_model=Token, status_code=status.HTTP_200_OK)
async def refresh():
    """Refresh placeholder — returns a fresh fake token."""
    return Token(access_token="fake-token", token_type="bearer")


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    """Logout placeholder — no-op."""
    return {"status": "ok"}


@router.get("/me", response_model=UserOut, status_code=status.HTTP_200_OK)
async def me():
    """Return a fake current user for development purposes."""
    return UserOut(id=None, username="demo", email="demo@example.com")
