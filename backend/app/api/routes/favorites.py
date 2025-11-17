# Autor: Raúl Esteban Aniles Macias 222802
# Fecha: 13/11/2025
# Descripción: Rutas para administrar favoritos de usuarios (productos y artistas).

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
    """
    Autor: Raúl Aniles 222802

    Descripción: Añade un producto a la lista de favoritos del usuario.

    Parámetros:
        favorite (FavoriteProductBase): Contiene `product_id`.
        db (Session): Sesión de base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        FavoriteProductResponse: Registro creado de favorito.

    """
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
    """
    Autor: Raúl Aniles 222802

    Descripción: Elimina un producto de los favoritos del usuario.

    Parámetros:
        product_id (int): ID del producto a eliminar.
        db (Session): Sesión de base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        dict: Mensaje indicando resultado.

    """
    success = favorite_service.remove_favorite_product(db, current_user.id, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Product removed from favorites"}

@router.get("/products", response_model=List[FavoriteProductResponse])
def get_favorite_products(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Obtiene la lista de productos favoritos del usuario.

    Parámetros:
        db (Session): Sesión de base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        List[FavoriteProductResponse]: Lista de favoritos.

    """
    return favorite_service.get_favorite_products(db, current_user.id)

# Artist Favorites
@router.post("/artists", response_model=FavoriteArtistResponse)
def add_favorite_artist(
    favorite: FavoriteArtistBase,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Añade un artista a la lista de favoritos del usuario.

    Parámetros:
        favorite (FavoriteArtistBase): Contiene `artist_id`.
        db (Session): Sesión de base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        FavoriteArtistResponse: Registro creado de favorito.

    """
    return favorite_service.add_favorite_artist(db, current_user.id, favorite.artist_id)

@router.delete("/artists/{artist_id}")
def remove_favorite_artist(
    artist_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Elimina un artista de los favoritos del usuario.

    Parámetros:
        artist_id (int): ID del artista a eliminar.
        db (Session): Sesión de base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        dict: Mensaje indicando resultado.

    """
    success = favorite_service.remove_favorite_artist(db, current_user.id, artist_id)
    if not success:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Artist removed from favorites"}

@router.get("/artists", response_model=List[FavoriteArtistResponse])
def get_favorite_artists(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Obtiene la lista de artistas favoritos del usuario.

    Parámetros:
        db (Session): Sesión de base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        List[FavoriteArtistResponse]: Lista de artistas favoritos.

    """
    return favorite_service.get_favorite_artists(db, current_user.id)