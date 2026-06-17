from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

# Create async engine and session factory
async_engine = create_async_engine(DATABASE_URL, future=True, echo=False)
async_session = async_sessionmaker(bind=async_engine, expire_on_commit=False)

Base = declarative_base()


async def get_db():
    """FastAPI dependency to provide an async DB session.

    Usage:
        async def endpoint(db: AsyncSession = Depends(get_db)):
            ...
    """
    session = async_session()
    try:
        yield session
    finally:
        await session.close()
