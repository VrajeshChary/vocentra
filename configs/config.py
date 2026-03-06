import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Base paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    STORAGE_DIR: Path = BASE_DIR / "backend" / "storage"
    
    TEMP_DIR: Path = STORAGE_DIR / "temp"
    JOBS_DIR: Path = STORAGE_DIR / "jobs"
    RESULTS_DIR: Path = STORAGE_DIR / "results"
    LOGS_DIR: Path = BASE_DIR / "logs"
    
    # AI Engine Settings
    FRAME_EXTRACTION_INTERVAL_SEC: float = 2.0  # Extract 1 frame every X seconds
    MAX_UPLOAD_SIZE_MB: int = 50
    MAX_VIDEO_DURATION_SEC: int = 120 # 2 minutes
    # Model settings
    WHISPER_MODEL: str = "base"
    CLIP_MODEL: str = "openai/clip-vit-base-patch32"
    BLIP_MODEL: str = "Salesforce/blip-image-captioning-base"
    
    # Production Settings
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore"
    }




settings = Settings()

# Ensure directories exist
for path in [settings.TEMP_DIR, settings.JOBS_DIR, settings.RESULTS_DIR, settings.LOGS_DIR]:
    path.mkdir(parents=True, exist_ok=True)
