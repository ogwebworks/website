"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Hero visual: a CSS-3D laptop that opens and builds a website on screen (Build),
 * surrounded by floating cards for growth and AI citations (Grow) and an error fix (Fix).
 * Pure CSS transforms + SVG; the only JavaScript is a tiny mouse-parallax handler.
 * Card contents are illustrative UI, not client results.
 */
export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  // Unique SVG gradient ids (the visual is rendered twice: desktop + mobile layouts).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const imgId = `hvImg${uid}`;
  const areaId = `hvArea${uid}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
        el.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className="hv" aria-hidden="true">
      <div className="hv-stage">
        <div className="hv-glow" />

        {/* ---------- Laptop (Build) ---------- */}
        <div className="hv-laptop">
          <div className="hv-lid">
            <div className="hv-screen">
              <div className="hv-browser">
                <span className="hv-dot bg-coral" />
                <span className="hv-dot bg-brand" />
                <span className="hv-dot bg-azure" />
                <span className="hv-url">ogwebworks.com</span>
              </div>
              <div className="hv-site">
                <div className="hv-nav">
                  <span className="hv-b hv-logo" style={{ "--i": 0 } as React.CSSProperties} />
                  <span className="hv-b hv-navlink" style={{ "--i": 1 } as React.CSSProperties} />
                  <span className="hv-b hv-navlink" style={{ "--i": 1.3 } as React.CSSProperties} />
                  <span className="hv-b hv-navlink" style={{ "--i": 1.6 } as React.CSSProperties} />
                  <span className="hv-b hv-navbtn" style={{ "--i": 2 } as React.CSSProperties} />
                </div>
                <div className="hv-herorow">
                  <div className="hv-herotext">
                    <span className="hv-b hv-h1" style={{ "--i": 3 } as React.CSSProperties} />
                    <span className="hv-b hv-h1 hv-h1-grad" style={{ "--i": 3.6 } as React.CSSProperties} />
                    <span className="hv-b hv-p" style={{ "--i": 4.4 } as React.CSSProperties} />
                    <span className="hv-b hv-p hv-p-short" style={{ "--i": 4.8 } as React.CSSProperties} />
                    <span className="hv-b hv-cta" style={{ "--i": 5.4 } as React.CSSProperties} />
                  </div>
                  <div className="hv-b hv-heroimg" style={{ "--i": 4 } as React.CSSProperties}>
                    <svg viewBox="0 0 100 70" preserveAspectRatio="none">
                      <path d="M0 58 L20 44 L36 50 L56 26 L74 34 L100 8 L100 70 L0 70 Z" fill={`url(#${imgId})`} />
                      <defs>
                        <linearGradient id={imgId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#1d6dff" stopOpacity="0.9" />
                          <stop offset="1" stopColor="#1d6dff" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="hv-cards">
                  {[6, 6.4, 6.8].map((i) => (
                    <span key={i} className="hv-b hv-minicard" style={{ "--i": i } as React.CSSProperties}>
                      <i />
                    </span>
                  ))}
                </div>
              </div>
              <span className="hv-cursor" />
            </div>
          </div>
          <div className="hv-deck">
            <div className="hv-keys" />
            <div className="hv-pad" />
          </div>
        </div>

        {/* ---------- AI answer card (GEO) ---------- */}
        <div className="hv-card hv-ai" style={{ "--z": "9cqw", "--f": "7s", "--in": "1.5s" } as React.CSSProperties}>
          <p className="hv-label">
            <span className="text-brand">✦</span> AI answer
          </p>
          <span className="hv-line" />
          <span className="hv-line hv-line-short" />
          <p className="hv-chip">
            <span className="hv-chip-dot" /> Cited: ogwebworks.com
          </p>
        </div>

        {/* ---------- Growth chart (SEO / Ads) ---------- */}
        <div className="hv-card hv-growth" style={{ "--z": "12cqw", "--f": "8s", "--in": "1.8s" } as React.CSSProperties}>
          <div className="hv-row">
            <p className="hv-label">Organic traffic</p>
            <span className="hv-up">▲ Growing</span>
          </div>
          <svg viewBox="0 0 120 50" className="hv-chart">
            <defs>
              <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#12d6f8" stopOpacity="0.45" />
                <stop offset="1" stopColor="#12d6f8" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[12.5, 25, 37.5].map((y) => (
              <line key={y} x1="0" x2="120" y1={y} y2={y} stroke="rgb(255 255 255 / 0.07)" />
            ))}
            <path className="hv-area" d="M0 44 L15 40 L30 41 L45 33 L60 35 L75 24 L90 21 L105 12 L120 5 L120 50 L0 50 Z" fill={`url(#${areaId})`} />
            <path className="hv-trend" d="M0 44 L15 40 L30 41 L45 33 L60 35 L75 24 L90 21 L105 12 L120 5" fill="none" stroke="#12d6f8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" pathLength={100} />
            <circle className="hv-peak" cx="120" cy="5" r="3" fill="#12d6f8" />
          </svg>
          <div className="hv-bars">
            {[38, 52, 46, 68, 80, 96].map((h, i) => (
              <span key={i} style={{ "--h": `${h}%`, "--j": i } as React.CSSProperties} />
            ))}
          </div>
        </div>

        {/* ---------- Performance score ---------- */}
        <div className="hv-card hv-score" style={{ "--z": "14cqw", "--f": "6.5s", "--in": "2.1s" } as React.CSSProperties}>
          <svg viewBox="0 0 44 44" className="hv-ring">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="4" />
            <circle className="hv-ring-fg" cx="22" cy="22" r="18" fill="none" stroke="#12d6f8" strokeWidth="4" strokeLinecap="round" pathLength={100} transform="rotate(-90 22 22)" />
            <text x="22" y="26.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f2f6ff" fontFamily="var(--font-space-grotesk), sans-serif">
              98
            </text>
          </svg>
          <p className="hv-label">Performance</p>
        </div>

        {/* ---------- Error fixed (Fix) ---------- */}
        <div className="hv-card hv-fix" style={{ "--z": "10cqw", "--f": "7.5s", "--in": "2.4s" } as React.CSSProperties}>
          <span className="hv-check">✓</span>
          <div>
            <p className="hv-title">500 error fixed</p>
            <p className="hv-sub">Site back online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
