from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

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