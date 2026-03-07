from fastapi import APIRouter, HTTPException
import json
import os
from configs.config import settings
from backend.services.job_manager import job_manager

router = APIRouter()

@router.get("/results/{job_id}")
async def get_results(job_id: str):
    status = job_manager.get_status(job_id)
    if status != "completed":
        raise HTTPException(status_code=400, detail=f"Job not complete. Status: {status}")
        
    result_path = settings.RESULTS_DIR / job_id / "result.json"
    if not result_path.exists():
        # Fallback to temp if not found (legacy)
        result_path = settings.TEMP_DIR / job_id / "result.json"
        if not result_path.exists():
            raise HTTPException(status_code=404, detail="Result file not found.")
        
    with open(result_path, "r") as f:
        return json.load(f)
