import React, { useEffect, useState } from "react";

export default function SimilarityPanel({ data }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!data) return;
    const target = Math.round(data.similarity.overall * 100);
    setTimeout(() => setPercent(target), 500);
  }, [data]);

  if (!data) return <div className="score-panel glass reveal">Loading...</div>;

  const bDown = data.similarity.breakdown;

  return (
    <div
      className="score-panel glass reveal"
      style={{ animationDelay: "0.1s", padding: "1.5rem", borderRadius: 16 }}
    >
      <div
        className="panel-title"
        style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
          marginBottom: "1.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Multimodal Similarity
      </div>

      <div
        className="score-ring-wrap"
        style={{
          position: "relative",
          width: 176,
          height: 176,
          margin: "0 auto 1.8rem",
        }}
      >
        <svg
          className="score-ring-svg"
          viewBox="0 0 200 200"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="sRG2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="var(--glass-border)"
            strokeWidth="13"
          />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#sRG2)"
            strokeWidth="13"
            strokeDasharray="515"
            strokeDashoffset={515 - (515 * percent) / 100}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            style={{
              transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </svg>
        <div
          className="score-ring-inner"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3rem",
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {percent}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              %
            </span>
          </div>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              marginTop: "0.2rem",
            }}
          >
            overall alignment
          </span>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "0.85rem",
          fontWeight: 600,
        }}
      >
        <span style={{ color: "var(--accent)" }}>✦</span> Strong Understanding
      </div>

      <div
        className="score-bars"
        style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
      >
        <BarRow label="Speech Match" value={bDown.speech * 100} />
        <BarRow label="Visual Context" value={bDown.visual * 100} />
        <BarRow label="Semantic" value={bDown.ocr * 100} />
      </div>
    </div>
  );
}

function BarRow({ label, value }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    setTimeout(() => setW(value), 600);
  }, [value]);
  return (
    <div
      className="sb-row"
      style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
    >
      <span
        className="sb-label"
        style={{
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          width: 75,
        }}
      >
        {label}
      </span>
      <div
        className="sb-track"
        style={{
          flex: 1,
          height: 5,
          background: "var(--glass-border)",
          borderRadius: 999,
        }}
      >
        <div
          className="sb-fill"
          style={{
            height: "100%",
            background: "var(--accent-gradient)",
            width: `${w}%`,
            borderRadius: 99,
            transition: "width 1.5s ease",
          }}
        ></div>
      </div>
      <span
        className="sb-pct"
        style={{
          fontSize: "0.73rem",
          color: "var(--accent)",
          fontWeight: 700,
          width: 30,
          textAlign: "right",
        }}
      >
        {Math.round(value)}%
      </span>
    </div>
  );
}
