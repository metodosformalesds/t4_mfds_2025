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

class Order(Base):
    __tablename__ = "orders" 
    
    id = Column(Integer, primary_key=True, index=True)

    # Información de la orden
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    status = Column(String(50), default="pending")  # pending, confirmed, shipped, delivered, cancelled, refunded

    # Información de la entrega
    total_amount = Column(Float, nullable=False)  # Total en MXN
    platform_fee = Column(Float, nullable=False)  # 5% del total
    seller_amount = Column(Float, nullable=False)  # total_amount - platform_fee

    # IDs de Stripe
    stripe_payment_intent_id = Column(String(255))  # ID del pago en Stripe
    stripe_transfer_id = Column(String(255))  # ID de la transferencia al vendedor

    # Información de envío
    address = Column(String(255), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True))
    entregado = Column(DateTime(timezone=True))

    # Relaciones
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="orders_as_buyer")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="orders_as_seller")
    items = relationship("OrderItem", back_populates="order")
