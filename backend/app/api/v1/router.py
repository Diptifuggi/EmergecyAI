from fastapi import APIRouter
from .health import router as health_router
from .auth import router as auth_router
from .users import router as users_router
from .calls import router as calls_router
from .incidents import router as incidents_router
from .uploads import router as uploads_router

api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(calls_router, prefix="/calls", tags=["calls"])
api_router.include_router(incidents_router, prefix="/incidents", tags=["incidents"])
api_router.include_router(uploads_router, prefix="/uploads", tags=["uploads"])
