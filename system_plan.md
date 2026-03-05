# 🚀 Vocentra: The Future of Semantic Evaluation

Welcome to the architectural blueprint of **Vocentra**—an advanced analytical engine built to transcend traditional keyword-matching and evaluate student explanations based on _true semantic meaning and conceptual depth_.

---

## 🎯 The Core Problem

> **Manual evaluation of video explanations is painfully slow, highly subjective, and fundamentally unscalable.**

Educators spend countless hours grading viva and explanation videos. Human judges suffer from fatigue, leading to inconsistent scoring.

## 💡 The Vocentra Solution

**Vocentra** automates this by acting as a highly intelligent, AI-driven judge. It analyzes explanation videos, understands the underlying meaning, and evaluates the conceptual similarity against validated reference answers.

---

## 🏗️ System Architecture & Pipeline

A seamless 8-step pipeline powers the magic behind Vocentra:

1. 🎬 **Video Input** - Learner uploads their explanation.
2. 🎵 **Audio Extraction** - Strip the core speech via `FFmpeg`.
3. 🗣️ **Speech-to-Text** - High-fidelity transcription using `OpenAI Whisper`.
4. 🧹 **Text Preprocessing** - Noise reduction & cleaning via `NLTK / SpaCy`.
5. 🧠 **Semantic Embedding** - Transformation into meaning vectors using `Sentence-BERT`.
6. ⚖️ **Similarity Engine** - Cosine similarity calculation between student & reference vectors.
7. 🕸️ **Semantic Network Check** - Dependency parsing & concept extraction (The "Wow" factor).
8. 📊 **Evaluation Engine** - Final scoring combining semantics + concept coverage + keywords.

---

## 🧰 The Tech Stack

| Domain                    | Technology              | Why We Use It                                         |
| :------------------------ | :---------------------- | :---------------------------------------------------- |
| **Speech Recognition**    | `Whisper / Whisper.cpp` | Offline-capable, state-of-the-art accuracy            |
| **NLP & Text Processing** | `SpaCy`, `NLTK`         | Robust text cleaning and dependency parsing           |
| **Embeddings**            | `Sentence-BERT`         | Superior at generating sentence-level meaning vectors |
| **Math & Similarity**     | `Cosine Similarity`     | The mathematical gold standard for vector comparison  |
| **Backend Magic**         | `Python`, `Flask`       | Lightweight, fast, and ML-friendly                    |
| **User Interface**        | `HTML / CSS / JS`       | Clean, simple, and distraction-free experience        |

---

## 📁 File Structure

```text
/vocentra-project
 ├── 🚀 app.py                 (Main application & upload handler)
 ├── 🎙️ transcribe.py          (Whisper transcription logic)
 ├── 🧹 preprocess.py          (Text cleaning & tokenization)
 ├── 🧠 embedding.py           (Sentence-BERT vector generation)
 ├── ⚖️ similarity.py          (Cosine similarity math)
 ├── 🕸️ semantic_graph.py      (Concept network extraction)
 └── 📂 templates
      └── 🎨 index.html        (The sleek user interface)
```
