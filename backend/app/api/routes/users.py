# Autor: Raúl Esteban Aniles Macias 222802
# Fecha: 13/11/2025
# Descripción: Endpoints para obtener y modificar datos de usuario (perfil,
# actualización parcial y subida de foto de perfil a S3).

# app/api/routes/users.py
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from sqlalchemy.orm import Session
from core.database import get_db
from api.dependencies import get_current_user
from schemas.user import UserResponse, UserUpdate
from services.user_service import UserService
from services.s3_service import S3Service
from typing import Optional

router = APIRouter()
user_service = UserService()
s3_service = S3Service()

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    """
    Autor: Raúl Aniles 222802

    Descripción: Devuelve los datos del usuario autenticado.

    Parámetros:
        current_user (UserResponse): Usuario autenticado inyectado por Depends.

    Retorna:
        UserResponse: Datos del usuario autenticado.

    """
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
    username: Optional[str] = Form(None),
    full_name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Actualiza el perfil del usuario actual. Soporta multipart/form-data para subir una nueva foto
    de perfil a S3 y actualizar campos de texto y contraseña.

    Parámetros:
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.
        username, full_name, bio, address, phone, password: Campos opcionales enviados vía Form.
        profile_picture (UploadFile): Archivo de imagen opcional para la foto de perfil.

    Retorna:
        UserResponse: Usuario actualizado.

    """
    try:
        # Procesar la foto de perfil si se proporciona
        profile_picture_url = None
        if profile_picture:
            # Validar que sea una imagen
            if not profile_picture.content_type.startswith("image/"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El archivo debe ser una imagen"
                )

            # Leer contenido del archivo
            file_content = await profile_picture.read()
            
            try:
                # Subir la nueva foto a S3
                profile_picture_url = s3_service.upload_profile_picture(
                    file_content, 
                    profile_picture.filename
                )
                
                # Eliminar la foto anterior si no es la por defecto
                if current_user.profile_picture and "user.webp" not in current_user.profile_picture:
                    s3_service.delete_profile_picture(current_user.profile_picture)
                    
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(e)
                )

        # Crear objeto UserUpdate con los datos
        user_update_data = {
            "username": username,
            "full_name": full_name,
            "bio": bio,
            "address": address,
            "phone": phone,
            "password": password,
        }
        
        # Agregar URL de foto si se subió
        if profile_picture_url:
            user_update_data["profile_picture"] = profile_picture_url

        # Filtrar valores None
        user_update_dict = {k: v for k, v in user_update_data.items() if v is not None}
        
        user_update = UserUpdate(**user_update_dict) if user_update_dict else UserUpdate()

        # Actualizar usuario
        updated_user = user_service.update_user(db, current_user.id, user_update)
        if not updated_user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return updated_user

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar perfil: {str(e)}"
        )


@router.patch("/me", response_model=UserResponse)
async def patch_user_me(
    request: Request,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Autor: Raúl Aniles 222802

    Descripción: Actualización parcial del perfil vía JSON (application/json). No acepta archivos; para
    cambios en la foto de perfil use el endpoint `PUT /api/users/me` con multipart/form-data.

    Parámetros:
        request (Request): Request con el JSON que contiene los campos a actualizar.
        db (Session): Sesión de la base de datos.
        current_user (UserResponse): Usuario autenticado.

    Retorna:
        UserResponse: Usuario actualizado.

    """
    try:
        # Esperar JSON
        body = await request.json()

        # Filtrar solo campos válidos para UserUpdate
        allowed_fields = {"username", "full_name", "bio", "address", "phone", "password", "profile_picture", "email"}
        update_data = {k: v for k, v in body.items() if k in allowed_fields}

        if not update_data:
            raise HTTPException(status_code=400, detail="No se enviaron campos válidos para actualizar")

        # Delegar la lógica de patch al servicio
        updated_user = user_service.patch_user(db, current_user.id, update_data)

        if not updated_user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return updated_user

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar perfil (patch): {str(e)}"
        )

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user