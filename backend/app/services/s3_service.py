import boto3
from botocore.exceptions import ClientError
from core.config import settings
import uuid
from datetime import datetime
import mimetypes
import logging

logger = logging.getLogger(__name__)


class S3Service:
    """
    Servicio para manejar uploads de archivos a AWS S3.
    """

    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION,
        )
        self.bucket_name = settings.AWS_S3_BUCKET_NAME
        self.region = settings.AWS_S3_REGION

    def upload_profile_picture(self, file_content: bytes, filename: str) -> str:
        """
        Sube una foto de perfil a S3.
        
        Args:
            file_content: Contenido del archivo en bytes
            filename: Nombre original del archivo
            
        Returns:
            URL pública de S3 del archivo subido
            
        Raises:
            ValueError: Si el archivo es inválido o hay error en S3
        """
        try:
            # Validar tipo de archivo
            allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
            file_ext = self._get_file_extension(filename)
            
            if not file_ext.startswith("."):
                file_ext = f".{file_ext}"
            
            if file_ext.lower() not in allowed_extensions:
                raise ValueError(
                    f"Tipo de archivo no permitido. Usa: {', '.join(allowed_extensions)}"
                )

            # Validar tamaño (máximo 5MB)
            max_size = 5 * 1024 * 1024  # 5MB
            if len(file_content) > max_size:
                raise ValueError("El archivo es demasiado grande. Máximo 5MB.")

            # Generar nombre único para el archivo
            unique_filename = self._generate_unique_filename(filename)
            s3_key = f"profile-picture/{unique_filename}"

            # Subir a S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=file_content,
                ContentType=self._get_content_type(filename),
                # ACL removido: usar configuración de bucket en su lugar
            )

            # Construir URL pública
            s3_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{s3_key}"

            logger.info(f"Foto de perfil subida exitosamente: {s3_url}")
            return s3_url

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            logger.error(f"Error de S3: {error_code} - {str(e)}")
            raise ValueError(f"Error al subir archivo a S3: {error_code}")

        except Exception as e:
            logger.error(f"Error inesperado al subir archivo: {str(e)}")
            raise ValueError(f"Error al subir archivo: {str(e)}")

    def delete_profile_picture(self, s3_url: str) -> bool:
        """
        Elimina una foto de perfil de S3.
        
        Args:
            s3_url: URL de S3 del archivo a eliminar
            
        Returns:
            True si fue eliminado, False si no existe o error
        """
        try:
            # Extraer la clave del archivo de la URL
            s3_key = self._extract_s3_key(s3_url)
            
            if not s3_key:
                logger.warning(f"No se pudo extraer clave S3 de: {s3_url}")
                return False

            # Si es la foto de perfil por defecto, no eliminar
            if "user.webp" in s3_url:
                return False

            # Eliminar del bucket
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=s3_key
            )

            logger.info(f"Foto de perfil eliminada: {s3_key}")
            return True

        except ClientError as e:
            logger.error(f"Error al eliminar archivo: {str(e)}")
            return False

        except Exception as e:
            logger.error(f"Error inesperado al eliminar archivo: {str(e)}")
            return False

    @staticmethod
    def _get_file_extension(filename: str) -> str:
        """Obtiene la extensión del archivo con punto incluido."""
        if "." in filename:
            ext = filename.rsplit(".", 1)[-1]
            return f".{ext}" if ext else ""
        return ""

    @staticmethod
    def _generate_unique_filename(filename: str) -> str:
        """Genera un nombre único para el archivo."""
        ext = filename.split(".")[-1] if "." in filename else "jpg"
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"{timestamp}_{unique_id}.{ext}"

    @staticmethod
    def _get_content_type(filename: str) -> str:
        """Obtiene el content-type del archivo."""
        content_type, _ = mimetypes.guess_type(filename)
        return content_type or "application/octet-stream"

    @staticmethod
    def _extract_s3_key(s3_url: str) -> str:
        """Extrae la clave S3 de una URL de S3."""
        try:
            # URL formato: https://bucket.s3.region.amazonaws.com/key
            parts = s3_url.split("/", 3)
            if len(parts) >= 4:
                return parts[3]
            return None
        except Exception:
            return None
