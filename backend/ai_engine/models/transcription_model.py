import whisper
import torch
from configs.config import settings
from backend.utils.logger import logger

class TranscriptionModel:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.model = None

    def load(self):
        if self.model is None:
            logger.info(f"Loading Whisper model: {settings.WHISPER_MODEL}")
            self.model = whisper.load_model(settings.WHISPER_MODEL, device=self.device)
        return self

    def transcribe(self, audio_path: str) -> dict:
        if self.model is None:
            self.load()
        return self.model.transcribe(audio_path)
