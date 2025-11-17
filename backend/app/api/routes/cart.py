# Autor: Raúl Esteban Aniles Macias 222802
# Fecha: 13/11/2025
# Descripción: Endpoints para gestión del carrito de compras: obtener carrito,
# agregar, actualizar cantidades y eliminar items.

# app/api/routes/cart.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from api.dependencies import get_current_user
from schemas.cart import CartItemResponse, CartItemBase, CartUpdate
from schemas.user import UserResponse
from services.cart_service import CartService

router = APIRouter()
cart_service = CartService()

@router.get("/", response_model=List[CartItemResponse])
def get_cart(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Devuelve los items del carrito del usuario autenticado.

    Parámetros:
        db (Session): Sesión de la base de datos inyectada por Depends.
        current_user (UserResponse): Usuario autenticado inyectado por Depends.

    Retorna:
        List[CartItemResponse]: Lista de items en el carrito del usuario.

    """
    return cart_service.get_cart(db, current_user.id)

@router.post("/", response_model=CartItemResponse)
def add_to_cart(
    cart_item: CartItemBase,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Agrega un producto al carrito del usuario.

    Parámetros:
        cart_item (CartItemBase): Contiene `product_id` y `quantity` a agregar.
        db (Session): Sesión de la base de datos inyectada por Depends.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        CartItemResponse: Item agregado al carrito.

    """
    try:
        return cart_service.add_to_cart(db, current_user.id, cart_item.product_id, cart_item.quantity)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{product_id}", response_model=CartItemResponse)
def update_cart_item(
    product_id: int,
    cart_update: CartUpdate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Actualiza la cantidad de un item en el carrito.

    Parámetros:
        product_id (int): ID del producto en el carrito.
        cart_update (CartUpdate): Contiene la nueva `quantity`.
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        CartItemResponse: Item actualizado del carrito.

    """
    try:
        updated_item = cart_service.update_cart_item(db, current_user.id, product_id, cart_update.quantity)
        if not updated_item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        return updated_item
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{product_id}")
def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Elimina un item del carrito del usuario.

    Parámetros:
        product_id (int): ID del producto a eliminar.
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        dict: Mensaje indicando resultado de la operación.

    """
    success = cart_service.remove_from_cart(db, current_user.id, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@router.delete("/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Vacía el carrito del usuario autenticado.

    Parámetros:
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        dict: Mensaje indicando que el carrito fue limpiado.

    """
    cart_service.clear_cart(db, current_user.id)
    return {"message": "Cart cleared successfully"}