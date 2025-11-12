from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PaymentIntentCreate(BaseModel):
    order_id: int

class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
    
class PaymentResponse(BaseModel):
    id: int
    order_id: int
    amount: float
    currency: str
    status: str
    stripe_payment_intent: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)