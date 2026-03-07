from backend.utils.logger import logger
import random

from ultralytics import YOLO
import easyocr
from backend.utils.logger import logger
import random

class ObjectDetectionModel:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.model = None

    def load(self):
        if self.model is None:
            logger.info("Initializing YOLOv8 Object Detection Model...")
            # Use a lightweight model for speed (nano version)
            self.model = YOLO("yolov8n.pt")
        return self

    def detect(self, image_path: str) -> list:
        if self.model is None:
            self.load()
        results = self.model(image_path, verbose=False)
        # Extract names of detected objects
        detected_objects = []
        for r in results:
            for c in r.boxes.cls:
                detected_objects.append(self.model.names[int(c)])
        return list(set(detected_objects))

class OCRModel:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.reader = None

    def load(self):
        if self.reader is None:
            logger.info("Initializing EasyOCR Model...")
            gpu = True if "cuda" in self.device else False
            self.reader = easyocr.Reader(['en'], gpu=gpu)
        return self

    def extract_text(self, image_path: str) -> list:
        if self.reader is None:
            self.load()
        results = self.reader.readtext(image_path)
        # Extract text strings from results
        return [res[1] for res in results]

class ActionModel:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.model = None

    def load(self):
        logger.info("Initializing Action Detection Model (Standardized)...")
        # For now, we use a simple heuristic or a pre-defined set of educational actions
        # until a more robust action model is integrated.
        return self

    def detect_actions(self, image_path: str) -> list:
        # Placeholder logic with more realistic educational context
        actions = ["gesturing", "explaining", "pointing", "writing on board", "demonstrating"]
        return [random.choice(actions)]
