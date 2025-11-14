# app/services/cart_service.py
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.cartitem import CartItem
from models.product import Product

class CartService:
    def add_to_cart(self, db: Session, user_id: int, product_id: int, quantity: int = 1):
        # Verificar si el producto existe y tiene stock
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product or not product.is_available:
            raise ValueError("Product not available")
        
        if product.stock < quantity:
            raise ValueError("Insufficient stock")
        
        # Verificar si ya está en el carrito
        cart_item = db.query(CartItem).filter(
            and_(
                CartItem.user_id == user_id,
                CartItem.product_id == product_id
            )
        ).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
            db.add(cart_item)
        
        db.commit()
        db.refresh(cart_item)
        return cart_item

    def update_cart_item(self, db: Session, user_id: int, product_id: int, quantity: int):
        cart_item = db.query(CartItem).filter(
            and_(
                CartItem.user_id == user_id,
                CartItem.product_id == product_id
            )
        ).first()
        
        if not cart_item:
            return None
        
        if quantity <= 0:
            db.delete(cart_item)
            db.commit()
            return None
        
        # Verificar stock
        product = cart_item.product
        if product.stock < quantity:
            raise ValueError("Insufficient stock")
        
        cart_item.quantity = quantity
        db.commit()
        db.refresh(cart_item)
        return cart_item

    def remove_from_cart(self, db: Session, user_id: int, product_id: int):
        cart_item = db.query(CartItem).filter(
            and_(
                CartItem.user_id == user_id,
                CartItem.product_id == product_id
            )
        ).first()
        
        if cart_item:
            db.delete(cart_item)
            db.commit()
            return True
        return False

    def get_cart(self, db: Session, user_id: int):
        return db.query(CartItem).filter(CartItem.user_id == user_id).all()

    def clear_cart(self, db: Session, user_id: int):
        cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
        for item in cart_items:
            db.delete(item)
        db.commit()
        return True