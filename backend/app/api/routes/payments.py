# app/api/routes/payments.py
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from core.database import get_db
from api.dependencies import get_current_user
from schemas.payment import PaymentIntentCreate, PaymentIntentResponse
from schemas.user import UserResponse
from services.payment_service import PaymentService

router = APIRouter()
payment_service = PaymentService()

@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
def create_payment_intent(
    payment_data: PaymentIntentCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        result = payment_service.create_payment_intent(db, payment_data.order_id, current_user.id)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        result = payment_service.handle_webhook(db, payload, sig_header)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )