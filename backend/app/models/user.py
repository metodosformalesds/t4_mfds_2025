# app/models/user.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, DECIMAL, ForeignKey, JSON, Float, Enum
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    bio =  Column(Text)
    address = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20))
    Role = Column(String(20), default="customer")
    profile_picture = Column(String(255))

    # Stripe
    stripe_customer_id  = Column(String(255), nullable=True)
    stripe_account_id = Column(String(255), nullable=True)
    stripe_status = Column(String(50), default="pending")

    # Relaciones
    products = relationship("Product", back_populates="user")
    orders_as_buyer = relationship("Order", foreign_keys="Order.buyer_id", back_populates="buyer")
    orders_as_seller = relationship("Order", foreign_keys="Order.seller_id", back_populates="seller")
    reviews_written = relationship("Review", back_populates="reviewer")
    reviews_received = relationship("Review", foreign_keys="Review.seller_id", back_populates="seller")
    favorite_products = relationship("FavoriteProduct", back_populates="user")
    favorite_artists = relationship("FavoriteArtist", foreign_keys="FavoriteArtist.user_id", back_populates="user")
    favorite_artists_of = relationship("FavoriteArtist", foreign_keys="FavoriteArtist.artist_id", back_populates="artist")
    cart_items = relationship("CartItem", back_populates="user")

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

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)

    # Información de la reseña
    title = Column(String(200))
    comment = Column(Text)
    rating = Column(Integer, nullable=False)  # 1-5 estrellas
    is_verified_purchase = Column(Boolean, default=False)

    # Relaciones
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    product = relationship("Product", back_populates="reviews")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_written")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="reviews_received")
    order = relationship("Order")

class FavoriteProduct(Base):
    __tablename__ = "favorite_products"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    user = relationship("User", back_populates="favorite_products")
    product = relationship("Product", back_populates="favorite_by")
    
    # Unique constraint para evitar duplicados
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )

class FavoriteArtist(Base):
    __tablename__ = "favorite_artists"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Usuario que marca como favorito
    artist_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Artista marcado como favorito
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    user = relationship("User", foreign_keys=[user_id], back_populates="favorite_artists")
    artist = relationship("User", foreign_keys=[artist_id], back_populates="favorite_artists_of")
    
    # Unique constraint para evitar duplicados
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Información del ítem
    quantity = Column(Integer, nullable=False, default=1)
    
    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    user = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")
    
    # Unique constraint para evitar duplicados
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    stripe_payment_intent = Column(String, unique=True)
    stripe_session_id = Column(String, unique=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="usd")
    status = Column(Enum("pending", "succeeded", "failed", name="payment_status"), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    order = relationship("Order", back_populates="payment")
