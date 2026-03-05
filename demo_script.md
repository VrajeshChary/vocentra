# 🎬 Vocentra: The Live Demo Playbook

A flawless execution plan for presenting Vocentra. Our goal is a smooth, eye-catching, and entirely crash-free live demonstration.

---

## 🎥 Pre-Demo Preparation: The "Sandbox"

You will record small, high-quality reference explanations on your phone camera prior to the evaluation.

**Topics:**

- 🌿 **Photosynthesis**
- ⛓️ **Blockchain**
- 🤖 **Machine Learning**

> **Why?** Pre-recorded videos ensure lighting, audio clarity, and timings are perfect so you aren't fighting live environment noise during the pitch.

---

## 🧪 System Testing & Approval

Before you ever say "ready" to a judge, the entire pipeline must be tested and verified by **you**.

### 📋 The Mandatory Test Protocol

1. **Upload** the _Photosynthesis_ sample video.
2. **Verify Transcription** for high accuracy against the spoken words.
3. **Check Semantic Score**—it MUST hit above **80% similarity**.
4. **Approve UI**—ensure the interface elements load cleanly.

⚠️ _If the score or transcription fails to meet the standard, coordinate immediately with Niteesh to adjust backend scoring thresholds._

---

## 🎮 The Live Demo Flow (For Judges)

When a judge arrives at your booth, execute this precise workflow:

1. 📤 **Upload:** The judge uploads a sample video explanation via the clean UI.
2. ⚙️ **Process:** The system dynamically processes the logic in the background.
3. ✨ **The Reveal:** Walk the judge through the generated metrics:
   - 🗣️ **The Transcription:** Displaying exactly what the student said.
   - 🎯 **Detected Concepts:** Identifying core nodes (e.g., _Photosynthesis, Sunlight, Energy_).
   - ❌ **Missing Concepts:** Pointing out knowledge gaps (e.g., _Missing: Glucose production_).
   - 📖 **The Reference:** Displaying the "Gold Standard" answer.
   - 🕸️ **Visual Networks:** Showing the stunning visual overlay of the Student Graph vs. Reference Graph.
   - 🏆 **The Final Score:** Revealing the calculated Similarity Score (e.g., **83% Match**).

---

## 🚨 Pre-Evaluation Checklist

Before the first judge approaches, verify the exact state of the system:

- [ ] 🟢 **Frontend** is active, responsive, and clean.
- [ ] 🟢 **Backend** successfully accepts `.mp4` payloads.
- [ ] 🟢 **Transcription module** is actively decoding.
- [ ] 🟢 **Similarity Scores & Concept Graphs** render seamlessly.
