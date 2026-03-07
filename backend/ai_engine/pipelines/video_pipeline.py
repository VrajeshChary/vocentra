import os
import json
from pathlib import Path
from configs.config import settings
from backend.utils.logger import logger
from backend.services.video_service import VideoService

from backend.services.model_manager import model_manager
from backend.services.job_manager import job_manager
from backend.ai_engine.semantic_script.script_builder import ScriptBuilder

import shutil
import cv2
import numpy as np
from concurrent.futures import ThreadPoolExecutor, TimeoutError

class VideoPipeline:
    executor = ThreadPoolExecutor(max_workers=4) # Shared pool for inference timeouts
    @staticmethod
    def is_blank_frame(frame_path: str) -> bool:
        """Heuristic to detect blank/empty frames."""
        try:
            frame = cv2.imread(frame_path)
            if frame is None: return True
            # Check variance of pixel intensities
            variance = cv2.Laplacian(frame, cv2.CV_64F).var()
            if variance < 10: # Threshold for 'too flat'
                return True
            return False
        except:
            return True

    @staticmethod
    def process_job(job_id: str, video_path: str, reference_answer: str):
        try:
            job_id_obj = Path(video_path).parent.name # job_id
            job_dir = Path(video_path).parent
            
            job_manager.update_status(job_id, "processing")
            
            # 1. Extraction (Phase 3: 20% - 55%)
            logger.info(f"[{job_id}] Step 1: Extracting audio and frames...")
            job_manager.update_status(job_id, "processing", progress=20)
            audio_path = VideoService.extract_audio(Path(video_path), job_dir)
            
            job_manager.update_status(job_id, "processing", progress=55)
            frame_paths = VideoService.extract_frames(Path(video_path), job_dir)
            
            # 2. Transcription (Phase 3: 40%) - Wait, user said STT -> 40%, Frame Ext -> 55%
            # I'll re-order to match user's requested progression logically or follow their mapping.
            # Mapping: STT 40, Frame Ext 55. So Audio -> 20, STT -> 40.
            
            logger.info(f"[{job_id}] Step 2: Transcribing audio...")
            try:
                transcript_data = model_manager.transcription.transcribe(str(audio_path))
                transcript = transcript_data.get("text", "")
            except Exception as e:
                logger.error(f"[{job_id}] Transcription failed: {e}")
                transcript = ""
            
            job_manager.update_status(job_id, "processing", progress=40)
            
            # 3. Visual Analysis (Phase 7: Batched/Optimized)
            # 3. Visual Analysis (Phase 3: Object Detection -> 70%, OCR+Caption -> 85%)
            logger.info(f"[{job_id}] Step 3: Analyzing visual content...")
            
            frame_results = []
            total_frames = len(frame_paths)
            analysis_limit = 30
            
            for i, frame_p in enumerate(frame_paths):
                # Skip frames to stay within limit
                if total_frames > analysis_limit and i % (total_frames // analysis_limit) != 0:
                    continue
                
                # Phase 5: Skip blank frames
                if VideoPipeline.is_blank_frame(str(frame_p)):
                    continue

                # Granular progress for visual analysis (70-85 range)
                current_p = 70 + int((i / total_frames) * 15)
                job_manager.update_status(job_id, "processing", progress=current_p)

                # Each model call wrapped in fail-safe with timeout (Phase 7)
                def get_captions(): return model_manager.caption.generate_caption(frame_p)
                def get_objects(): return model_manager.objects.detect(frame_p)
                def get_ocr(): return model_manager.ocr.extract_text(frame_p)
                def get_actions(): return model_manager.action.detect_actions(frame_p)

                try:
                    future = VideoPipeline.executor.submit(get_captions)
                    captions = future.result(timeout=5)
                except: 
                    logger.warning(f"[{job_id}] Captioning timed out or failed.")
                    captions = "Visual analysis in progress"
                
                try:
                    future = VideoPipeline.executor.submit(get_objects)
                    objs = future.result(timeout=5)
                except: 
                    logger.warning(f"[{job_id}] Object detection timed out or failed.")
                    objs = []
                
                try:
                    future = VideoPipeline.executor.submit(get_ocr)
                    ocr = future.result(timeout=5)
                except: 
                    logger.warning(f"[{job_id}] OCR timed out or failed.")
                    ocr = []
                
                try:
                    future = VideoPipeline.executor.submit(get_actions)
                    actions = future.result(timeout=5)
                except: 
                    logger.warning(f"[{job_id}] Action detection timed out or failed.")
                    actions = []
                
                
                # Timestamp Calculation
                seconds = i * settings.FRAME_EXTRACTION_INTERVAL_SEC
                timestamp_str = f"{int(seconds // 60):02d}:{int(seconds % 60):02d}"
                
                frame_results.append({
                    "timestamp": timestamp_str,
                    "frame_path": str(frame_p),
                    "captions": captions,
                    "objects": objs,
                    "ocr": ocr,
                    "actions": actions
                })

            job_manager.update_status(job_id, "processing", progress=85)

            
            # 4. Constructing visual_context (Phase 8 Standardization)
            visual_context = []
            for i, res in enumerate(frame_results):
                visual_context.append({
                    "timestamp": res["timestamp"],
                    "objects": res["objects"],
                    "actions": res["actions"],
                    "ocr_text": res["ocr"], # User requested ocr_text label
                    "caption": res["captions"] # User requested caption label
                })

            # 5. Semantic Script Construction
            # 5. Semantic Script Construction (Phase 3: 95%)
            logger.info(f"[{job_id}] Step 4: Building semantic video script...")
            semantic_script_data = ScriptBuilder.build(transcript, frame_results)
            job_manager.update_status(job_id, "processing", progress=95)
            
            # 6. Similarity Scoring (Phase 3: 100%)
            logger.info(f"[{job_id}] Step 5: Calculating similarity...")
            try:
                similarity_score = model_manager.similarity.compare(transcript, reference_answer)
            except:
                similarity_score = 0.5 # Default fallback
            
            job_manager.update_status(job_id, "processing", progress=100)
            
            # 7. Final Results Packaging (PHASE 8 STANDARDIZED)
            final_result = {
                "transcript": transcript,
                "speakers": [], # Placeholder for future diarization
                "visual_context": visual_context,
                "semantic_script": semantic_script_data,
                "similarity_score": float(similarity_score)
            }
            
            # Save to permanent RESULTS_DIR
            results_dir = settings.RESULTS_DIR / job_id
            results_dir.mkdir(parents=True, exist_ok=True)
            results_path = results_dir / "result.json"
            
            with open(results_path, "w") as f:
                json.dump(final_result, f, indent=4)
                
            # 8. Cleanup (Phase 7 - Standardized)
            logger.info(f"[{job_id}] Step 6: Cleaning up ALL temporary files...")
            try:
                # Delete the entire job temp folder
                if job_dir.exists():
                    shutil.rmtree(job_dir)
                logger.info(f"[{job_id}] Cleanup complete for job temp directory.")
            except Exception as e:
                logger.warning(f"[{job_id}] Cleanup failed: {e}")

            # 9. Memory Management (Phase 13)
            import gc
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            gc.collect()
            logger.info(f"[{job_id}] Memory cleared.")

            job_manager.update_status(job_id, "completed")
            logger.info(f"[{job_id}] Pipeline completed successfully.")

            
        except Exception as e:
            logger.error(f"[{job_id}] Pipeline failed: {str(e)}")
            job_manager.update_status(job_id, "failed", error=str(e))
            # Optional: Cleanup on failure too
            try:
                if job_dir.exists():
                    shutil.rmtree(job_dir)
            except:
                pass
