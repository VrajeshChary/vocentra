from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
from configs.config import settings
from backend.utils.logger import logger

class VisualModel:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.model = None
        self.processor = None

    def load(self):
        if self.model is None:
            logger.info(f"Loading CLIP model: {settings.CLIP_MODEL}")
            self.model = CLIPModel.from_pretrained(settings.CLIP_MODEL).to(self.device)
            self.processor = CLIPProcessor.from_pretrained(settings.CLIP_MODEL)
        return self

    def get_embeddings(self, image_paths: list):
        if self.model is None:
            self.load()
            
        images = [Image.open(p) for p in image_paths]
        inputs = self.processor(images=images, return_tensors="pt", padding=True).to(self.device)
        
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)
            
        return image_features.cpu().numpy().tolist()
