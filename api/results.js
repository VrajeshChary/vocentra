export default function handler(req, res) {
  res.status(200).json({
    transcript: "When you request a website, the DNS translates the domain name into an IP address, allowing your browser to connect to the correct server.",
    speakers: [{ speaker: "Presenter", start: 0, end: 12 }],
    visual_context: [
      {
        timestamp: "00:00",
        objects: ["dining table", "chair", "laptop"],
        actions: ["demonstrating"],
        ocr_text: ["DNS Basics", "Network Flow"],
        caption: "A presenter demonstrating domain name system lookup on a laptop."
      },
      {
        timestamp: "00:04",
        objects: ["laptop", "cloud server"],
        actions: ["explaining"],
        ocr_text: ["IP Address", "192.168.1.1"],
        caption: "Architecture diagram showing server resolution and browser handshake."
      }
    ],
    semantic_script: {
      metadata: { source: "Vocentra Multimodal Engine", version: "2.0-scalable" },
      scene: "general setting",
      characters: ["presenter"],
      global_context: {
        total_objects: ["dining table", "chair", "laptop", "cloud server"],
        primary_actions: ["demonstrating", "explaining"]
      },
      timeline: [
        {
          timestamp: "00:00",
          speech: "When you request a website, the DNS translates the domain name into an IP address...",
          objects: ["dining table", "chair", "laptop"],
          actions: ["demonstrating"],
          visual_text: ["DNS Basics", "Network Flow"],
          visual_context: "A presenter demonstrating domain name system lookup on a laptop."
        }
      ]
    },
    similarity_score: 0.94
  });
}
