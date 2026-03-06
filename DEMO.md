# Vocentra: Multimodal Semantic Video Analysis

Welcome to the Vocentra Demo. This system transforms video explanations into structured, searchable, and reconstructible semantic scripts.

## How to Run the Demo

### 1. Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173) (Vite Dev Server)
- **Backend API**: [http://localhost:8000](http://localhost:8000)

### 2. Upload a Video

- Navigate to the **Upload** page.
- Select a MP4 video (max 50MB).
- Provide a **Topic/Reference Answer** (e.g., "The process of photosynthesis").
- Click **Analyze Video**.

### 3. Review Results

- The system will extract audio, transcribe speech via **Whisper**, and perform visual context analysis via **CLIP/BLIP**.
- View the **High-Fidelity Semantic Script** which maps speech to specific visual objects and actions.
- Check the **Similarity Score** to see how well the manual explanation matches the reference topic.

## System Features

- **Visual Context**: Real-time object and action detection with timestamps.
- **OCR Extraction**: Captures on-screen text and diagrams.
- **Job Persistence**: Tracking system that monitors long-running AI tasks.
- **Scalable Architecture**: Clean separation between AI engine and web services.

---

_Built for the Hacksmiths United Hackathon 2026_
