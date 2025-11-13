# app/services/favorite_service.py
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.favoriteproduct import FavoriteProduct
from models.favoriteartist import FavoriteArtist

class FavoriteService:
    # Product Favorites
    def add_favorite_product(self, db: Session, user_id: int, product_id: int):
        # Verificar si ya existe
        existing = db.query(FavoriteProduct).filter(
            and_(
                FavoriteProduct.user_id == user_id,
                FavoriteProduct.product_id == product_id
            )
        ).first()
        
        if existing:
            return existing
        
        favorite = FavoriteProduct(user_id=user_id, product_id=product_id)
        db.add(favorite)
        db.commit()
        db.refresh(favorite)
        return favorite

    def remove_favorite_product(self, db: Session, user_id: int, product_id: int):
        favorite = db.query(FavoriteProduct).filter(
            and_(
                FavoriteProduct.user_id == user_id,
                FavoriteProduct.product_id == product_id
            )
        ).first()
        
        if favorite:
            db.delete(favorite)
            db.commit()
            return True
        return False

    def get_favorite_products(self, db: Session, user_id: int):
        return db.query(FavoriteProduct).filter(FavoriteProduct.user_id == user_id).all()

    # Artist Favorites
    def add_favorite_artist(self, db: Session, user_id: int, artist_id: int):
        # Verificar si ya existe
        existing = db.query(FavoriteArtist).filter(
            and_(
                FavoriteArtist.user_id == user_id,
                FavoriteArtist.artist_id == artist_id
            )
        ).first()
        
        if existing:
            return existing
        
        favorite = FavoriteArtist(user_id=user_id, artist_id=artist_id)
        db.add(favorite)
        db.commit()
        db.refresh(favorite)
        return favorite

    def remove_favorite_artist(self, db: Session, user_id: int, artist_id: int):
        favorite = db.query(FavoriteArtist).filter(
            and_(
                FavoriteArtist.user_id == user_id,
                FavoriteArtist.artist_id == artist_id
            )
        ).first()
        
        if favorite:
            db.delete(favorite)
            db.commit()
            return True
        return False

    def get_favorite_artists(self, db: Session, user_id: int):
        return db.query(FavoriteArtist).filter(FavoriteArtist.user_id == user_id).all()