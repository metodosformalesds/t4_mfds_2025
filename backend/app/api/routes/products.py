# app/api/routes/products.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from core.database import get_db
from api.dependencies import get_current_user
from schemas.product import ProductResponse, ProductCreate, ProductUpdate, ProductWithArtist
from schemas.user import UserResponse
from services.product_service import ProductService

router = APIRouter()
product_service = ProductService()

@router.get("/", response_model=List[ProductWithArtist])
def get_products(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = Query(None, description="Filter by category: 'producto' or 'material'"),
    db: Session = Depends(get_db)
):
    products = product_service.get_products(db, skip=skip, limit=limit, category=category)
    return products

@router.get("/my-products", response_model=List[ProductResponse])
def get_my_products(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    products = product_service.get_products(db, skip=skip, limit=limit, user_id=current_user.id)
    return products

@router.get("/{product_id}", response_model=ProductWithArtist)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = product_service.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Incrementar contador de vistas
    product_service.increment_view_count(db, product_id)
    
    return product

@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    return product_service.create_product(db, product, current_user.id)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    # Verificar que el producto pertenece al usuario
    product = product_service.get_product(db, product_id)
    if not product or product.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = product_service.update_product(db, product_id, product_update)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return updated_product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    # Verificar que el producto pertenece al usuario
    product = product_service.get_product(db, product_id)
    if not product or product.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Product not found")
    
    success = product_service.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}