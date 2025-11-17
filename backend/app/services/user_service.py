# Autor: Raúl Esteban Aniles Macias 222802
# Fecha: 13/11/2025
# Descripción: Servicio para gestión de usuarios: creación, autenticación,
# actualización y utilidades relacionadas con el modelo User.

from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from passlib.context import CryptContext
from schemas.user import UserCreate, UserUpdate
from models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    model = User
    def get_user_by_id(self, db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, db: Session, email: str):
        # Comparación case-insensitive para evitar colisiones por mayúsculas/minúsculas
        if not email:
            return None
        return db.query(User).filter(func.lower(User.email) == email.lower()).first()

    def get_user_by_username(self, db: Session, username: str):
        return db.query(User).filter(User.username == username).first()

    def create_user(self, db: Session, user: UserCreate):
        # Verificar si el usuario ya existe
        if self.get_user_by_email(db, user.email):
            raise ValueError("Email already registered")
        if self.get_user_by_username(db, user.username):
            raise ValueError("Username already taken")
        
        hashed_password = pwd_context.hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            bio=user.bio,
            address=user.address,
            phone=user.phone,
            rol=user.rol
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def update_user(self, db: Session, user_id: int, user_update: UserUpdate):
        db_user = self.get_user_by_id(db, user_id)
        if not db_user:
            return None
        
        update_data = user_update.model_dump(exclude_unset=True)
        # Validar correo único si se intenta cambiar
        if 'email' in update_data:
            new_email = update_data.get('email')
            if new_email and new_email.lower() != (db_user.email or '').lower():
                existing = self.get_user_by_email(db, new_email)
                if existing and existing.id != db_user.id:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo ya está en uso")
        
        # Si se actualiza la contraseña, hashearla
        if 'password' in update_data:
            update_data['hashed_password'] = pwd_context.hash(update_data.pop('password'))
        
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user

    def patch_user(self, db: Session, user_id: int, data: dict):
        """
        Aplica una actualización parcial usando un diccionario de campos.
        Realiza las validaciones necesarias (ej. email único) y aplica hashing de contraseña.
        """
        db_user = self.get_user_by_id(db, user_id)
        if not db_user:
            return None

        # Campos permitidos para patch
        allowed_fields = {"username", "full_name", "bio", "address", "phone", "password", "profile_picture", "email", "rol"}
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            return db_user

        # Validar correo único si se intenta cambiar
        if 'email' in update_data:
            new_email = update_data.get('email')
            if new_email and new_email.lower() != (db_user.email or '').lower():
                existing = self.get_user_by_email(db, new_email)
                if existing and existing.id != db_user.id:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo ya está en uso")

        # Validar username único si se intenta cambiar
        if 'username' in update_data:
            new_username = update_data.get('username')
            if new_username and new_username != db_user.username:
                existing_u = self.get_user_by_username(db, new_username)
                if existing_u:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de usuario ya está en uso")

        # Si se actualiza la contraseña, hashearla
        if 'password' in update_data:
            update_data['hashed_password'] = pwd_context.hash(update_data.pop('password'))

        # Aplicar cambios
        for field, value in update_data.items():
            setattr(db_user, field, value)

        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate_user(self, db: Session, email: str, password: str):
        user = self.get_user_by_email(db, email)
        if not user:
            return False
        if not pwd_context.verify(password, user.hashed_password):
            return False
        return user