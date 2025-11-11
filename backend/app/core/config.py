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
    
    class Config:
        # La ruta al .env (ten cuidado con rutas relativas como '../..')
        # Es más seguro usar una ruta absoluta o cargarla de otra forma
        env_file = "../.env" 
        env_file_encoding = 'utf-8'


# Esta línea AHORA funciona.
# Pydantic cargará DB_HOST, DB_USER, etc., y luego
# el @model_validator creará la DATABASE_URL.
settings = Settings()