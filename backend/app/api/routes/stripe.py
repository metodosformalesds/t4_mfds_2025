# app/api/routes/stripe.py
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session
from core.database import get_db
from api.dependencies import get_current_user
from schemas.user import UserResponse
from services.stripe_service import StripeService
from pydantic import BaseModel
from typing import Optional

router = APIRouter()
stripe_service = StripeService()


# ==================== ONBOARDING VENDEDOR ====================

class CreateConnectedAccountRequest(BaseModel):
    country: str = "MX"


@router.post("/create-connected-account")
async def create_connected_account(
    request: CreateConnectedAccountRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Crea una cuenta conectada de Stripe (Express) para el vendedor.
    El vendedor debe estar autenticado.
    """
    try:
        account_id = stripe_service.create_connected_account(
            db, current_user.id, current_user.email, request.country
        )
        return {"account_id": account_id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/create-account-link")
async def create_account_link(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Crea el enlace de onboarding para que el vendedor complete su información.
    """
    try:
        url = stripe_service.create_account_link(db, current_user.id)
        return {"url": url}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/verify-account-status")
async def verify_account_status(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Verifica el estado actual de la cuenta conectada en Stripe.
    Actualiza automáticamente el stripe_status del usuario basado en el estado en Stripe.
    """
    try:
        status_info = stripe_service.verify_and_update_stripe_status(db, current_user.id)
        return status_info
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ==================== PAGOS ====================

class CreateCheckoutSessionRequest(BaseModel):
    order_id: int
    success_url: str
    cancel_url: str

@router.post("/create-checkout-session")
async def create_checkout_session(
    request: CreateCheckoutSessionRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Crea una Checkout Session para redirigir al usuario a Stripe Checkout
    """
    try:
        checkout_url = stripe_service.create_checkout_session(
            db=db,
            order_id=request.order_id,
            buyer_id=current_user.id,
            success_url=request.success_url,
            cancel_url=request.cancel_url
        )
        return {"checkoutUrl": checkout_url}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ==================== WEBHOOKS ====================

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
    db: Session = Depends(get_db),
):
    """
    Recibe notificaciones de Stripe.
    Se ejecuta cuando un pago es exitoso, fallido, etc.
    """
    payload = await request.body()
    
    try:
        event = stripe_service.construct_webhook_event(payload, stripe_signature)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Payload inválido")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Firma inválida")

    # Manejar diferentes eventos
    if event["type"] == "payment_intent.succeeded":
        stripe_service.handle_payment_succeeded(db, event["data"]["object"])
    elif event["type"] == "payment_intent.payment_failed":
        stripe_service.handle_payment_failed(db, event["data"]["object"])

    return {"status": "success"}