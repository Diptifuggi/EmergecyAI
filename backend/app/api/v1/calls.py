from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.v1 import CallOut

router = APIRouter(tags=["calls"])


def _get_current_user():
    """Auth dependency placeholder."""
    return None


@router.get("/", response_model=List[CallOut], status_code=status.HTTP_200_OK)
async def list_calls(current_user=Depends(_get_current_user)):
    """Placeholder calls listing."""
    return []
