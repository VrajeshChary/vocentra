import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export default function SettingsModal() {
  const [open, setOpen] = useState(false);
  const [localMode, setLocalMode] = useState(false);
  const [inspectorMode, setInspectorMode] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn-ghost" style={{ fontSize: "0.75rem" }}>
          ⚙ Settings
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          }}
        />
        <Dialog.Content
          className="glass"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "2rem",
            width: "90vw",
            maxWidth: 450,
            borderRadius: 12,
            zIndex: 1001,
          }}
        >
          <Dialog.Title
            style={{
              marginBottom: "1rem",
              fontSize: "1.25rem",
              color: "var(--text-h)",
            }}
          >
            Analysis Preferences
          </Dialog.Title>
          <Dialog.Description
            style={{
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Configure privacy boundaries for your video analysis.
          </Dialog.Description>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={localMode}
                onChange={(e) => setLocalMode(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--accent)" }}
              />
              <span style={{ fontSize: "0.9rem", color: "var(--text)" }}>
                Process Locally / On-Prem
              </span>
            </label>
            {localMode && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 6,
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                Features disabled: Cloud LLM fallback, Link Sharing.
              </div>
            )}

            {/* Point 30: Inspector Mode Wow factor */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              <input
                type="checkbox"
                checked={inspectorMode}
                onChange={(e) => {
                  setInspectorMode(e.target.checked);
                  if (e.target.checked)
                    document.body.classList.add("inspector-active");
                  else document.body.classList.remove("inspector-active");
                }}
                style={{ width: 18, height: 18, accentColor: "var(--accent)" }}
              />
              <span style={{ fontSize: "0.9rem", color: "var(--text)" }}>
                Enable Inspector Mode (Show Model Architecture & LLM Logic)
              </span>
            </label>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Dialog.Close asChild>
              <button
                className="btn-primary"
                style={{ padding: "0.5rem 1rem" }}
              >
                Save Changes
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
