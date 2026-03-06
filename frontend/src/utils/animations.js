/* ============================================================
   VOCENTRA V3 — animations.js
   Particle canvas · Cursor · Scroll reveal · Card tilt
   Nav scroll · Page transitions · Keyword pop
   ============================================================ */

// ── Inject keyword pop keyframe ───────────────────────────────
(function injectStyles() {
  const s = document.createElement("style");
  s.textContent = `
    @keyframes kwPop {
      0%   { transform: scale(0.6) translateY(10px); opacity: 0; }
      70%  { transform: scale(1.05) translateY(-1px); opacity: 1; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    body { opacity: 0; transition: opacity 0.5s ease; }
    @keyframes ripple { to { transform: scale(3.5); opacity: 0; } }
  `;
  document.head.appendChild(s);
})();

// ── Page fade in ──────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });
});

// ── Page exit transitions ─────────────────────────────────────
// Removed overly aggressive `a[href]` interceptor that broke direct links and upload handling.

// ── Custom Cursor ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const dot = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  function trackRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(trackRing);
  }
  trackRing();

  document
    .querySelectorAll(
      "a, button, .glass, label, .drop-area, .feat-card, .how-card",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("hover");
        ring.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("hover");
        ring.classList.remove("hover");
      });
    });

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });
});

// ── Particle Canvas ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COUNT = 70;
  const particles = Array.from({ length: COUNT }, () => makeParticle());

  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      op: Math.random() * 0.45 + 0.08,
      ph: Math.random() * Math.PI * 2,
    };
  }

  let mx = canvas.width / 2,
    my = canvas.height / 2;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          const isDark =
            document.documentElement.getAttribute("data-theme") !== "light";
          const alpha = isDark ? 0.055 * (1 - d / 110) : 0.04 * (1 - d / 110);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,179,237,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark =
      document.documentElement.getAttribute("data-theme") !== "light";

    particles.forEach((p) => {
      // Mouse repulsion
      const dx = p.x - mx,
        dy = p.y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        p.vx += (dx / d) * 0.04;
        p.vy += (dy / d) * 0.04;
      }

      p.vx *= 0.97;
      p.vy *= 0.97;
      p.x += p.vx;
      p.y += p.vy;
      p.ph += 0.018;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const alpha = p.op * (0.65 + 0.35 * Math.sin(p.ph)) * (isDark ? 1 : 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,179,237,${alpha})`;
      ctx.fill();
    });

    drawLines();
    requestAnimationFrame(tick);
  }
  tick();
});

// ── Scroll Reveal & Storytelling ──────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll(".on-scroll");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          // If it's a storytelling section, we can trigger bespoke animations here
          if (e.target.classList.contains("story-section")) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
          }
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => obs.observe(el));

  // Dynamic Scroll Tracking for Parallax/Storytelling
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    document.querySelectorAll(".story-parallax").forEach((el) => {
      const speed = el.dataset.speed || 0.1;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
});

// ── Nav scroll shrink ─────────────────────────────────────────
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navInner");
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.style.background =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "rgba(240,244,248,0.96)"
        : "rgba(11,15,26,0.96)";
    nav.style.boxShadow = "0 4px 30px rgba(0,0,0,0.25)";
  } else {
    nav.style.background = "";
    nav.style.boxShadow = "";
  }
});

// ── Card 3D Tilt ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(
      ".how-card, .feat-card, .mockup-card, .cta-card, .score-panel, .feedback-panel",
    )
    .forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
        card.style.transition = "transform 0.08s ease";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition =
          "transform 0.5s cubic-bezier(0.22,1,0.36,1), background 0.28s, border-color 0.28s, box-shadow 0.28s";
      });
    });
});

// ── Mouse Parallax on hero blobs ──────────────────────────────
document.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2,
    cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx,
    dy = (e.clientY - cy) / cy;
  document.querySelectorAll(".float-pill").forEach((el, i) => {
    const f = (i + 1) * 14;
    el.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
  });
  document.querySelectorAll(".blob").forEach((el, i) => {
    const f = (i + 1) * 8;
    el.style.transform += ` translate(${dx * f}px, ${dy * f}px)`;
  });
});

// ── Button Ripple ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".btn-primary, .btn-ghost, .btn-secondary")
    .forEach((btn) => {
      btn.addEventListener("click", function (e) {
        const r = this.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const rpl = document.createElement("span");
        rpl.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;border-radius:50%;
        background:rgba(255,255,255,0.1);pointer-events:none;
        left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px;
        animation:ripple 0.55s ease-out forwards;
      `;
        this.style.overflow = "hidden";
        this.style.position = "relative";
        this.appendChild(rpl);
        setTimeout(() => rpl.remove(), 600);
      });
    });
});

// ── Score ring init ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("page-result")) return;
  const arc = document.getElementById("scoreArc");
  if (arc) {
    arc.style.strokeDasharray = "515";
    arc.style.strokeDashoffset = "515";
  }
});
