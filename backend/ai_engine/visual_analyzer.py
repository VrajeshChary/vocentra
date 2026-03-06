import os
import clip
import torch
from PIL import Image

from concept_extractor import extract_concepts


clip_model = None
clip_preprocess = None


def load_clip():

    global clip_model, clip_preprocess

    if clip_model is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        clip_model, clip_preprocess = clip.load("ViT-B/32", device=device)

    return clip_model, clip_preprocess


def generate_labels(topic, transcript):

    concepts = extract_concepts(topic, transcript)

    labels = []

    for concept in concepts:
        labels.append(f"a technical diagram explaining {concept}")
        labels.append(f"an educational slide about {concept}")

    labels.extend([
        "random objects",
        "people talking",
        "an unrelated concept"
    ])

    return labels


def analyze_frames(frames_folder="frames", topic="", transcript=""):

    device = "cuda" if torch.cuda.is_available() else "cpu"

    model, preprocess = load_clip()

    labels = generate_labels(topic, transcript)

    text_tokens = clip.tokenize(labels).to(device)

    frame_files = sorted(
        [f for f in os.listdir(frames_folder) if f.endswith(".jpg")]
    )

    frame_files = frame_files[::10]

    label_scores = {label: 0 for label in labels}

    print(f"Analyzing {len(frame_files)} frames for topic: {topic}")

    for frame_file in frame_files:

        frame_path = os.path.join(frames_folder, frame_file)

        image = preprocess(Image.open(frame_path)).unsqueeze(0).to(device)

        with torch.no_grad():
            logits_per_image, _ = model(image, text_tokens)
            probs = logits_per_image.softmax(dim=-1).cpu().numpy()[0]

        for i, label in enumerate(labels):
            label_scores[label] += probs[i]

    top_label = max(label_scores, key=label_scores.get)

    topic_scores = []

    for label, score in label_scores.items():
        if topic.lower() in label.lower():
            topic_scores.append(score)

    max_topic = max(topic_scores) if topic_scores else 0
    max_all = max(label_scores.values())

    visual_relevance = round(max_topic / max_all, 2) if max_all != 0 else 0

    print(f"\nVisual Context: {top_label}")
    print(f"Visual Relevance to Topic: {visual_relevance}")

    return top_label, label_scores, visual_relevance


def generate_visual_transcript(topic):

    return f"visual explanation about {topic}"