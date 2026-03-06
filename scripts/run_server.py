import os
import uvicorn
from configs.config import settings
from backend.utils.logger import logger

def start():
    logger.info("Starting Vocentra Scalable Architecture...")
    # Production settings logic can go here
    uvicorn.run(
        "backend.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=False, 
        workers=1,
        log_level="info"
    )

if __name__ == "__main__":
    start()
