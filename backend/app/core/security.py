# Autor: Raúl Esteban Aniles Macias 222802
# Fecha: 13/11/2025
# Descripción: Funciones para crear y verificar tokens JWT, incluyendo
# tokens de acceso y de restablecimiento de contraseña.

from datetime import datetime, timedelta
from jose import jwt
from .config import settings

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_password_reset_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=15) # Expira rápido
    to_encode = {"exp": expire, "sub": email, "type": "reset"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_password_reset_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "reset":
            return None
        return payload.get("sub") # Devuelve el email
    except Exception:
        return None