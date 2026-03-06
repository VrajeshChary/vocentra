import torch
from backend.utils.logger import logger
from backend.ai_engine.models.transcription_model import TranscriptionModel
from backend.ai_engine.models.caption_model import CaptionModel
from backend.ai_engine.models.visual_model import VisualModel
from backend.ai_engine.models.similarity_model import SimilarityModel
from backend.ai_engine.models.mock_models import ObjectDetectionModel, OCRModel, ActionModel

class ModelManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def initialize_models(self):
        if self._initialized:
            return
            
        logger.info("Initializing AI models for the first time...")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Heavy models
        self.transcription = TranscriptionModel(self.device).load()
        self.caption = CaptionModel(self.device).load()
        self.visual = VisualModel(self.device).load()
        self.similarity = SimilarityModel(self.device).load()
        
        # Lightweight/Mock models
        self.objects = ObjectDetectionModel().load()
        self.ocr = OCRModel().load()
        self.action = ActionModel().load()
        
        self._initialized = True
        logger.info("All AI models initialized successfully.")

model_manager = ModelManager()
