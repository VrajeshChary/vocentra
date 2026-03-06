import os
import uvicorn
from backend.utils.logger import logger

if __name__ == "__main__":
    logger.info("Starting Vocentra Reorganized Backend...")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=False)

