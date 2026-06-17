from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import app.models

from app.core.config import settings
from app.core.logger import get_logger
from app.api.v1.router import api_router
from app.core.exceptions import register_exception_handlers
from app.core.database import Base, engine
from app.api.v1.health import router as health_router
Base.metadata.create_all(bind=engine)
logger = get_logger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0"
    )

    origins = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api/v1")
    app.include_router(health_router)

    register_exception_handlers(app)

    @app.on_event("startup")
    async def startup_event():
        logger.info("Starting EmergencyIQ API...")

        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))

            logger.info("Database connected successfully")

        except Exception as exc:
            logger.exception(
                f"Database connectivity failed: {exc}"
            )

    @app.get("/")
    def root():
        return {
            "message": "EmergencyIQ API Running",
            "status": "success"
        }

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )