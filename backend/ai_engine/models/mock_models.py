from backend.utils.logger import logger
import random

class ObjectDetectionModel:
    def load(self):
        logger.info("Initializing Object Detection Model (Mock)...")
        return self

    def detect(self, image_path: str) -> list:
        # Placeholder logic
        objects = ["laptop", "person", "whiteboard", "desk", "chair"]
        return random.sample(objects, random.randint(1, 3))

class OCRModel:
    def load(self):
        logger.info("Initializing OCR Model (Mock)...")
        return self

    def extract_text(self, image_path: str) -> list:
        # Placeholder logic
        return ["VOCENTRA", "Architecture", "AI Pipeline"]

class ActionModel:
    def load(self):
        logger.info("Initializing Action Detection Model (Mock)...")
        return self

    def detect_actions(self, image_path: str) -> list:
        # Placeholder logic
        actions = ["pointing at board", "explaining", "sitting", "writing"]
        return [random.choice(actions)]
