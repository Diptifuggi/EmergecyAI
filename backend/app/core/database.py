# from pathlib import Path
# from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
# from sqlalchemy.orm import declarative_base
# from app.core.config import settings

# DATABASE_URL = settings.DATABASE_URL

# # Create async engine and session factory
# async_engine = create_async_engine(DATABASE_URL, future=True, echo=False)
# async_session = async_sessionmaker(bind=async_engine, expire_on_commit=False)

# Base = declarative_base()


# async def get_db():
#     """FastAPI dependency to provide an async DB session.

#     Usage:
#         async def endpoint(db: AsyncSession = Depends(get_db)):
#             ...
#     """
#     session = async_session()
#     try:
#         yield session
#     finally:
#         await session.close()
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()