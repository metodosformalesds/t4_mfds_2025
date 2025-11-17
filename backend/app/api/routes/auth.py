# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
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