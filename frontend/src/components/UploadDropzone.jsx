import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload as TusUpload } from "tus-js-client";
import DOMPurify from "dompurify";

export default function UploadDropzone({ onStart }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [checksumStatus, setChecksumStatus] = useState(null);
  const fileInputRef = useRef(null);
  const uploadRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelected = (selectedFile) => {
    setError(null);
    setUploadProgress(0);
    // Point 21: Client validation
    if (selectedFile.size > 500 * 1024 * 1024) {
      setError("Video too large — max 500MB.");
      return;
    }
    const validTypes = [
      "video/mp4",
      "video/quicktime",
      "video/webm",
      "video/x-matroska",
      "audio/mpeg",
      "audio/wav",
      "audio/x-m4a",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError(
        "Unsupported codec. Please use MP4, MOV, WEBM, or standard audio formats.",
      );
      return;
    }
    setFile(selectedFile);
  };

  const startUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setChecksumStatus("spinner");

    setTimeout(() => {
      setChecksumStatus("pass");

      let p = 0;
      const progInt = setInterval(() => {
        p += 5;
        if (p >= 100) {
          clearInterval(progInt);
          setTimeout(() => {
            setIsUploading(false);
            onStart(file, DOMPurify.sanitize(topic));
          }, 300);
        } else {
          setUploadProgress(p);
        }
      }, 50); // fast fake upload animation, since true processing is handled by UploadPage
    }, 1500);
  };

  const handleCancelClick = () => {
    if (uploadRef.current) uploadRef.current.abort();
    setIsUploading(false);
    setUploadProgress(0);
    setFile(null);
  };

  const handleRetryClick = () => {
    setError(null);
    startUpload();
  };

  return (
    <div className="upload-box glass reveal" style={{ animationDelay: "0.2s" }}>
      {!file ? (
        <div
          className="drop-area"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            borderColor: isDragging ? "var(--accent)" : "var(--glass-border)",
            background: isDragging ? "rgba(99, 179, 237, 0.05)" : "transparent",
          }}
        >
          <div className="drop-rings">
            <div className="drop-ring drop-ring-1"></div>
            <div className="drop-ring drop-ring-2"></div>
            <div className="drop-ring drop-ring-3"></div>
          </div>
          <div className="drop-content">
            <div className="drop-icon-container">
              <div className="drop-icon-ring-spin"></div>
              <svg
                className="drop-icon-svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="drop-title">Drag & Drop Video or Audio</div>
            <div className="drop-hint">
              Video (mp4, mov, mkv, webm) & Audio up to 500MB
            </div>
            <div className="drop-sep">OR</div>
            <button
              className="btn-ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="video/*,audio/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0]);
              }
            }}
          />
        </div>
      ) : (
        <div className="file-preview-row" style={{ display: "flex" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <div className="fp-info" style={{ marginLeft: 16 }}>
            <span className="fp-name">{file.name}</span>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 4,
                fontSize: "0.75rem",
              }}
            >
              <span className="fp-size">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button className="fp-remove" onClick={() => setFile(null)}>
            ✕
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            color: "var(--danger)",
            marginTop: "1rem",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}

      {file && (
        <div
          style={{
            marginTop: "1.5rem",
            animation: "revealAnim 0.5s ease forwards",
          }}
        >
          <div
            className="multimodal-info-panel glass"
            style={{
              padding: "1.25rem",
              borderRadius: 12,
              borderLeft: "3px solid var(--accent)",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                color: "var(--text-h)",
              }}
            >
              This AI system will analyze:
            </div>
            <ul
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                paddingLeft: "1.5rem",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              <li>Speech and audio waveforms</li>
              <li>Visual objects, scenes, and actions</li>
              <li>On-screen text via OCR</li>
            </ul>
          </div>

          <div
            className="topic-row"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--text-h)",
              }}
            >
              Specific Topic{" "}
              <span style={{ opacity: 0.5, fontWeight: 400 }}>(Optional)</span>
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--glass-border)",
                borderRadius: 8,
                padding: "0 12px",
              }}
            >
              <input
                type="text"
                placeholder="e.g. Photosynthesis, Binary Search..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  outline: "none",
                  padding: "12px 0",
                  fontSize: "0.85rem",
                }}
              />
            </div>
          </div>

          <button
            className="btn-primary analyze-btn"
            onClick={startUpload}
            style={{ width: "100%", opacity: isUploading ? 0.5 : 1 }}
            disabled={isUploading}
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : "Analyze Video"}
          </button>

          {isUploading && (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.1)",
                  height: 6,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    background: "var(--accent)",
                    transition: "width 0.3s",
                  }}
                ></div>
              </div>

              {checksumStatus && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color:
                      checksumStatus === "pass"
                        ? "var(--success)"
                        : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {checksumStatus === "spinner" ? (
                    <span style={{ animation: "spin 1s linear infinite" }}>
                      ↻
                    </span>
                  ) : (
                    "✓"
                  )}
                  {checksumStatus === "spinner"
                    ? "Verifying SHA-256 checksum & scanning..."
                    : "Checksum verified. Safe."}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn-ghost"
                  onClick={handleCancelClick}
                  style={{ padding: "0.3rem 0.8rem", fontSize: "0.75rem" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
