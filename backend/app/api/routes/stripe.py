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

class CreatePaymentIntentRequest(BaseModel):
    order_id: int


@router.post("/create-payment-intent")
async def create_payment_intent(
    request: CreatePaymentIntentRequest,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Crea un PaymentIntent para cobrar al comprador.
    Automáticamente divide el dinero: comisión para la plataforma y monto al vendedor.
    """
    try:
        print(f"DEBUG: Iniciando create_payment_intent con order_id={request.order_id}, buyer_id={current_user.id}")
        client_secret = stripe_service.create_payment_intent(
            db, request.order_id, current_user.id
        )
        print(f"DEBUG: PaymentIntent creado exitosamente: {client_secret}")
        return {"clientSecret": client_secret}
    except ValueError as e:
        print(f"ValueError en create_payment_intent: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        import traceback
        error_msg = f"{type(e).__name__}: {str(e)}"
        traceback.print_exc()
        print(f"Error en create_payment_intent: {error_msg}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_msg)


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
