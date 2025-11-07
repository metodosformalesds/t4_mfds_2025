from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from pydantic import ConfigDict

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str 
    phone: Optional[str] = None
    birthdate: Optional[date] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone: Optional[str] = None
    Role: str
    birthdate: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)