import React, { useState } from "react";
import DOMPurify from "dompurify";

export default function VisualContextPanel({ data }) {
  const [activeTab, setActiveTab] = useState("all");
  const [ocrSearch, setOcrSearch] = useState("");

  if (!data?.visual_context || data.visual_context.length === 0) return null;

  const currentSegment = data.visual_context[0]; // Simplified for demo

  // OCR highlighting logic
  const highlightOcr = (text) => {
    if (!ocrSearch) return text;
    const regex = new RegExp(`(${ocrSearch})`, "gi");
    return text.replace(
      regex,
      `<mark style="background: var(--accent); color: white; border-radius: 2px; padding: 0 2px">$1</mark>`,
    );
  };
  const objects = data.visual_context.flatMap((vc) => vc.objects || []);
  const scenes = data.visual_context.map((vc) => vc.scene).filter(Boolean);
  const uniqueScenes = [...new Set(scenes)];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Objects Panel */}
      <div
        className="glass panel-block reveal"
        style={{ animationDelay: "0.2s", padding: "1.5rem" }}
      >
        <div
          className="panel-title"
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          Detected Objects
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            maxHeight: 250,
            overflowY: "auto",
          }}
        >
          {objects.map((obj, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.75rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--glass-border)",
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--text-h)",
                }}
              >
                {typeof obj === "string" ? obj : obj.label}
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--accent)" }}>
                {typeof obj === "string"
                  ? "95%"
                  : (obj.conf * 100).toFixed(0) + "%"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scenes Panel */}
      <div
        className="glass panel-block reveal"
        style={{ animationDelay: "0.5s", padding: "1.5rem" }}
      >
        <div
          className="panel-title"
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
            <line x1="9" y1="3" x2="9" y2="18"></line>
            <line x1="15" y1="6" x2="15" y2="21"></line>
          </svg>
          Visual Scenes
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {uniqueScenes.map((scene, i) => (
            <div
              key={i}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: 99,
                background: "var(--glass-border)",
                fontSize: "0.75rem",
                color: "var(--text)",
              }}
            >
              {scene}
            </div>
          ))}
        </div>
      </div>

      {/* OCR Panel */}
      {(activeTab === "all" || activeTab === "ocr") && currentSegment.ocr && (
        <div
          className="glass panel-block reveal"
          style={{ animationDelay: "0.8s", padding: "1.5rem" }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Detected Text (OCR)</span>
              <input
                type="text"
                placeholder="Search OCR..."
                value={ocrSearch}
                onChange={(e) => setOcrSearch(e.target.value)}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid var(--glass-border)",
                  color: "white",
                  padding: "0.2rem 0.5rem",
                  borderRadius: 4,
                  fontSize: "0.75rem",
                  width: 120,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                maxHeight: 250,
                overflowY: "auto",
              }}
            >
              {currentSegment.ocr.map((text, i) => {
                // Filter logic
                if (
                  ocrSearch &&
                  !text.toLowerCase().includes(ocrSearch.toLowerCase())
                )
                  return null;

                return (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: 6,
                      fontSize: "0.8rem",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text)",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(highlightOcr(text)),
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
