from fastapi import APIRouter, HTTPException
from backend.services.job_manager import job_manager

router = APIRouter()

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    job_data = job_manager.get_job_data(job_id)
    if not job_data:
        raise HTTPException(status_code=404, detail="Job not found.")
    return {
        "job_id": job_id, 
        "status": job_data.get("status"),
        "progress": job_data.get("progress", 0),
        "error": job_data.get("error")
    }
