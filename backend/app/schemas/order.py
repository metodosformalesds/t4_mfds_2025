from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from .user import UserResponse
from .product import ProductResponse

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class OrderItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int
    unit_price: float
    total_price: float

    model_config = ConfigDict(from_attributes=True)

class OrderBase(BaseModel):
    address: str

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class OrderResponse(BaseModel):
    id: int
    order_number: str
    status: str
    total_amount: float
    platform_fee: float
    seller_amount: float
    buyer: UserResponse
    seller: UserResponse
    items: List[OrderItemResponse]
    create_at: datetime
    update_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    entregado: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    address: Optional[str] = None