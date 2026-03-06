import os
import subprocess
import cv2
from pathlib import Path
from configs.config import settings
from backend.utils.logger import logger

class VideoService:
    @staticmethod
    def extract_audio(video_path: Path, output_dir: Path) -> Path:
        """Extracts audio from video using ffmpeg."""
        output_dir.mkdir(parents=True, exist_ok=True)
        audio_path = (output_dir / "audio.wav").absolute()
        video_path = video_path.absolute()
        
        command = [
            "ffmpeg", "-y", "-i", str(video_path),
            "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
            str(audio_path)
        ]
        
        try:
            result = subprocess.run(command, check=True, capture_output=True, text=True)
            logger.info(f"Audio extracted to {audio_path}")
            return audio_path
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg audio extraction failed: {e.stderr}")
            raise RuntimeError(f"Audio extraction failed: {e.stderr}")

    @staticmethod
    def extract_frames(video_path: Path, output_dir: Path) -> list:
        """Extracts frames from video based on time interval."""
        frames_dir = output_dir / "frames"
        frames_dir.mkdir(parents=True, exist_ok=True)
        
        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            raise RuntimeError(f"Could not open video file: {video_path}")
            
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0: fps = 30 # Fallback
        
        interval_frames = int(fps * settings.FRAME_EXTRACTION_INTERVAL_SEC)
        
        count = 0
        extracted_paths = []
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            if count % interval_frames == 0:
                # Resize to max 720p width
                height, width = frame.shape[:2]
                if width > 720:
                    new_width = 720
                    new_height = int(height * (new_width / width))
                    frame = cv2.resize(frame, (new_width, new_height))
                
                frame_name = f"frame_{count:05d}.jpg"
                frame_path = frames_dir / frame_name
                # Compress to JPEG with 80% quality
                cv2.imwrite(str(frame_path), frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
                extracted_paths.append(str(frame_path))
                
            count += 1
       