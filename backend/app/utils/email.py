# Autor: Raúl Esteban Aniles Macias 222802
# Fecha: 13/11/2025
# Descripción: Utilidades para el envío de correos electrónicos,
# específicamente para la recuperación de contraseñas.

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from core.config import settings # Tu archivo de configuración

# Configuración de conexión (cárgala desde tus settings)
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_reset_email(email: EmailStr, token: str):
    # Esta URL apunta a tu FRONTEND (React), no al Backend
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    html = f"""
    <h1>Recuperación de contraseña</h1>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="{reset_link}">Restablecer Contraseña</a>
    <p>Este enlace expira en 15 minutos.</p>
    """

    message = MessageSchema(
        subject="Restablecer contraseña - Reborn",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)