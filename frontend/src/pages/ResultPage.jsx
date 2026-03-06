import React, { useState, useEffect, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { fetchResults } from "../services/apiClient";

// Lazily Load Panels for Performance (Step 18)
const VideoPlayerWithMarkers = lazy(
  () => import("../components/VideoPlayerWithMarkers"),
);
const TranscriptPanel = lazy(() => import("../components/TranscriptPanel"));
const VisualContextPanel = lazy(
  () => import("../components/VisualContextPanel"),
);
const SimilarityPanel = lazy(() => import("../components/SimilarityPanel"));
const DiagnosticsPanel = lazy(() => import("../components/DiagnosticsPanel"));

// Modals can be static or lazy, keeping static for fast interactions
import SettingsModal from "../components/SettingsModal";
import ModalExport from "../components/ModalExport";

function ResultApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("job_id") || "mock-id";

    fetchResults(jobId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch results", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div
        style={{ textAlign: "center", padding: "5rem", color: "var(--danger)" }}
      >
        <h2>Error Loading Results</h2>
        <p>{error}</p>
        <a
          href="/upload.html"
          className="btn-secondary"
          style={{ marginTop: "1rem" }}
        >
          Try Again
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", padding: "5rem", color: "var(--text)" }}
      >
        <div className="proc-orb" style={{ margin: "0 auto 2rem" }}>
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
          ></div>
        </div>
        <h2>Loading Results...</h2>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          justifyContent: "flex-end",
        }}
      >
        <SettingsModal />
        <ModalExport data={data} />
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
                color: "var(--text-secondary)",
              }}
            >
              <div
                className="proc-ring"
                style={{
                  animation: "spin 2s linear infinite",
                  width: 30,
                  height: 30,
                  margin: "0 auto",
                  borderRadius: "50%",
                  border: "2px solid var(--accent)",
                  borderTopColor: "transparent",
                }}
              ></div>
            </div>
          }
        >
          {/* Left Column */}
          <div
            className="d-col-main"
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <VideoPlayerWithMarkers data={data} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <VisualContextPanel data={data} />
              <TranscriptPanel data={data} />
            </div>

            <DiagnosticsPanel data={data} />
          </div>

          {/* Right Column */}
          <div
            className="d-col-sidebar"
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <SimilarityPanel data={data} />
          </div>
        </Suspense>
      </div>
    </>
  );
}

const rootElement = document.getElementById("result-root");
if (rootElement) {
  createRoot(rootElement).render(<ResultApp />);
}
