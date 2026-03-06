import os
import shutil
import hashlib
import time
from pathlib import Path
from configs.config import settings
from backend.utils.logger import logger

class FileManager:
    @staticmethod
    def get_file_hash(file_path: str) -> str:
        hasher = hashlib.md5()
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    @staticmethod
    def cleanup_old_files(max_age_minutes: int = 30):
        now = time.time()
        max_age_seconds = max_age_minutes * 60

        # Clean temp storage
        for item in settings.TEMP_DIR.iterdir():
            try:
                if now - item.stat().st_mtime > max_age_seconds:
                    if item.is_dir():
                        shutil.rmtree(item)
                    else:
                        item.unlink()
                    logger.info(f"Cleaned up old storage item: {item.name}")
            except Exception as e:
                logger.error(f"Failed to clean {item}: {e}")

    @staticmethod
    def ensure_dir(path: Path):
        path.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def move_to_job_storage(source: Path, job_id: str, filename: str) -> Path:
        job_dir = settings.JOBS_DIR / job_id
        job_dir.mkdir(parents=True, exist_ok=True)
        dest = job_dir / filename
        shutil.move(str(source), str(dest))
        return dest
