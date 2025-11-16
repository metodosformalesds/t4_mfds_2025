# app/services/stripe_service.py
from sqlalchemy.orm import Session
import stripe
from core.config import settings
from models.user import User
from models.order import Order
from models.payment import Payment
from models.product import Product
from datetime import datetime

# Configurar stripe con la clave secreta (NO la pública)
stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeService:
    """
    Servicio para manejar todas las integraciones con Stripe Connect.
    """

    # ==================== ONBOARDING VENDEDOR ====================

    def create_connected_account(
        self, db: Session, user_id: int, email: str, country: str = "MX"
    ) -> str:
        """
        Crea una cuenta conectada Express en Stripe para un vendedor.
        Devuelve el account_id.
        """
        # Verificar que el usuario existe
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Usuario no encontrado")

        # Verificar que el usuario no tiene ya una cuenta conectada
        if user.stripe_account_id:
            raise ValueError("El usuario ya tiene una cuenta conectada")

        try:
            # Crear cuenta Express en Stripe
            account = stripe.Account.create(
                type="express",
                country=country,
                email=email,
                capabilities={
                    "card_payments": {"requested": True},
                    "transfers": {"requested": True},
                },
            )

            # Guardar el account_id en la base de datos
            user.stripe_account_id = account.id
            user.stripe_status = "pending"  # En espera de onboarding completo
            db.commit()

            return account.id

        except Exception as e:
            raise ValueError(f"Error de Stripe: {str(e)}")

    def create_account_link(self, db: Session, user_id: int) -> str:
        """
        Crea un enlace de onboarding para que el vendedor complete su información.
        Devuelve la URL donde debe ir el usuario.
        """
        # Verificar que el usuario existe
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Usuario no encontrado")

        # Verificar que tiene una cuenta conectada
        if not user.stripe_account_id:
            raise ValueError("El usuario no tiene una cuenta conectada. Crea una primero.")

        try:
            # Crear el enlace de onboarding
            account_link = stripe.AccountLink.create(
                account=user.stripe_account_id,
                refresh_url="https://tu-sitio.com/stripe/reauth",  # TODO: Cambiar URL
                return_url="https://tu-sitio.com/seller-dashboard",  # TODO: Cambiar URL
                type="account_onboarding",
            )

            return account_link.url

        except Exception as e:
            raise ValueError(f"Error de Stripe: {str(e)}")

    def verify_and_update_stripe_status(self, db: Session, user_id: int) -> dict:
        """
        Verifica el estado de la cuenta conectada en Stripe y actualiza el stripe_status del usuario.
        Devuelve el estado actual de la cuenta.
        """
        # Verificar que el usuario existe
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Usuario no encontrado")

        # Verificar que tiene una cuenta conectada
        if not user.stripe_account_id:
            raise ValueError("El usuario no tiene una cuenta conectada.")

        try:
            # Obtener la información de la cuenta en Stripe
            account = stripe.Account.retrieve(user.stripe_account_id)

            # Verificar si el onboarding está completo
            charges_enabled = account.get("charges_enabled", False)
            payouts_enabled = account.get("payouts_enabled", False)
            requirements = account.get("requirements", {})
            currently_due = requirements.get("currently_due", [])
            eventually_due = requirements.get("eventually_due", [])

            # Determinar el estado
            if charges_enabled and payouts_enabled and not currently_due:
                new_status = "active"
            elif currently_due:
                new_status = "pending_requirements"
            elif account.get("charges_pending_review"):
                new_status = "under_review"
            else:
                new_status = "pending"

            # Actualizar el stripe_status si cambió
            user.stripe_status = new_status
            db.commit()

            return {
                "stripe_status": new_status,
                "charges_enabled": charges_enabled,
                "payouts_enabled": payouts_enabled,
                "requirements": {
                    "currently_due": currently_due,
                    "eventually_due": eventually_due,
                },
            }

        except Exception as e:
            raise ValueError(f"Error de Stripe: {str(e)}")

    # ==================== PAGOS ====================

    def create_checkout_session(
        self, db: Session, order_id: int, buyer_id: int, success_url: str, cancel_url: str
    ) -> str:
        """
        Crea una Checkout Session para una orden.
        Devuelve la URL de checkout para redirigir al usuario.
        """
        try:
            # Verificar que la orden existe
            print(f"DEBUG: Buscando orden con id={order_id}")
            order = db.query(Order).filter(Order.id == order_id).first()
            if not order:
                raise ValueError("Orden no encontrada")
            
            # Verificar que el comprador es el que está haciendo la solicitud
            if order.buyer_id != buyer_id:
                raise ValueError("No tienes permiso para pagar esta orden")

            # Verificar que el vendedor existe
            seller = db.query(User).filter(User.id == order.seller_id).first()
            if not seller:
                raise ValueError("Vendedor no encontrado")

            # Convertir el monto total a centavos
            total_amount_cents = int(float(order.total_amount) * 100)
            
            # Validar monto mínimo
            min_amount_cents = 1000
            if total_amount_cents < min_amount_cents:
                raise ValueError(f"El monto mínimo para un pago es $10 MXN")

            # Calcular la comisión
            application_fee_cents = int(total_amount_cents * 0.05)

            # Si no hay cuenta real en stripe
            line_items = [{
                'price_data': {
                    'currency': 'mxn',
                    'product_data': {
                        'name': f'Orden #{order.id} - Reborn',
                        'description': f'Compra de {len(order.items)} artículos',
                    },
                    'unit_amount': total_amount_cents,
                },
                'quantity': 1,
            }]

            checkout_params = {
                'line_items': line_items,
                'mode': 'payment',
                'success_url': success_url,
                'cancel_url': cancel_url,
                'client_reference_id': str(order_id),
                'metadata': {
                    'order_id': order_id,
                    'buyer_id': buyer_id,
                },
                'payment_intent_data': {} if not seller.stripe_account_id else {
                    'application_fee_amount': application_fee_cents,
                    'transfer_data': {'destination': seller.stripe_account_id},
                }
            }

            # Crear la Checkout Session
            print(f"DEBUG: Creando Checkout Session en Stripe...")
            checkout_session = stripe.checkout.Session.create(**checkout_params)
            
            print(f"DEBUG: Checkout Session creada: {checkout_session.id}")
            
            # Guardar el session_id en la orden
            order.stripe_checkout_session_id = checkout_session.id
            db.commit()

            return checkout_session.url

        except Exception as e:
            print(f"Error creando Checkout Session: {str(e)}")
            raise ValueError(f"Error de Stripe: {str(e)}")

    # ==================== WEBHOOKS ====================

    def construct_webhook_event(self, payload: bytes, sig_header: str):
        """
        Construye y verifica el evento webhook de Stripe.
        """
        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=sig_header,
                secret=settings.STRIPE_WEBHOOK_SECRET,
            )
            return event
        except ValueError as e:
            raise ValueError("Payload inválido")
        except Exception as e:
            raise Exception("Firma inválida")

    def handle_payment_succeeded(self, db: Session, payment_intent: dict):
        """
        Maneja el evento cuando un pago es exitoso.
        Actualiza la orden como "pagada" y registra el pago.
        """
        try:
            # Obtener los metadata del PaymentIntent
            order_id = payment_intent.get("metadata", {}).get("order_id")
            if not order_id:
                return  # No podemos asociar este pago a una orden

            # Buscar la orden
            order = db.query(Order).filter(Order.id == int(order_id)).first()
            if not order:
                return

            # Marcar la orden como pagada
            order.status = "paid"
            order.paid_at = datetime.utcnow()
            order.stripe_payment_intent_id = payment_intent["id"]

            # Registrar el pago en la tabla de pagos
            payment = Payment(
                order_id=order.id,
                stripe_payment_intent=payment_intent["id"],
                amount=float(payment_intent["amount"]) / 100,  # Convertir de centavos
                currency=payment_intent["currency"],
                status="succeeded",
            )
            db.add(payment)
            db.commit()

            # TODO: Enviar notificaciones por email
            # TODO: Crear notificaciones para el vendedor

        except Exception as e:
            print(f"Error procesando pago exitoso: {str(e)}")

    def handle_payment_failed(self, db: Session, payment_intent: dict):
        """
        Maneja el evento cuando un pago falla.
        Actualiza la orden como "falló el pago".
        """
        try:
            order_id = payment_intent.get("metadata", {}).get("order_id")
            if not order_id:
                return

            order = db.query(Order).filter(Order.id == int(order_id)).first()
            if not order:
                return

            # Marcar la orden como fallida
            order.status = "payment_failed"

            # Registrar el pago fallido
            payment = Payment(
                order_id=order.id,
                stripe_payment_intent=payment_intent["id"],
                amount=float(payment_intent["amount"]) / 100,
                currency=payment_intent["currency"],
                status="failed",
            )
            db.add(payment)
            db.commit()

            # TODO: Enviar notificación al comprador

        except Exception as e:
            print(f"Error procesando pago fallido: {str(e)}")