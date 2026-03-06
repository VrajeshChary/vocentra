import uuid
import json
import time
from typing import Dict, Optional
from configs.config import settings
from backend.utils.logger import logger
from backend.utils.file_manager import FileManager

class JobManager:

    # job_id -> {status, start_time, result_path, error}
    _jobs: Dict[str, dict] = {}
    # file_hash -> job_id (Duplicate prevention)
    _hashes: Dict[str, str] = {}

    def __init__(self):
        self._load_jobs()

    def _get_job_path(self, job_id: str):
        return settings.JOBS_DIR / f"{job_id}.json"

    def _save_job(self, job_id: str):
        path = self._get_job_path(job_id)
        with open(path, "w") as f:
            json.dump(self._jobs[job_id], f, indent=4)

    def _load_jobs(self):
        """Loads all previous job metadata from disk."""
        if not settings.JOBS_DIR.exists():
            settings.JOBS_DIR.mkdir(parents=True, exist_ok=True)
            return

        for job_file in settings.JOBS_DIR.glob("*.json"):
            try:
                with open(job_file, "r") as f:
                    data = json.load(f)
                    job_id = job_file.stem
                    self._jobs[job_id] = data
                    # Reconstruct hash mapping if present
                    file_hash = data.get("file_hash")
                    if file_hash:
                        self._hashes[file_hash] = job_id
            except Exception as e:
                logger.error(f"Failed to load job {job_file}: {e}")

    def create_job(self, file_hash: str) -> str:
        if file_hash in self._hashes:
            existing_id = self._hashes[file_hash]
            logger.info(f"Duplicate file detected. Returning existing job_id: {existing_id}")
            return existing_id
            
        job_id = f"job_{uuid.uuid4().hex[:8]}"
        self._jobs[job_id] = {
            "job_id": job_id,
            "status": "uploaded",
            "created_at": time.time(),
            "file_hash": file_hash,
            "error": None
        }
        self._hashes[file_hash] = job_id
        
        # Create storage
        job_temp_dir = settings.TEMP_DIR / job_id
        FileManager.ensure_dir(job_temp_dir)
        
        self._save_job(job_id)
        logger.info(f"Created new job: {job_id}")
        return job_id

    def update_status(self, job_id: str, status: str, error: Optional[str] = None):
        if job_id in self._jobs:
            self._jobs[job_id]["status"] = status
            if error:
                self._jobs[job_id]["error"] = error
            self._save_job(job_id)
            logger.info(f"Job {job_id} status updated to: {status}")

    def get_status(self, job_id: str) -> str:
        # Check disk if not in memory (lazy load fallback)
        if job_id not in self._jobs:
            path = self._get_job_path(job_id)
            if path.exists():
                self._load_jobs() # Refresh
        return self._jobs.get(job_id, {}).get("status", "not_found")

    def get_job_data(self, job_id: str) -> Optional[dict]:
        if job_id not in self._jobs:
            path = self._get_job_path(job_id)
            if path.exists():
                self._load_jobs()
        return self._jobs.get(job_id)

job_manager = JobManager()

