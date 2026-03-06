import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export default function ModalExport({ data }) {
  const [open, setOpen] = useState(false);

  const handleExport = (format) => {
    if (format === "json") {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vocentra_analysis_${data?.video_id || "export"}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
      // For Hackathon purposes, window "Print to PDF" is a reliable quick path
      window.print();
    }
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="btn-primary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
        >
          Export Report
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
            Export Evaluation
          </Dialog.Title>
          <Dialog.Description
            style={{
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
            }}
          >
            Download the semantic analysis report including timeline markers and
            score breakdown.
          </Dialog.Description>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <button
              onClick={() => handleExport("pdf")}
              className="btn-ghost"
              style={{ flex: 1 }}
            >
              Download PDF
            </button>
            <button
              onClick={() => handleExport("json")}
              className="btn-ghost"
              style={{ flex: 1 }}
            >
              Download JSON
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <button className="btn-ghost" style={{ padding: "0.5rem 1rem" }}>
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
