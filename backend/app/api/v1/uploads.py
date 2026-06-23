from fastapi import APIRouter, UploadFile, File, Depends, status
from app.schemas.v1 import UploadOut

router = APIRouter(tags=["uploads"])


def _get_current_user():
    """Auth dependency placeholder."""
    return None


@router.post("/", response_model=UploadOut, status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...), current_user=Depends(_get_current_user)):
    """Placeholder uploads endpoint."""
    return UploadOut(filename=file.filename, content_type=file.content_type)
