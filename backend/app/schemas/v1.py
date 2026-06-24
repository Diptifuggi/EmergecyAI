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
    username: Optional[str]
    full_name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    role_name: Optional[str]
    is_active: Optional[bool]
    created_at: Optional[str]


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    role_name: Optional[str] = 'Dispatcher'
    is_active: Optional[bool] = True


class UserUpdate(BaseModel):
    full_name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    role_name: Optional[str]
    is_active: Optional[bool]


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
