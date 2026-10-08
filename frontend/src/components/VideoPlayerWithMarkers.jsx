import React, { useRef, useState, useEffect } from "react";

export default function VideoPlayerWithMarkers({ data }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(25); // Mock fallback duration
  const [videoSrc, setVideoSrc] = useState(
    () => sessionStorage.getItem("vocentra_uploaded_video_url") || "/assets/sample_lecture.mp4"
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () =>
        setDuration(videoRef.current.duration || 25);
    }

    const handleKeyDown = (e) => {
      // Point 9: Keyboard shortcuts
      if (!videoRef.current) return;

      // Ignore if typing in input somewhere else
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      )
        return;

      if (e.code === "Space") {
        e.preventDefault();
        videoRef.current.paused
          ? videoRef.current.play()
          : videoRef.current.pause();
      } else if (e.code === "ArrowRight") {
        videoRef.current.currentTime += e.shiftKey ? 30 : 5;
      } else if (e.code === "ArrowLeft") {
        videoRef.current.currentTime -= e.shiftKey ? 30 : 5;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMarkerClick = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const markers =
    data?.transcript?.map((t, i) => {
      const pct = (t.start / duration) * 100;
      return (
        <div
          key={`trans-${i}`}
          title={`Speech: ${t.speaker} at ${t.start}s`}
          onClick={() => handleMarkerClick(t.start)}
          style={{
            position: "absolute",
            left: `${Math.min(pct, 98)}%`,
            top: "50%",
            transform: "translateY(-50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 5px var(--accent)",
            cursor: "pointer",
            zIndex: 10,
          }}
        />
      );
    }) || [];

  return (
    <div className="glass panel-block reveal" style={{ padding: "1.5rem" }}>
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
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
        Video Analysis
      </div>

      <div
        className="video-container"
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          background: "#000",
          aspectRatio: "16/9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <video
          ref={videoRef}
          controls
          src={videoSrc}
          crossOrigin="anonymous"
          onError={() => {
            if (videoSrc !== "/assets/sample_lecture.mp4") {
              setVideoSrc("/assets/sample_lecture.mp4");
            }
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
          }}
        ></video>
      </div>

      <div
        className="timeline-track"
        style={{
          position: "relative",
          height: 12,
          borderRadius: 6,
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--glass-border)",
          marginTop: "1.25rem",
        }}
      >
        {markers}
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          textAlign: "right",
          marginTop: "0.4rem",
        }}
      >
        Click markers to jump to events
      </div>
    </div>
  );
}
