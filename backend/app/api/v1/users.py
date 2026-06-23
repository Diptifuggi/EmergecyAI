from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.v1 import UserOut

router = APIRouter(tags=["users"])


def _get_current_user():
    """Auth dependency placeholder."""
    return None


@router.get("/", response_model=List[UserOut], status_code=status.HTTP_200_OK)
async def list_users(current_user=Depends(_get_current_user)):
    """Placeholder users listing."""
    return []
