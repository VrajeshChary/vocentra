from sentence_transformers import SentenceTransformer, util
import torch
from backend.utils.logger import logger

class SimilarityModel:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.model = None

    def load(self):
        if self.model is None:
            logger.info("Loading SentenceTransformer model...")
            self.model = SentenceTransformer('all-MiniLM-L6-v2', device=self.device)
        return self

    def compare(self, text1: str, text2: str) -> float:
        if self.model is None:
            self.load()
        
        emb1 = self.model.encode(text1, convert_to_tensor=True)
        emb2 = self.model.encode(text2, convert_to_tensor=True)
        
        return float(util.pytorch_cos_sim(emb1, emb2))
