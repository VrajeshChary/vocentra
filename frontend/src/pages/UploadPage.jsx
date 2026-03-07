import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import UploadDropzone from "../components/UploadDropzone";
import PipelineTracker from "../components/PipelineTracker";

function UploadApp() {
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [processing, setProcessing] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [trackerDone, setTrackerDone] = useState(false);
  const [jobId, setJobId] = useState(null);

  // Triggered by Dropzone or Sample button
  const startAnalysis = (uploadedFile, selectedTopic) => {
    setFile(uploadedFile);
    setTopic(selectedTopic || "");
    setProcessing(true);
    setJobId(null);
  };

  const controllerRef = React.useRef(null);

  useEffect(() => {
    if (processing && file) {
      const abortController = new AbortController();
      controllerRef.current = abortController;

      // Start the actual backend upload
      import("../services/apiClient").then(({ uploadVideo }) => {
        uploadVideo(file, topic, abortController.signal)
          .then((res) => {
            setJobId(res.job_id);
            setUploadDone(true);
          })
          .catch((err) => {
            if (err.name === "AbortError") {
              console.log("Upload cancelled");
            } else {
              console.error("Upload failed", err);
              alert("Upload failed: " + err.message);
            }
            // Reset state on failure or cancel
            setProcessing(false);
            setFile(null);
            setTrackerDone(false);
            setUploadDone(false);
          });
      });

      return () => abortController.abort();
    }
  }, [processing, file, topic]);

  const handleCancelUpload = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  useEffect(() => {
    // When both the fake tracker animation and the real upload have finished, proceed
    if (uploadDone && trackerDone && jobId) {
      window.location.href = `/result.html?job_id=${jobId}`;
    }
  }, [uploadDone, trackerDone, jobId]);

  const onPipelineComplete = () => {
    setTrackerDone(true);
  };

  const loadSampleDemo = async () => {
    try {
      import("../services/apiClient").then(async ({ tryDemo }) => {
        const res = await tryDemo();
        if (res) {
          window.location.href = `/result.html?job_id=demo`;
        }
      });
    } catch (err) {
      console.error(err);
      alert("Could not load sample demo from backend.");
    }
  };

  return (
    <div className="upload-wrap">
      {!processing ? (
        <>
          <div
            className="upload-header"
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              paddingTop: "4rem",
              paddingBottom: "1rem",
            }}
          >
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              Vocentra Multimodal Engine
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                maxWidth: 600,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Upload a video to instantly extract speech, visual context, text
              (OCR), and semantic similarity against the lecture curriculum.
            </p>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                className="btn-secondary"
                onClick={loadSampleDemo}
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                ✨ Try Sample Demo
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  const audio = new Audio(
                    "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
                  );
                  audio.play();
                }}
              >
                🎤 Speak Product Pitch
              </button>
            </div>
          </div>

          <UploadDropzone onStart={startAnalysis} />

          <div
            style={{
              textAlign: "center",
              marginTop: "2.5rem",
              opacity: 0.8,
              animation: "revealAnim 1s ease forwards",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 1rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--glass-border)",
                borderRadius: "12px",
              }}
            >
              <span
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                Pro tip: Try the 'Sample Demo' button to auto-load a sample.
              </span>
            </div>
          </div>
        </>
      ) : (
        <PipelineTracker
          file={file}
          jobId={jobId}
          onComplete={onPipelineComplete}
          onCancel={handleCancelUpload}
        />
      )}
    </div>
  );
}

const rootElement = document.getElementById("upload-root");
if (rootElement) {
  createRoot(rootElement).render(<UploadApp />);
}
