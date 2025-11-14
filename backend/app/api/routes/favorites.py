# app/api/routes/favorites.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from api.dependencies import get_current_user
from schemas.favorite import FavoriteProductResponse, FavoriteArtistResponse, FavoriteProductBase, FavoriteArtistBase
from schemas.user import UserResponse
from services.favorite_service import FavoriteService

router = APIRouter()
favorite_service = FavoriteService()

# Product Favorites
@router.post("/products", response_model=FavoriteProductResponse)
def add_favorite_product(
    favorite: FavoriteProductBase,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        return favorite_service.add_favorite_product(db, current_user.id, favorite.product_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/products/{product_id}")
def remove_favorite_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    success = favorite_service.remove_favorite_product(db, current_user.id, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Product removed from favorites"}

@router.get("/products", response_model=List[FavoriteProductResponse])
def get_favorite_products(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    return favorite_service.get_favorite_products(db, current_user.id)

# Artist Favorites
@router.post("/artists", response_model=FavoriteArtistResponse)
def add_favorite_artist(
    favorite: FavoriteArtistBase,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    return favorite_service.add_favorite_artist(db, current_user.id, favorite.artist_id)

@router.delete("/artists/{artist_id}")
def remove_favorite_artist(
    artist_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    success = favorite_service.remove_favorite_artist(db, current_user.id, artist_id)
    if not success:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Artist removed from favorites"}

@router.get("/artists", response_model=List[FavoriteArtistResponse])
def get_favorite_artists(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    return favorite_service.get_favorite_artists(db, current_user.id)