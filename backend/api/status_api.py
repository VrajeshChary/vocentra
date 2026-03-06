from fastapi import APIRouter, HTTPException
from backend.services.job_manager import job_manager

router = APIRouter()

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    status = job_manager.get_status(job_id)
    if status == "not_found":
        raise HTTPException(status_code=404, detail="Job not found.")
    return {"job_id": job_id, "status": status}
