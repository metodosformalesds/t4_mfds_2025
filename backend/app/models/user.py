# app/models/user.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, DECIMAL, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    bio =  Column(Text)
    address = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20))
    Role = Column(String(20), default="customer")  
    birthdate = Column(DateTime)
    profile_picture = Column(String(255))
    stripe_id = Column(String(255), nullable=False)
    stripe_status = Column(String(50), default="pending")

class Category:
    __tablename__ = "category"

    Id = Column("category_id",Integer, primary_key=True, index=True)
    Name = Column(String(255), unique = True, nullable = False)

class Product:
    __tablename__ = "product"

    Id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("category.category_id"), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    material = Column(String(255))
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime)
    stock = Column(Integer, nullable=False)

class ProductImage:
    __tablename__ = "product_image"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.product_id"), nullable=False)
    image_url = Column(String(255), nullable=False)

class Cart:
    __tablename__ = "cart"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    date = Column("Date", Date)
    status = Column("Status", String(50), default="Active")

class CartProduct:
    __tablename__ = "cart_product"
    
    cart_id = Column(Integer, ForeignKey("cart.cart_id"), primary_key=True)
    product_id = Column(Integer, ForeignKey("product.product_id"), primary_key=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)

class Review:
    __tablename__ = "review"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.product_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    date = Column(Date)

class Order:
    __tablename__ = "order" 
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    date = Column(Date)
    total = Column(DECIMAL(10, 2), nullable=False)
    order_status = Column(String(50), default="Pending")
    type_order = Column(String(50))
    cart_id = Column(Integer, ForeignKey("cart.cart_id"), unique=True)

class OrderProduct:
    __tablename__ = "order_product"
    
    order_id = Column(Integer, ForeignKey("Order_.order_id"), primary_key=True)
    product_id = Column(Integer, ForeignKey("product.product_id"), primary_key=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)

class Transaction(Base):
    __tablename__ = "Transaction"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("Order_.order_id"), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    stripe_id = Column(String(255), unique=True)
    amount = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(10), nullable=False)
    status = Column(String(50), nullable=False)
    transaction_date = Column(DateTime)
