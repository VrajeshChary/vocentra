/* ============================================================
   VOCENTRA V3 — script.js
   Dark/Light Mode · Upload · Processing · Results · Confetti
   ============================================================ */

// ── Theme System ──────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem("vc_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  updateToggleIcon(saved);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("vc_theme", next);
  updateToggleIcon(next);
}

function updateToggleIcon(theme) {
  const icon = document.getElementById("toggleIcon");
  if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("themeToggle");
  if (btn) btn.addEventListener("click", toggleTheme);
});

// ── Console Search Overlay (Cmd+K) ────────────────────────────
function initConsoleSearch() {
  const overlay = document.getElementById("consoleOverlay");
  const input = document.getElementById("consoleInput");
  if (!overlay || !input) return;

  function openConsole() {
    overlay.classList.add("active");
    setTimeout(() => {
      input.focus();
    }, 100);
  }

  function closeConsole() {
    overlay.classList.remove("active");
    input.value = "";
    input.blur();
  }

  // Keyboard triggers
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (overlay.classList.contains("active")) closeConsole();
      else openConsole();
    }
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeConsole();
    }
  });

  // Click outside to close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeConsole();
  });
}
document.addEventListener("DOMContentLoaded", initConsoleSearch);

// ── File Upload ───────────────────────────────────────────────
let selectedFile = null;

document.addEventListener("DOMContentLoaded", () => {
  const dropArea = document.getElementById("dropArea");
  const fileInput = document.getElementById("fileInput");
  if (!dropArea) return;

  ["dragenter", "dragover"].forEach((e) =>
    dropArea.addEventListener(e, (ev) => {
      ev.preventDefault();
      dropArea.classList.add("over");
    }),
  );
  ["dragleave", "drop"].forEach((e) =>
    dropArea.addEventListener(e, (ev) => {
      ev.preventDefault();
      dropArea.classList.remove("over");
    }),
  );
  dropArea.addEventListener("drop", (e) => {
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("video/")) handleFile(f);
  });
  dropArea.addEventListener("click", () => fileInput && fileInput.click());
  if (fileInput)
    fileInput.addEventListener("change", (e) => {
      if (e.target.files[0]) handleFile(e.target.files[0]);
    });
});

function handleFile(file) {
  selectedFile = file;
  hide("dropArea");
  show("filePreview");
  show("topicRow");
  show("analyzeBtn");
  show("mmInfoPanel");
  setTxt("fpName", file.name);
  setTxt("fpSize", fmtBytes(file.size));

  const isVideo = file.type.startsWith("video/");
  const vidEl = document.getElementById("vidPreview");
  const audIcon = document.getElementById("audPreviewIcon");

  if (vidEl) {
    vidEl.style.display = isVideo ? "block" : "none";
    if (audIcon) audIcon.style.display = isVideo ? "none" : "block";

    const url = URL.createObjectURL(file);
    if (isVideo) {
      vidEl.src = url;
      vidEl.onloadedmetadata = () => {
        setTxt("fpResolution", `${vidEl.videoWidth}x${vidEl.videoHeight}`);
        setTxt("fpDuration", formatTime(vidEl.duration));
      };
    } else {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setTxt("fpResolution", "Audio Track");
        setTxt("fpDuration", formatTime(audio.duration));
      };
    }
  }
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function removeFile() {
  selectedFile = null;
  show("dropArea");
  hide("filePreview");
  hide("topicRow");
  hide("analyzeBtn");
  hide("mmInfoPanel");
  const fi = document.getElementById("fileInput");
  if (fi) fi.value = "";
  const vidEl = document.getElementById("vidPreview");
  if (vidEl) vidEl.src = "";
}

// ── Upload & Processing ───────────────────────────────────────
async function uploadVideo() {
  if (!selectedFile) return;
  const topic = document.getElementById("topicInput")?.value.trim() || "";

  hide("uploadWrap");
  show("procWrap");

  await runProcessing();

  try {
    const fd = new FormData();
    fd.append("video", selectedFile);
    if (topic) fd.append("topic", topic);
    const res = await fetch("/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("no backend");
    const data = await res.json();
    sessionStorage.setItem("vc_result", JSON.stringify(data));
    sessionStorage.setItem("vc_topic", topic || data.topic || "General");
    sessionStorage.setItem("vc_duration", data.duration || "—");
  } catch {
    const mock = mockData(topic || "Photosynthesis");
    sessionStorage.setItem("vc_result", JSON.stringify(mock));
    sessionStorage.setItem("vc_topic", topic || "Photosynthesis");
    sessionStorage.setItem("vc_duration", "0:42");
  }

  window.location.href = "result.html";
}

function runProcessing() {
  return new Promise((resolve) => {
    const steps = [
      { msg: "Uploading...", pct: 10, dur: 500 },
      { msg: "Extracting audio track...", pct: 20, dur: 500 },
      { msg: "Transcribing speech to text...", pct: 30, dur: 600 },
      { msg: "Analyzing video frames...", pct: 40, dur: 600 },
      { msg: "Running object detection...", pct: 50, dur: 600 },
      { msg: "Understanding scene context...", pct: 60, dur: 600 },
      { msg: "Extracting on-screen text...", pct: 70, dur: 600 },
      { msg: "Fusing multimodal semantics...", pct: 85, dur: 800 },
      { msg: "Calculating similarity scores...", pct: 95, dur: 600 },
      { msg: "Finalizing results...", pct: 100, dur: 500 },
    ];
    const arc = document.getElementById("procArc");
    const pct = document.getElementById("procPct");
    const sub = document.getElementById("procSub");
    let elapsed = 0;

    steps.forEach((step, i) => {
      setTimeout(() => {
        // Complete previous step
        if (i > 0) {
          const prev = document.getElementById("ps_" + (i - 1));
          if (prev) {
            prev.classList.remove("active");
            prev.classList.add("done");
          }
        }
        // Activate current
        const item = document.getElementById("ps_" + i);
        if (item) item.classList.add("active");
        if (sub) sub.textContent = step.msg;

        // Animate arc
        animateArc(arc, pct, step.pct, step.dur * 0.75);

        if (i === steps.length - 1) {
          setTimeout(() => {
            const item = document.getElementById("ps_" + i);
            if (item) {
              item.classList.remove("active");
              item.classList.add("done");
            }
            resolve();
          }, step.dur);
        }
      }, elapsed);
      elapsed += step.dur;
    });
  });
}

function animateArc(arc, pctEl, target, duration) {
  if (!arc) return;
  const circ = 239;
  arc.style.transition = `stroke-dashoffset ${duration}ms ease`;
  arc.style.strokeDashoffset = circ - (target / 100) * circ;

  const start = parseInt(pctEl?.textContent || "0");
  const diff = target - start;
  const steps = 40;
  let count = 0;
  const timer = setInterval(() => {
    count++;
    if (pctEl) pctEl.textContent = Math.round(start + (diff / steps) * count);
    if (count >= steps) clearInterval(timer);
  }, duration / steps);
}

// ── Results Page ──────────────────────────────────────────────
function initResults() {
  if (!document.getElementById("verdictText")) return; // Only run on legacy non-React page
  const raw = sessionStorage.getItem("vc_result");
  const data = raw ? JSON.parse(raw) : mockData();

  // Populate overall score
  const grade = getGrade(data.score || 0);
  setTxt("verdictText", grade.label);
  const verdict = document.getElementById("scoreVerdict");
  if (verdict) verdict.style.color = grade.color;
  setTxt("scoreEvidence", data.evidence || "No summary evidence provided.");

  setTimeout(() => {
    animateScoreRing(data.score || 0);
    // Breakdown
    animateBar("speechBar", "speechPct", data.breakdown?.speech || 0);
    animateBar("visualBar", "visualPct", data.breakdown?.visual || 0);
    animateBar("semanticBar", "semanticPct", data.breakdown?.semantic || 0);

    // Confidence
    animateBar("confSpeechBar", "confSpeechPct", data.confidence?.speech || 0);
    animateBar("confObjBar", "confObjPct", data.confidence?.object || 0);
    animateBar("confSceneBar", "confScenePct", data.confidence?.scene || 0);
    animateBar("confOcrBar", "confOcrPct", data.confidence?.ocr || 0);
  }, 350);

  // Populate Objects
  const objGrid = document.getElementById("objectGrid");
  if (objGrid && data.objects) {
    objGrid.innerHTML = data.objects
      .map(
        (o) => `
      <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; padding: 0.6rem; font-size: 0.75rem;">
        <div style="color: var(--text-h); font-weight: 600;">${o.label}</div>
        <div style="color: var(--text-muted); font-size: 0.65rem; display: flex; justify-content: space-between; margin-top: 0.3rem;">
          <span>Conf: ${Math.round(o.conf * 100)}%</span>
          <span>@ ${formatTime(o.time)}</span>
        </div>
      </div>
    `,
      )
      .join("");
  }

  // Populate OCR
  const ocrList = document.getElementById("ocrList");
  if (ocrList && data.ocr_text) {
    ocrList.innerHTML = data.ocr_text
      .map(
        (o) => `
      <div style="background: rgba(99,179,237,0.05); border-left: 2px solid #63b3ed; padding: 0.5rem 0.8rem; border-radius: 4px; font-size: 0.75rem;">
        <div style="color: var(--text-secondary); font-family: monospace; letter-spacing: 0.05em; font-weight: 600;">"${o.text}"</div>
        <div style="color: var(--text-muted); font-size: 0.65rem; margin-top: 0.2rem;">@ ${formatTime(o.time)}</div>
      </div>
    `,
      )
      .join("");
  }

  // Populate Transcript
  const trList = document.getElementById("transcriptList");
  if (trList && data.transcript) {
    trList.innerHTML = data.transcript
      .map(
        (t) => `
      <div style="display: flex; gap: 0.8rem; font-size: 0.8rem;">
        <div style="color: var(--accent); font-weight: 600; width: 40px; flex-shrink: 0;">${formatTime(t.time)}</div>
        <div style="color: var(--text-secondary); line-height: 1.5;">${t.text}</div>
      </div>
    `,
      )
      .join("");
  }

  // Populate Scenes
  const sceneTags = document.getElementById("sceneTags");
  if (sceneTags && data.scenes) {
    sceneTags.innerHTML = data.scenes
      .map(
        (s) => `
      <span style="background: rgba(246,173,85,0.1); border: 1px solid rgba(246,173,85,0.3); color: #f6ad55; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.72rem;">${s}</span>
    `,
      )
      .join("");
  }

  // Populate Actions
  const actionList = document.getElementById("actionList");
  if (actionList && data.actions) {
    actionList.innerHTML = data.actions
      .map(
        (a) => `
      <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.75rem; color: var(--text-secondary);">
        <span style="background: rgba(255,255,255,0.1); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: monospace;">${formatTime(a.time)}</span>
        <span>${a.action}</span>
      </div>
    `,
      )
      .join("");
  }

  // Populate Event Timeline & Markers
  const navLine = document.getElementById("narrativeTimeline");
  const markers = document.getElementById("eventMarkers");
  if (data.events) {
    if (navLine) {
      navLine.innerHTML = data.events
        .map(
          (e, idx) => `
        <div style="display: flex; gap: 0.8rem; position: relative; animation: revealAnim 0.5s ${idx * 0.1}s ease forwards; opacity: 0;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 6px var(--accent-glow); margin-top: 0.3rem;"></div>
            <div style="width: 2px; flex: 1; background: var(--glass-border); margin-top: 5px; min-height: 30px;"></div>
          </div>
          <div style="padding-bottom: 1rem;">
            <div style="font-size: 0.7rem; color: var(--accent); font-weight: 700; text-transform: uppercase;">${formatTime(e.time)} — ${e.type}</div>
            <div style="font-size: 0.82rem; color: var(--text-h); margin-top: 0.2rem;">${e.desc}</div>
          </div>
        </div>
      `,
        )
        .join("");
    }

    if (markers) {
      // Assuming a mock 60 second video for proportional marker layout
      const videoDuration = 60;
      markers.innerHTML = data.events
        .map((e) => {
          const pct = Math.min((e.time / videoDuration) * 100, 100);
          let color = "#3b82f6";
          if (e.type === "action") color = "#68d391";
          if (e.type === "ocr") color = "#ed64a6";
          if (e.type === "scene") color = "#f6ad55";

          return `<div title="${e.type}: ${e.desc}" style="position: absolute; left: ${pct}%; top: -3px; width: 6px; height: 18px; border-radius: 3px; background: ${color}; transform: translateX(-50%); box-shadow: 0 0 4px ${color};"></div>`;
        })
        .join("");
    }
  }

  if ((data.score || 0) >= 70) setTimeout(fireConfetti, 1400);

  // Set up Video Player if available in session
  const resultVid = document.getElementById("resultVideo");
  const msg = document.getElementById("noVideoMsg");
  // In a real flow, blob url might be lost on navigation, but we simulate it:
  if (resultVid) {
    if (sessionStorage.getItem("vc_vidUrl")) {
      resultVid.src = sessionStorage.getItem("vc_vidUrl");
      if (msg) msg.style.display = "none";
    }
  }
}

function animateScoreRing(target) {
  const arc = document.getElementById("scoreArc");
  const val = document.getElementById("scoreVal");
  if (!arc) return;

  const circ = 515;
  setTimeout(() => {
    arc.style.transition = "stroke-dashoffset 2s cubic-bezier(0.22,1,0.36,1)";
    arc.style.strokeDashoffset = circ - (target / 100) * circ;
  }, 200);

  let cur = 0;
  const inc = target / 80;
  const timer = setInterval(() => {
    cur = Math.min(cur + inc, target);
    if (val) val.textContent = Math.round(cur);
    if (cur >= target) clearInterval(timer);
  }, 16);
}

function animateBar(barId, pctId, value) {
  setTimeout(() => {
    const bar = document.getElementById(barId);
    const pct = document.getElementById(pctId);
    const v = Math.min(Math.max(value, 0), 100);
    if (bar) bar.style.width = v + "%";
    if (pct) pct.textContent = v + "%";
  }, 600);
}

function mockData() {
  return {
    score: 88,
    breakdown: { speech: 92, visual: 85, semantic: 89 },
    evidence:
      "Strong alignment between spoken content and recognized visual elements. The visual scenes correctly matched the described environments, and on-screen diagrams correlated with the speech track.",
    confidence: { speech: 95, object: 88, scene: 82, ocr: 91 },
    transcript: [
      { text: "Welcome to the system architecture overview.", time: 2.5 },
      {
        text: "On the left side, we have our client applications running on mobile.",
        time: 8.1,
      },
      {
        text: "These connect through the load balancer into our microservices.",
        time: 15.4,
      },
      { text: "The database cluster maintains the core state.", time: 25.8 },
    ],
    objects: [
      { label: "Laptop Screen", conf: 0.94, time: 2.1 },
      { label: "Whiteboard", conf: 0.89, time: 7.4 },
      { label: "Server rack", conf: 0.76, time: 18.2 },
    ],
    scenes: ["Office Workspace", "Presentation Room", "Data Center"],
    actions: [
      { action: "Drawing on whiteboard", time: 8.5 },
      { action: "Pointing to screen", time: 16.0 },
    ],
    ocr_text: [
      { text: "System Architecture Diagram", time: 3.0 },
      { text: "API Gateway", time: 14.5 },
      { text: "PostgreSQL Cluster", time: 26.0 },
    ],
    events: [
      { time: 2.5, type: "speech", desc: "Introduction to architecture" },
      { time: 3.0, type: "ocr", desc: "Title text recognized" },
      { time: 8.5, type: "action", desc: "User interacts with board" },
      { time: 18.2, type: "scene", desc: "Visual transition to data center" },
    ],
  };
}

// ── Confetti ──────────────────────────────────────────────────
function fireConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = [
    "#63b3ed",
    "#7c3aed",
    "#9f7aea",
    "#ed64a6",
    "#fff",
    "#ecc94b",
  ];
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    w: Math.random() * 9 + 4,
    h: Math.random() * 14 + 6,
    rot: Math.random() * 360,
    vx: (Math.random() - 0.5) * 3.5,
    vy: Math.random() * 3.5 + 2,
    vr: (Math.random() - 0.5) * 7,
    col: COLORS[Math.floor(Math.random() * COLORS.length)],
    op: 1,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (frame > 110) p.op -= 0.013;
      if (p.op > 0 && p.y < canvas.height + 20) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.op);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });
    frame++;
    if (alive) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ── Stat counter (index page) ─────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count);
    let cur = 0;
    const inc = target / 65;
    const timer = setInterval(() => {
      cur = Math.min(cur + inc, target);
      el.textContent = Math.round(cur);
      if (cur >= target) clearInterval(timer);
    }, 18);
  });
});

// ── Helpers ───────────────────────────────────────────────────
function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "";
}
function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}
function setTxt(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function fmtBytes(b) {
  return b < 1048576
    ? (b / 1024).toFixed(1) + " KB"
    : (b / 1048576).toFixed(1) + " MB";
}
function getGrade(score) {
  if (score >= 90)
    return { label: "Excellent — Outstanding explanation", color: "#68d391" };
  if (score >= 80)
    return {
      label: "Strong — Great conceptual understanding",
      color: "#63b3ed",
    };
  if (score >= 65)
    return { label: "Good — A few conceptual gaps remain", color: "#63b3ed" };
  if (score >= 50)
    return {
      label: "Partial — Core ideas partially covered",
      color: "#f6ad55",
    };
  return { label: "Developing — Needs significant work", color: "#fc8181" };
}

// ── Auto-init results page ────────────────────────────────────
if (document.body.classList.contains("page-result")) {
  document.addEventListener("DOMContentLoaded", initResults);
}
