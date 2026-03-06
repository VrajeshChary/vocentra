import React from "react";

export default function EvidenceCard({ time, labels, reason, thumbnail }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--glass-border)",
        borderRadius: 8,
        padding: "0.75rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 80,
          height: 60,
          borderRadius: 6,
          overflow: "hidden",
          background: "#000",
          position: "relative",
        }}
      >
        <img
          src={thumbnail || "https://via.placeholder.com/80x60?text=Thumb"}
          alt="Evidence"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: 4,
            fontSize: "0.65rem",
            background: "rgba(0,0,0,0.6)",
            padding: "0 4px",
            borderRadius: 4,
          }}
        >
          {time}s
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            marginBottom: "0.4rem",
          }}
        >
          {labels?.map((lbl, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.65rem",
                background: "var(--accent)",
                color: "#fff",
                padding: "1px 6px",
                borderRadius: 99,
              }}
            >
              {lbl}
            </span>
          ))}
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            lineHeight: 1.4,
          }}
        >
          {reason}
        </div>
      </div>
    </div>
  );
}
