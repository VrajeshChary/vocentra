import os
import json
from pathlib import Path
from configs.config import settings
from backend.utils.logger import logger
from backend.services.video_service import VideoService

from backend.services.model_manager import model_manager
from backend.services.job_manager import job_manager
from backend.ai_engine.semantic_script.script_builder import ScriptBuilder

class VideoPipeline:
    @staticmethod
    def process_job(job_id: str, video_path: str, reference_answer: str):
        try:
            job_id_obj = Path(video_path).parent.name # job_id
            job_dir = Path(video_path).parent
            
            job_manager.update_status(job_id, "processing")
            
            # 1. Extraction
            logger.info(f"[{job_id}] Step 1: Extracting audio and frames...")
            audio_path = VideoService.extract_audio(Path(video_path), job_dir)
            frame_paths = VideoService.extract_frames(Path(video_path), job_dir)
            
            # 2. Transcription
            logger.info(f"[{job_id}] Step 2: Transcribing audio...")
            transcript_data = model_manager.transcription.transcribe(str(audio_path))
            transcript = transcript_data.get("text", "")
            
            # 3. Visual Analysis (limit to 10 frames for speed)
            logger.info(f"[{job_id}] Step 3: Analyzing visual content...")
            sample_frames = frame_paths[:10]
            
            frame_results = []
            for i, frame_p in enumerate(sample_frames):

                captions = model_manager.caption.generate_caption(frame_p)
                objs = model_manager.objects.detect(frame_p)
                ocr = model_manager.ocr.extract_text(frame_p)
                actions = model_manager.action.detect_actions(frame_p)
                
                # Determine "timestamp" based on frame index (Phase 6: 1 frame/2s)
                seconds = i * settings.FRAME_EXTRACTION_INTERVAL_SEC
                timestamp_str = f"{int(seconds // 60):02d}:{int(seconds % 60):02d}"
                
                frame_results.append({
                    "timestamp": timestamp_str,
                    "frame_path": frame_p,
                    "captions": captions,
                    "objects": objs,
                    "ocr": ocr,
                    "actions": actions
                })

            
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
            logger.info(f"[{job_id}] Step 4: Building semantic video script...")
            # We already have detailed info, can pass it to a high-level builder if needed
            # but for now we follow the user's standardized example structure
            semantic_script_data = ScriptBuilder.build(transcript, frame_results)
            
            # 6. Similarity Scoring
            logger.info(f"[{job_id}] Step 5: Calculating similarity...")
            similarity_score = model_manager.similarity.compare(transcript, reference_answer)
            
            # 7. Final Results Packaging (PHASE 8 STANDARDIZED)
            final_result = {
                "transcript": transcript,
                "speakers": [], # Placeholder for future diarization
                "visual_context": visual_context,
                "semantic_script": semantic_script_data,
                "similarity_score": float(similarity_score)
            }
            
            results_path = job_dir / "result.json"
            with open(results_path, "w") as f:
                json.dump(final_result, f, indent=4)
                
            job_manager.update_status(job_id, "completed")
            logger.info(f"[{job_id}] Pipeline completed successfully.")

            
        except Exception as e:
            logger.error(f"[{job_id}] Pipeline failed: {str(e)}")
            job_manager.update_status(job_id, "failed", error=str(e))
