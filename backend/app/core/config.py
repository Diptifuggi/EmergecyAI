from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, AnyHttpUrl


class Settings(BaseSettings):
    APP_NAME: str = "EmergencyIQ API"
    ENVIRONMENT: str = "dev"
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_AUDIO_EXTENSIONS: List[str] = ["wav", "mp3", "m4a", "ogg"]
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
