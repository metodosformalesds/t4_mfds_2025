from sqlalchemy import Column, Integer, String, Text
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
    Rol = Column(String(20), default="customer")
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