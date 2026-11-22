"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient "network" motion graphic (adapted from BizPlainly): drifting nodes joined by faint
 * lines, pulled toward the cursor. Canvas 2D, sized to its positioned parent, pauses off-screen,
 * and draws one still frame for reduced-motion visitors.
 */
export default function ParticleField({ density = 0.00008, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // desktop with a mouse only: on touch devices it is decoration that costs scrolling smoothness
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = ["#12d6f8", "#1d6dff", "#a1c1fa"];
    let w = 0, h = 0, raf = 0, visible = false;
    const mouse = { x: -9999, y: -9999 };
    type P = { x: number; y: number; vx: number; vy: number; r: number; c: number };
    let pts: P[] = [];
    const host = canvas.parentElement!;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(20, Math.min(100, Math.round(w * h * density)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6, c: Math.floor(Math.random() * 3),
      }));
    };

    const LINK = 130;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (reduce) break;
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
        if (d2 < 180 * 180) { p.vx += dx * 0.000012; p.vy += dy * 0.000012; }
        p.vx *= 0.995; p.vy *= 0.995;
        p.x += p.vx + Math.sign(p.vx) * 0.05; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(161, 193, 250, ${(1 - d / LINK) * 0.2})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 170) {
          ctx.strokeStyle = `rgba(18, 214, 248, ${(1 - md / 170) * 0.45})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 0.85;
      for (const p of pts) {
        ctx.fillStyle = colors[p.c];
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };
    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    const onVis = () => { if (!document.hidden && visible) start(); };
    const ro = new ResizeObserver(() => { resize(); start(); });

    resize();
    io.observe(canvas); ro.observe(host);
    host.addEventListener("pointermove", onMove); host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
