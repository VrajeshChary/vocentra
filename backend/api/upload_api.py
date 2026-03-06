from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from pathlib import Path
import uuid
import shutil
from configs.config import settings
from backend.services.job_manager import job_manager
from backend.utils.file_manager import FileManager
from backend.utils.logger import logger
from backend.ai_engine.pipelines.video_pipeline import VideoPipeline

router = APIRouter()

@router.post("/demo-analysis")
async def demo_analysis(background_tasks: BackgroundTasks):
    """Phase 18: Instant demo mode using test_video.mp4"""
    demo_video = Path("scripts/test_video.mp4") # Placeholder for demo video location
    if not demo_video.exists():
        # Fallback search in storage
        demo_video = settings.BASE_DIR / "scripts" / "test_video.mp4"
        if not demo_video.exists():
            raise HTTPException(status_code=404, detail="Demo video not found.")
    
    file_hash = "demo_hash_v1"
    job_id = job_manager.create_job(file_hash)
    job_data = job_manager.get_job_data(job_id)
    
    if job_data["status"] == "uploaded":
        job_dir = settings.TEMP_DIR / job_id
        final_video_path = job_dir / "demo_video.mp4"
        shutil.copy(str(demo_video), str(final_video_path))
        
        background_tasks.add_task(
            VideoPipeline.process_job, 
            job_id, 
            str(final_video_path), 
            "This is a demo analysis of a computer science lecture."
        )
        return {"job_id": job_id, "status": "processing", "message": "Demo started."}
    
    return {"job_id": job_id, "status": job_data["status"]}

@router.post("/upload-video")

async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    reference_answer: str = Form(...)
):
    # Phase 11: Security Validation
    # 1. Type Validation
    ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm"]
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}")
        
    # 2. Size Validation (Limit to settings.MAX_UPLOAD_SIZE_MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max size {settings.MAX_UPLOAD_SIZE_MB}MB.")

    # 3. Filename Sanitization
    safe_filename = "".join([c for c in file.filename if c.isalnum() or c in "._-"]).strip()
    if not safe_filename:
        safe_filename = f"upload_{uuid.uuid4().hex[:8]}.mp4"

    # Temporary save for hashing
    temp_path = settings.TEMP_DIR / f"upload_{uuid.uuid4().hex}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_hash = FileManager.get_file_hash(str(temp_path))

    
    # Create or get job
    job_id = job_manager.create_job(file_hash)
    job_data = job_manager.get_job_data(job_id)
    
    # If it's a new job (or failed), move file and start pipeline
    if job_data["status"] in ["uploaded", "failed"]:
        safe_filename = "".join([c for c in file.filename if c.isalnum() or c in "._-"]).strip()
        job_dir = settings.TEMP_DIR / job_id
        final_video_path = job_dir / safe_filename
        
        if not final_video_path.exists():
            shutil.copy(str(temp_path), str(final_video_path))
        
        # Start background processing
        background_tasks.add_task(
            VideoPipeline.process_job, 
            job_id, 
            str(final_video_path), 
            reference_answer
        )
        temp_path.unlink() # Cleanup temp
        return {"job_id": job_id, "status": "processing"}

    else:
        # Already processing or completed
        temp_path.unlink() # Clean up the duplicate temp upload
        return {"job_id": job_id, "status": job_data["status"], "message": "Duplicate detected."}
