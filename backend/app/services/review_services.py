# app/services/review_service.py
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.review import Review
from models.order import Order
from models.orderproduct import OrderProduct as OrderItem
from schemas.review import ReviewCreate

class ReviewService:
    def create_review(self, db: Session, review: ReviewCreate, reviewer_id: int):
        # Verificar que el usuario compró el producto
        order = db.query(Order).filter(
            and_(
                Order.id == review.order_id,
                Order.buyer_id == reviewer_id
            )
        ).first()
        
        if not order:
            raise ValueError("Order not found or you are not the buyer")
        
        # Verificar que el producto está en la orden
        order_item = db.query(OrderItem).filter(
            and_(
                OrderItem.order_id == review.order_id,
                OrderItem.product_id == review.product_id
            )
        ).first()
        
        if not order_item:
            raise ValueError("Product not found in this order")
        
        # Verificar que no existe ya una reseña para este producto en esta orden
        existing_review = db.query(Review).filter(
            and_(
                Review.order_id == review.order_id,
                Review.product_id == review.product_id
            )
        ).first()
        
        if existing_review:
            raise ValueError("You have already reviewed this product from this order")
        
        # Obtener el vendedor del producto
        product = order_item.product
        
        # Crear reseña
        db_review = Review(
            **review.model_dump(),
            reviewer_id=reviewer_id,
            seller_id=product.user_id,
            is_verified_purchase=True
        )
        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        
        # Actualizar rating promedio del producto
        self.update_product_rating(db, review.product_id)
        
        return db_review

    def get_product_reviews(self, db: Session, product_id: int):
        return db.query(Review).filter(Review.product_id == product_id).all()

    def get_user_reviews(self, db: Session, user_id: int, role: str = "reviewer"):
        if role == "reviewer":
            return db.query(Review).filter(Review.reviewer_id == user_id).all()
        else:
            return db.query(Review).filter(Review.seller_id == user_id).all()

    def update_product_rating(self, db: Session, product_id: int):
        from models.product import Product
        from sqlalchemy import func
        
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            # Calcular nuevo promedio
            result = db.query(
                func.count(Review.id).label('count'),
                func.avg(Review.rating).label('average')
            ).filter(Review.product_id == product_id).first()
            
            product.review_count = result.count
            product.average_rating = float(result.average) if result.average else 0.0
            db.commit()