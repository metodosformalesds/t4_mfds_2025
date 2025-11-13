# app/api/routes/orders.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from api.dependencies import get_current_user
from schemas.order import OrderResponse, OrderCreate, OrderUpdate
from schemas.user import UserResponse
from services.order_service import OrderService

router = APIRouter()
order_service = OrderService()

@router.post("/", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        return order_service.create_order(db, order, current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[OrderResponse])
def get_my_orders(
    role: str = Query("buyer", description="Role: 'buyer' or 'seller'"),
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    orders = order_service.get_user_orders(db, current_user.id, role)
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    order = order_service.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verificar que el usuario es el comprador o vendedor
    if order.buyer_id != current_user.id and order.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    return order

@router.put("/{order_id}", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    order_update: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    order = order_service.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Solo el vendedor puede actualizar el estado
    if order.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this order")
    
    updated_order = order_service.update_order_status(db, order_id, order_update.status)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return updated_order