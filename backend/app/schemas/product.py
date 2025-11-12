from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from .user import UserResponse

class ProductBase(BaseModel):
    name: str
    descrption: Optional[str] = None
    price: float
    category: str #'producto' o 'material'
    stock: int = 1
    address: str
    images: List[str] = []
    
class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    descrption: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    address: Optional[str] = None
    is_available: Optional[bool] = None
    images: Optional[List[str]] = None

class ProductResponse(ProductBase):
    id: int
    user_id: int
    is_available: bool
    view_count: int
    average_rating: float
    review_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class ProductWithArtist(ProductResponse):
    artist: UserResponse