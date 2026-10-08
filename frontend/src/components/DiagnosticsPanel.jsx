import React, { useState } from "react";

export default function DiagnosticsPanel({ data }) {
  const [showDebug, setShowDebug] = useState(false);

  if (!data?.processing) return null;

  return (
    <div
      className="glass panel-block reveal"
      style={{ padding: "1.5rem", animationDelay: "0.6s" }}
    >
      <div
        className="panel-title"
        style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "1rem",
        }}
      >
        Diagnostics & Processing Metrics
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        {(data.processing?.stages || data.processing?.steps || []).map((stage, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              borderBottom: "1px solid var(--glass-border)",
              paddingBottom: "0.5rem",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>{stage.name || stage.label || `Stage ${i + 1}`}</span>
            <span
              style={{
                color:
                  (stage.status === "success" || stage.status === "completed")
                    ? "var(--success)"
                    : "var(--danger)",
              }}
            >
              {stage.duration !== undefined ? `${stage.duration}s` : `${stage.progress || 100}%`}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button
          className="btn-ghost"
          style={{
            fontSize: "0.75rem",
            padding: "0.4rem 1rem",
            marginRight: "1rem",
          }}
        >
          Re-run High-Quality Pass
        </button>
        <button
          className="btn-ghost"
          onClick={() => setShowDebug(!showDebug)}
          style={{ fontSize: "0.75rem", padding: "0.4rem 1rem" }}
        >
          {showDebug ? "Hide Debug Data" : "Show Developer Debug"}
        </button>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Raw System Context:</span>
          <span style={{ color: "var(--accent)" }}>
            Pipeline: {data.processing.version || "2.1-prod"}
          </span>
        </div>
        <pre
          style={{
            background: "rgba(0,0,0,0.5)",
            padding: "1.2rem",
            borderRadius: "8px",
            fontSize: "0.7rem",
            fontFamily: "monospace",
            color: "#33ff33",
            overflowX: "auto",
            maxHeight: "350px",
            overflowY: "auto",
            border: "1px solid rgba(51, 255, 51, 0.2)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
