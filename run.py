import os
import uvicorn
from backend.utils.logger import logger
import sys
import subprocess

def check_dependencies():
    required = ["ultralytics", "easyocr", "cv2", "whisper", "transformers", "sentence_transformers"]
    for pkg in required:
        try:
            __import__(pkg if pkg != "cv2" else "cv2")
        except ImportError:
            print(f"Installing missing dependency: {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])

if __name__ == "__main__":
    logger.info("Starting Vocentra Reorganized Backend...")
    check_dependencies()
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
