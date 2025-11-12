from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, DECIMAL, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    # Información básica del producto
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    category = Column(String(50), nullable=False) # 'Producto'o 'Material'

    # Inventario y disponibilidad
    stock = Column(Integer, nullable=False, default=1)
    is_available = Column(Boolean, default=True)

    # Imágenes (almacenamos array de URLs en S3)
    images = Column(JSON, default=list)  # Lista de URLs: ["url1", "url2"]

    # Información de ubicación/entrega
    address = Column(String(255), nullable=False)

    # Métricas
    view_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    user = relationship("User", back_populates="products")
    orders = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product")
    favorite_by = relationship("FavoriteProduct", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product")