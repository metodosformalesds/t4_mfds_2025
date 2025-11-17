# Autor: Villedo Martinez Sandoval
# Fecha: 12/11/2025
# Descripción: Esquemas Pydantic para validación de datos de Pago, incluyendo creación de intención de pago y respuesta de pagos Stripe

from pydantic import BaseModel, ConfigDict
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