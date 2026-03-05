# 🧠 Vocentra: The Intelligent Algorithm

This document outlines the exact logic of the **Explain-Score Pipeline**. It’s not just about matching words—it's about understanding _meaning_.

---

## ⚙️ The 10-Step Algorithmic Logic

|  Step  | Action                   | Description & Technology                                                                                        |
| :----: | :----------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **01** | 📥 **Receive Video**     | Ingest the student explanation video (`.mp4`).                                                                  |
| **02** | 🎵 **Extract Audio**     | Strip the audio track. <br/>`$ ffmpeg -i video.mp4 audio.wav`                                                   |
| **03** | 🗣️ **Transcribe**        | Convert the spoken audio into precise text using **Whisper**.                                                   |
| **04** | 🧹 **Clean Text**        | Remove filler words ("um," "like"), lowercase the text, and strip noise tokens using NLP tools.                 |
| **05** | 🧬 **Embed Transcript**  | Convert the clean transcript into a multidimensional semantic vector using **Sentence-BERT**.                   |
| **06** | 💎 **Embed Reference**   | Generate a semantic vector for the highly curated ground-truth reference answer.                                |
| **07** | ⚖️ **Cosine Similarity** | Mathematically compare the vectors. <br/>`similarity = cosine(student_v, reference_v)`                          |
| **08** | 🕸️ **Extract Concepts**  | Use dependency parsing to build a semantic graph of the student's answer (e.g., _Plants → convert → sunlight_). |
| **09** | 🔍 **Graph Overlap**     | Compare the student's concept network against the reference network. Measure the exact overlap.                 |
| **10** | 🏆 **Generate Score**    | Output the final intelligent evaluation.                                                                        |

---

## 🧮 Final Scoring Formula

The final output isn't a simple percentage. It's a calculated metric of understanding:

> **Final Score** = `(0.6 × Semantic Similarity) + (0.3 × Concept Coverage) + (0.1 × Keyword Match)`

**Example Output:**

- **Semantic alignment:** 0.86
- **Concept coverage:** 0.80
- **Keyword correlation:** 0.75
- **🌟 Final Evaluated Score:** **83% Match**

---

## 💡 Why This Approach Wins

Most teams will take the easy route: `video → text → exact keyword match`.

**Vocentra’s superiority lies in its depth:**

> `video` ➔ `text` ➔ `semantic vectors` ➔ `concept graph comparison`

It behaves less like a script, and more like a _human professor_ evaluating the conceptual grasp of a student.
