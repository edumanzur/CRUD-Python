"""
Configurações da aplicação usando Pydantic Settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # Banco de Dados
    database_url: str = "postgresql://postgres:password@localhost:5432/rpg_db"
    
    # Ambiente
    app_env: str = "development"
    debug: bool = True
    
    # Segurança
    secret_key: str = "dev-secret-key-change-in-production"
    
    # Upload
    max_upload_size: int = 5242880  # 5MB
    allowed_image_types: str = "image/jpeg,image/png,image/webp"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


# Instância global de configurações
settings = Settings()
