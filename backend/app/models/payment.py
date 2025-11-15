from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum
from datetime import datetime
from sqlalchemy.orm import relationship
from core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    stripe_payment_intent = Column(String, unique=True)
    stripe_session_id = Column(String, unique=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="usd")
    status = Column(Enum("pending", "succeeded", "failed", name="payment_status"), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    order = relationship("Order", back_populates="payment")