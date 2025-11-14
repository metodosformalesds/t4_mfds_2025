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
    return cart_service.get_cart(db, current_user.id)

@router.post("/", response_model=CartItemResponse)
def add_to_cart(
    cart_item: CartItemBase,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
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
    success = cart_service.remove_from_cart(db, current_user.id, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@router.delete("/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    cart_service.clear_cart(db, current_user.id)
    return {"message": "Cart cleared successfully"}