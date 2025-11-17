# Autor: Villedo Martinez Sandoval
# Fecha: 12/11/2025
# Descripción: Modelo de base de datos para la entidad OrderProduct, que representa los items incluidos en una orden con sus precios y cantidades

from sqlalchemy import Column, Integer, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

class OrderProduct(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Información del ítem
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)  # Precio en el momento de la compra
    total_price = Column(Float, nullable=False)  # quantity * unit_price
    
    # Relaciones
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="orders")