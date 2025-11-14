# app/services/payment_service.py
import stripe
from sqlalchemy.orm import Session
from sqlalchemy import func
from core.config import settings
from models.payment import Payment
from models.order import Order
from models.user import User

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentService:
    def create_payment_intent(self, db: Session, order_id: int, buyer_id: int):
        # Obtener la orden
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise ValueError("Order not found")
        
        # Verificar que el comprador es el dueño de la orden
        if order.buyer_id != buyer_id:
            raise ValueError("Not authorized to pay for this order")
        
        # Verificar que la orden no esté ya pagada
        if order.status != "pending":
            raise ValueError("Order already processed")
        
        # Crear Payment Intent en Stripe (en centavos)
        amount_cents = int(order.total_amount * 100)
        
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='mxn',
                automatic_payment_methods={'enabled': True},
                metadata={
                    'order_id': order.id,
                    'buyer_id': buyer_id,
                    'seller_id': order.seller_id
                }
            )
            
            # Crear registro de pago
            payment = Payment(
                order_id=order_id,
                stripe_payment_intent=intent.id,
                amount=order.total_amount,
                currency="mxn",
                status="pending"
            )
            
            db.add(payment)
            db.commit()
            db.refresh(payment)
            
            return {
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id
            }
            
        except stripe.error.StripeError as e:
            raise ValueError(f"Stripe error: {str(e)}")

    async def handle_webhook(self, db: Session, payload: bytes, sig_header: str):
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            raise ValueError("Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            raise ValueError("Invalid signature")

        # Manejar diferentes tipos de eventos
        if event['type'] == 'payment_intent.succeeded':
            await self.handle_payment_succeeded(db, event['data']['object'])
        elif event['type'] == 'payment_intent.payment_failed':
            await self.handle_payment_failed(db, event['data']['object'])
        
        return {"status": "success"}

    async def handle_payment_succeeded(self, db: Session, payment_intent):
        # Actualizar pago en nuestra base de datos
        payment = db.query(Payment).filter(
            Payment.stripe_payment_intent == payment_intent['id']
        ).first()
        
        if payment:
            payment.status = "succeeded"
            
            # Actualizar orden
            order = payment.order
            order.status = "confirmed"
            order.paid_at = func.now()
            
            # Transferir fondos al vendedor (5% de comisión para la plataforma)
            seller = order.seller
            if seller.stripe_account_id:
                try:
                    transfer_amount = int(order.seller_amount * 100)  # En centavos
                    
                    transfer = stripe.Transfer.create(
                        amount=transfer_amount,
                        currency="mxn",
                        destination=seller.stripe_account_id,
                        transfer_group=order.order_number,
                        metadata={
                            'order_id': order.id,
                            'platform_fee': order.platform_fee
                        }
                    )
                    
                    # Guardar ID de transferencia si es necesario
                    # payment.stripe_transfer_id = transfer.id
                    
                except stripe.error.StripeError as e:
                    # Log the error but don't fail the payment
                    print(f"Transfer failed: {str(e)}")
            
            db.commit()

    async def handle_payment_failed(self, db: Session, payment_intent):
        payment = db.query(Payment).filter(
            Payment.stripe_payment_intent == payment_intent['id']
        ).first()
        
        if payment:
            payment.status = "failed"
            db.commit()