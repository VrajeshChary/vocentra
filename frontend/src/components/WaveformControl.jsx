import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export default function WaveformControl() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgba(255, 255, 255, 0.2)",
      progressColor: "#3b82f6",
      cursorColor: "#8b5cf6",
      height: 40,
      barWidth: 2,
      barRadius: 2,
      normalize: true,
    });

    // Load mock audio url
    wavesurfer.load(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    );

    return () => wavesurfer.destroy();
  }, []);

  return (
    <div
      style={{
        marginTop: "1rem",
        background: "rgba(0,0,0,0.2)",
        borderRadius: 8,
        padding: "0.5rem",
      }}
    >
      <div ref={containerRef} style={{ width: "100%" }}></div>
    </div>
  );
}
