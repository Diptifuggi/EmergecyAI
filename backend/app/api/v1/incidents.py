from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.v1 import IncidentOut

router = APIRouter(tags=["incidents"])


def _get_current_user():
    """Auth dependency placeholder."""
    return None


@router.get("/", response_model=List[IncidentOut], status_code=status.HTTP_200_OK)
async def list_incidents(current_user=Depends(_get_current_user)):
    """Placeholder incidents listing."""
    return []
