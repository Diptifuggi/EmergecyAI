from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: Optional[str]
    username: str
    email: EmailStr


class CallOut(BaseModel):
    id: Optional[str]
    started_at: Optional[datetime]
    duration_seconds: Optional[int]


class IncidentOut(BaseModel):
    id: Optional[str]
    title: str
    created_at: Optional[datetime]


class UploadOut(BaseModel):
    filename: str
    content_type: Optional[str]


__all__ = [
    "Token",
    "LoginRequest",
    "UserOut",
    "CallOut",
    "IncidentOut",
    "UploadOut",
]
