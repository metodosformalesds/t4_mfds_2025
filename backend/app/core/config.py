# app/core/config.py
from pydantic_settings import BaseSettings
from pydantic import model_validator  # Importa el validador
from typing import Optional

class Settings(BaseSettings):
    
    # --- 1. Define las PARTES como requeridas ---
    DB_HOST: str
    DB_PORT: int = 5432
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    
    # --- 2. Define la URL como OPCIONAL ---
    # (Será None al principio, pero la construiremos)
    DATABASE_URL: Optional[str] = None

    # --- 3. Usa un validador para construir la URL ---
    @model_validator(mode='after') # Se ejecuta 'después' de cargar las otras variables
    def build_database_url(self) -> 'Settings':
        # Si la DATABASE_URL no fue provista manualmente...
        if self.DATABASE_URL is None:
            # ...la construimos usando las otras variables
            self.DATABASE_URL = (
                f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}"
                f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            )
        
        # Devuelve la instancia de 'settings' ya modificada
        return self
    
    # JWT Configuration
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Alias properties for backward compatibility
    @property
    def SECRET_KEY(self) -> str:
        return self.JWT_SECRET_KEY
    
    @property
    def ALGORITHM(self) -> str:
        return self.JWT_ALGORITHM

    # AWS Configuration
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_S3_BUCKET_NAME: str
    AWS_S3_REGION: str = "us-east-1"

    # Stripe Configuration
    #STRIPE_API_KEY: str
    #STRIPE_WEBHOOK_SECRET: str
    
    # Alias property for backward compatibility
    #@property
    #def STRIPE_SECRET_KEY(self) -> str:
    #    return self.STRIPE_API_KEY

    class Config:
        # La ruta al .env (ten cuidado con rutas relativas como '../..')
        # Es más seguro usar una ruta absoluta o cargarla de otra forma
        env_file = "../.env" 
        env_file_encoding = 'utf-8'


# Esta línea AHORA funciona.
# Pydantic cargará DB_HOST, DB_USER, etc., y luego
# el @model_validator creará la DATABASE_URL.
settings = Settings()