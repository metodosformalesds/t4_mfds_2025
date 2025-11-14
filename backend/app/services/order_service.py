# app/services/order_service.py
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import and_
import uuid
from models.order import Order
from models.orderproduct import OrderProduct as OrderItem
from models.product import Product
from schemas.order import OrderCreate

class OrderService:
    def generate_order_number(self):
        return f"ARTE-{uuid.uuid4().hex[:8].upper()}"

    def create_order(self, db: Session, order: OrderCreate, buyer_id: int):
        # Calcular totales y verificar stock
        total_amount = 0
        order_items = []
        seller_id = None
        
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product or product.stock < item.quantity:
                raise ValueError(f"Product {item.product_id} not available or insufficient stock")
            
            if seller_id is None:
                seller_id = product.user_id
            elif seller_id != product.user_id:
                raise ValueError("All products must be from the same seller")
            
            item_total = product.price * item.quantity
            total_amount += item_total
            
            order_items.append({
                'product': product,
                'quantity': item.quantity,
                'unit_price': float(product.price),
                'total_price': item_total
            })
        
        # Calcular comisiones
        platform_fee = total_amount * 0.05  # 5% para la plataforma
        seller_amount = total_amount - platform_fee
        
        # Crear orden
        db_order = Order(
            order_number=self.generate_order_number(),
            total_amount=total_amount,
            platform_fee=platform_fee,
            seller_amount=seller_amount,
            address=order.address,
            buyer_id=buyer_id,
            seller_id=seller_id
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        
        # Crear items de la orden
        for item_data in order_items:
            db_item = OrderItem(
                order_id=db_order.id,
                product_id=item_data['product'].id,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['total_price']
            )
            db.add(db_item)
            
            # Actualizar stock
            item_data['product'].stock -= item_data['quantity']
        
        db.commit()
        db.refresh(db_order)
        return db_order

    def get_order(self, db: Session, order_id: int):
        return db.query(Order).filter(Order.id == order_id).first()

    def get_user_orders(self, db: Session, user_id: int, role: str = "buyer"):
        if role == "buyer":
            return db.query(Order).filter(Order.buyer_id == user_id).all()
        else:
            return db.query(Order).filter(Order.seller_id == user_id).all()

    def update_order_status(self, db: Session, order_id: int, status: str):
        db_order = self.get_order(db, order_id)
        if not db_order:
            return None
        
        db_order.status = status
        db.commit()
        db.refresh(db_order)
        return db_order