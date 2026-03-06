import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  "Upload Video",
  "Extract Audio",
  "Speech to Text",
  "Frame Analysis",
  "Object Detection",
  "Scene Understanding",
  "OCR Detection",
  "Semantic Fusion",
  "Similarity Scoring",
  "Results Formatting",
];

import { getJobStatus } from "../services/apiClient";

export default function PipelineTracker({ file, jobId, onComplete, onCancel }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let pollInterval;

    const startPolling = () => {
      pollInterval = setInterval(async () => {
        if (!jobId) return;

        try {
          const res = await getJobStatus(jobId);
          if (res.status === "completed") {
            setCurrentStage(STAGES.length - 1);
            clearInterval(pollInterval);
            setTimeout(() => onComplete(), 800);
          } else if (res.status === "failed") {
            setError("Processing failed on server.");
            clearInterval(pollInterval);
          } else {
            // Keep ticking stages slowly while processing
            setCurrentStage((prev) => {
              if (prev < STAGES.length - 2) return prev + 1;
              return prev;
            });
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 2000);
    };

    if (jobId) {
      startPolling();
    } else {
      // Fake progress if no jobId yet (e.g. still uploading)
      const fakeInterval = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev < 3) return prev + 1; // Stay at 'Speech to Text' until real jobId arrives
          return prev;
        });
      }, 1500);
      return () => clearInterval(fakeInterval);
    }

    return () => clearInterval(pollInterval);
  }, [jobId, onComplete]);

  const percentage =
    Math.round((currentStage / (STAGES.length - 1)) * 100) || 0;

  return (
    <div className="proc-wrap" style={{ display: "block" }}>
      <div className="proc-card glass">
        <div className="proc-orb">
          <div
            className="proc-ring"
            style={{ animation: "spin 4s linear infinite" }}
          ></div>
          <div
            className="proc-ring"
            style={{ animation: "spin-reverse 6s linear infinite" }}
          ></div>
          <div
            className="proc-core"
            style={{ animation: "coreGlow 2s infinite" }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
        <div className="proc-title">Analyzing...</div>
        <div className="proc-sub">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{ display: "inline-block" }}
            >
              {STAGES[currentStage]}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="proc-circle-wrap">
          <svg className="proc-circle-svg" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--glass-border)"
              strokeWidth="5"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeDasharray="290"
              strokeDashoffset={290 - (290 * percentage) / 100}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="proc-circle-center">{percentage}%</div>
        </div>

        <div className="proc-pipeline">
          {STAGES.map((stage, idx) => (
            <div
              key={idx}
              className="pipe-step"
              style={{
                opacity: currentStage >= idx ? 1 : 0.4,
                color:
                  currentStage > idx
                    ? "var(--success)"
                    : currentStage === idx
                      ? "var(--accent)"
                      : "inherit",
                transition: "all 0.4s ease",
              }}
            >
              <div
                className="pipe-dot"
                style={{
                  background:
                    currentStage > idx
                      ? "var(--success)"
                      : currentStage === idx
                        ? "var(--accent)"
                        : "var(--glass-border)",
                  boxShadow:
                    currentStage === idx ? "0 0 8px var(--accent)" : "none",
                }}
              ></div>
              <div className="pipe-label">
                {idx + 1}. {stage}
              </div>
            </div>
          ))}
        </div>

        {onCancel && (
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              className="btn-ghost"
              onClick={onCancel}
              style={{
                padding: "0.4rem 1rem",
                fontSize: "0.8rem",
                color: "var(--danger)",
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
            >
              Cancel Processing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
