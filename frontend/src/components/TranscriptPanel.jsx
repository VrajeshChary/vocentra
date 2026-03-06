import React, { useState } from "react";
import DOMPurify from "dompurify";

export default function TranscriptPanel({ data }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  if (!data?.transcript) return null;

  return (
    <div
      className="glass panel-block reveal"
      style={{ padding: "1.5rem", animationDelay: "0.4s" }}
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
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        </svg>
        Enhanced Transcript
      </div>

      <div
        className="transcript-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxHeight: 400,
          overflowY: "auto",
          paddingRight: "0.5rem",
          scrollbarWidth: "thin",
        }}
      >
        {data.transcript.map((item, idx) => {
          const isExpanded = expandedIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              style={{
                background: "rgba(255,255,255,0.03)",
                padding: "1rem",
                borderRadius: 8,
                borderLeft: "3px solid var(--accent)",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              className="hover:bg-white/10"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                  }}
                >
                  {item.speaker}
                </span>
                <span
                  style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
                >
                  {item.start}s - {item.end}s (
                  {(item.confidence * 100).toFixed(0)}%)
                </span>
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item.text),
                }}
                style={{
                  fontSize: "0.9rem",
                  margin: 0,
                  color: "var(--text)",
                  lineHeight: 1.5,
                }}
              />

              {isExpanded && (
                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px outset rgba(255,255,255,0.1)",
                    animation: "revealAnim 0.3s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.65rem",
                        padding: "2px 6px",
                        background: "var(--glass-border)",
                        borderRadius: 4,
                      }}
                    >
                      Evidence Match
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-ghost"
                      style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(item.text);
                      }}
                    >
                      📋 Copy snippet
                    </button>
                    <button
                      className="btn-ghost"
                      style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}
                    >
                      ⏱ Jump to video
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
