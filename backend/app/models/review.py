from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime,ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

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