from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name:str
    bio: Optional[str] = None
    address: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str 
    rol: str = "customer"

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name:Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    Rol: str
    stripe_customer_id: Optional[str] = None
    stripe_account_id: Optional[str] = None
    stripe_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
    
class UserLogin(BaseModel):
    email:str
    password: str

class Token(BaseModel):
    access_toke: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None