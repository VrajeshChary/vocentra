import React from "react";
import { motion } from "framer-motion";

export default function SkeletonLoader({ type = "panel", lines = 3 }) {
  const baseStyle = {
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
    backgroundSize: "200% 100%",
    borderRadius: 8,
  };

  const animation = {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: { repeat: Infinity, duration: 2, ease: "linear" },
  };

  if (type === "video") {
    return (
      <motion.div
        animate={animation}
        style={{
          ...baseStyle,
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: 12,
        }}
      />
    );
  }

  if (type === "score") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          padding: "2rem",
        }}
      >
        <motion.div
          animate={animation}
          style={{ ...baseStyle, width: 150, height: 150, borderRadius: "50%" }}
        />
        <motion.div
          animate={animation}
          style={{ ...baseStyle, width: "80%", height: 20 }}
        />
      </div>
    );
  }

  // Panel / Text mode
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1.5rem",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 12,
      }}
    >
      <motion.div
        animate={animation}
        style={{
          ...baseStyle,
          width: "40%",
          height: 24,
          marginBottom: "0.5rem",
        }}
      />
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          animate={animation}
          style={{
            ...baseStyle,
            width: i % 2 === 0 ? "100%" : "85%",
            height: 16,
          }}
        />
      ))}
    </div>
  );
}
