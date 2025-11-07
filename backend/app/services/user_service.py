from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from passlib.context import CryptContext
from schemas.user import UserCreate
from models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:

    def get_password_hash(self, password: str) -> str:
        if len(password.encode("utf-8")) > 72:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La contraseña no puede tener más de 72 caracteres."
            )
        return pwd_context.hash(password)


    def get_user_by_email(self, db: Session, email: str) -> User | None:
        """Busca un usuario por su email."""
        return db.query(User).filter(User.email == email).first()

    def get_user_by_username(self, db: Session, username: str) -> User | None:
        """Busca un usuario por su username."""
        return db.query(User).filter(User.username == username).first()

    def get_user_by_id(self, db: Session, id: str) -> User | None:
        """Busca un usuario por su id."""
        return db.query(User).filter(User.id == id).first()
    
    def create_user(self, db: Session, user_data: UserCreate) -> User:
        """
        El núcleo de tu lógica de negocio para registrar un usuario.
        """

        if self.get_user_by_email(db, email=user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado."
            )
        
        if self.get_user_by_username(db, username=user_data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario ya está en uso."
            )

        hashed_password = self.get_password_hash(user_data.password)

        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,  # Se usa la versión hasheada
            phone=user_data.phone,
            birthdate=user_data.birthdate
            # El 'Role' tomará su valor por defecto ("customer")
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)  # Refresca para obtener el ID asignado por la BD

        return db_user

user_service = UserService()