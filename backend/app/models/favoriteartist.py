from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

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