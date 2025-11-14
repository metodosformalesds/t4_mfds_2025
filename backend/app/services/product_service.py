# app/services/product_service.py
from sqlalchemy.orm import Session
from typing import List, Optional
from models.product import Product
from schemas.product import ProductCreate, ProductUpdate

class ProductService:
    def get_product(self, db: Session, product_id: int):
        return db.query(Product).filter(Product.id == product_id).first()

    def get_products(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 50,
        category: Optional[str] = None,
        user_id: Optional[int] = None
    ):
        query = db.query(Product).filter(Product.is_available == True)
        
        if category:
            query = query.filter(Product.category == category)
        if user_id:
            query = query.filter(Product.user_id == user_id)
            
        return query.offset(skip).limit(limit).all()

    def create_product(self, db: Session, product: ProductCreate, user_id: int):
        db_product = Product(
            **product.model_dump(),
            user_id=user_id
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    def update_product(self, db: Session, product_id: int, product_update: ProductUpdate):
        db_product = self.get_product(db, product_id)
        if not db_product:
            return None
        
        update_data = product_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        
        db.commit()
        db.refresh(db_product)
        return db_product

    def increment_view_count(self, db: Session, product_id: int):
        db_product = self.get_product(db, product_id)
        if db_product:
            db_product.view_count += 1
            db.commit()

    def delete_product(self, db: Session, product_id: int):
        # Esta función se mantiene aquí pero NO se usa en las rutas
        # Se puede eliminar en futuro si no es necesaria en otros módulos
        pass