# Autor: Raúl Esteban Aniles Macias 222802
# Fecha: 13/11/2025
# Descripción: Maneja los endpoints de autenticación (registro y login). Contiene
# rutas que permiten crear usuarios y obtener tokens de acceso mediante OAuth2.

# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from utils.email import send_reset_email
from core.security import create_password_reset_token, verify_password_reset_token
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from core.database import get_db
from core.config import settings
from core.security import create_access_token
from schemas.user import Token, UserCreate, UserResponse
from services.user_service import UserService

router = APIRouter()
user_service = UserService()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Autor: Raúl Aniles 222802

    Descripción: Registra un nuevo usuario en el sistema.

    Parámetros:
        user (UserCreate): Datos para crear el usuario (username, email, password, etc.).
        db (Session): Sesión de la base de datos inyectada por Depends.

    Retorna:
        UserResponse: Objeto del usuario creado.

    """
    try:
        return user_service.create_user(db, user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Autor: Raúl Aniles 222802

    Descripción: Autentica a un usuario usando OAuth2 password flow y retorna un token.

    Parámetros:
        form_data (OAuth2PasswordRequestForm): Credenciales de inicio de sesión (username y password).
        db (Session): Sesión de la base de datos inyectada por Depends.

    Retorna:
        Token: Token de acceso y datos del usuario autenticado.

    """
    user = user_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# --- Paso 1: El usuario solicita el reseteo ---
@router.post("/forgot-password")
async def forgot_password(username: str, email: str, db: Session = Depends(get_db)):
    """
    Solicita el reseteo de contraseña.

    Ahora recibe `username` y `email`. Por seguridad la respuesta es siempre
    genérica (200 OK) para no filtrar si un correo o usuario existen.

    Flujo:
    - Se busca el usuario por email.
    - Si no existe, devolver mensaje genérico.
    - Si existe, verificar que el `username` proporcionado coincida con el
      usuario encontrado. Si no coinciden, devolver mensaje genérico.
    - Si coinciden, generar token y enviar el email con instrucciones.
    """

    user = user_service.get_user_by_email(db, email)

    # POR SEGURIDAD: Siempre responder con el mismo mensaje si no hay match
    generic_msg = {"msg": "Si el correo existe, se ha enviado un enlace."}

    if not user:
        return generic_msg

    # Verificar que el username coincida con el usuario encontrado
    if getattr(user, 'username', None) != username:
        return generic_msg

    # Generar token y enviar email
    token = create_password_reset_token(user.email)
    await send_reset_email(user.email, token)

    return generic_msg


# --- Paso 2: El usuario envía la nueva contraseña y el token ---
@router.post("/reset-password")
async def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    # 1. Validar el token
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    # 2. Obtener usuario
    user = user_service.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 3. Cambiar la contraseña (hashear de nuevo)
    # Aquí deberías tener un método en tu service para actualizar pass
    hashed_password = user_service.get_password_hash(new_password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()

    return {"msg": "Contraseña actualizada correctamente"}