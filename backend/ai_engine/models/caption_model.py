from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
from configs.config import settings
from backend.utils.logger import logger

class CaptionModel:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.model = None
        self.processor = None

    def load(self):
        if self.model is None:
            logger.info(f"Loading BLIP model: {settings.BLIP_MODEL}")
            self.processor = BlipProcessor.from_pretrained(settings.BLIP_MODEL)
            self.model = BlipForConditionalGeneration.from_pretrained(settings.BLIP_MODEL).to(self.device)
        return self

    def generate_caption(self, image_path: str) -> str:
        if self.model is None:
            self.load()
        
        raw_image = Image.open(image_path).convert('RGB')
        inputs = self.processor(raw_image, return_tensors="pt").to(self.device)
        
        out = self.model.generate(**inputs)
        return self.processor.decode(out[0], skip_special_tokens=True)
