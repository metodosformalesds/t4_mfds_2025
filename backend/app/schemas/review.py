from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from .user import UserResponse
from .product import ProductResponse

class ReviewBase(BaseModel):
    title: str
    comment: str
    rating: int #1-5

class ReviewCreate(BaseModel):
    product_id: int
    order_id: int
    
class ReviewResponse(BaseModel):
    id:int
    product: ProductResponse
    reviewer: UserResponse
    seller: UserResponse
    is_verified_purchase: bool
    create_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)