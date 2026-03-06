const API_BASE = "http://localhost:8000";

/**
 * Transforms backend standardized JSON to the format expected by the UI panels
 */
const adaptBackendData = (backendData) => {
  return {
    video_id: "vid-" + Date.now(),
    transcript:
      (backendData.speakers || []).length > 0
        ? backendData.speakers.map((s) => ({
            start: s.start,
            end: s.end,
            speaker: s.speaker,
            text: backendData.transcript || "",
            confidence: 0.95,
          }))
        : [
            {
              start: 0,
              end: 10,
              speaker: "Speaker 1",
              text: backendData.transcript || "",
              confidence: 0.9,
            },
          ],
    visual_context: (backendData.visual_context || []).map((ctx, i) => ({
      start: i * 2, // Approximate for UI
      end: (i + 1) * 2,
      timestamp: ctx.timestamp,
      objects: ctx.objects || [],
      scene: "Scene " + (i + 1),
      actions: ctx.actions || [],
      ocr: ctx.ocr_text || [], // Map backend ocr_text to UI ocr
      caption: ctx.caption,
      thumbnail_url: "",
    })),

    similarity: {
      overall: backendData.similarity_score || 0,
      breakdown: {
        speech: backendData.similarity_score || 0,
        visual: 0.85,
        ocr: 0.8,
        temporal: 0.9,
      },
    },
    processing: {
      steps: [
        {
          id: "upload",
          label: "Video Upload",
          status: "completed",
          progress: 100,
        },
        {
          id: "audio",
          label: "Speech Analysis",
          status: "completed",
          progress: 100,
        },
        {
          id: "visual",
          label: "Visual Context",
          status: "completed",
          progress: 100,
        },
        {
          id: "semantic",
          label: "Semantic Fusion",
          status: "completed",
          progress: 100,
        },
      ],
    },
  };
};

export const uploadVideo = async (file, topic = "", signal = null) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("reference_answer", topic || "No specific topic provided");

  const res = await fetch(`${API_BASE}/upload-video`, {
    method: "POST",
    body: formData,
    signal: signal,
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  return await res.json(); // Returns { job_id, status }
};

export const getJobStatus = async (jobId) => {
  const res = await fetch(`${API_BASE}/status/${jobId}`);
  if (!res.ok) return { status: "error" };
  return await res.json();
};

export const getJobResults = async (jobId) => {
  const res = await fetch(`${API_BASE}/results/${jobId}`);
  if (!res.ok) throw new Error("Failed to fetch results");

  const rawData = await res.json();
  const adapted = adaptBackendData(rawData);

  // Cache for result page
  sessionStorage.setItem("vocentra_latest_result", JSON.stringify(adapted));
  return adapted;
};

export const fetchResults = async (jobId) => {
  const storedData = sessionStorage.getItem("vocentra_latest_result");
  if (storedData) return JSON.parse(storedData);

  // Fallback to fetching if we have a real jobId
  if (jobId && jobId !== "mock-id") {
    return await getJobResults(jobId);
  }

  // For demo/dev
  const { default: sampleResponse } =
    await import("../mocks/sample_response.json");
  return sampleResponse;
};

export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return { status: res.ok ? "ok" : "error", local: true };
  } catch (error) {
    return { status: "error" };
  }
};
