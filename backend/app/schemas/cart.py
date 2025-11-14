from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from .product import ProductResponse

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
    
class CartUpdate(BaseModel):
    quantity: int