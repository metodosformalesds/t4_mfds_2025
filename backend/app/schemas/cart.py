# Autor: Villedo Martinez Sandoval
# Fecha: 12/11/2025
# Descripción: Esquemas Pydantic para validación de datos de Carrito, incluyendo items del carrito, actualización de cantidad y respuesta con información de productos

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