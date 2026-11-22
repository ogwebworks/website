"use client";

import { useEffect, useRef } from "react";
import { services } from "@/lib/site";

const items = [...services.map((s) => s.title), "Core Web Vitals", "Schema & Entities", "Conversion Design"];

const Star = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand sm:h-7 sm:w-7" fill="currentColor" aria-hidden="true">
    <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
  </svg>
);

const List = ({ outline, hidden }: { outline?: boolean; hidden?: boolean }) => (
  <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
    {items.map((t) => (
      <li
        key={t}
        className={`flex items-center gap-10 whitespace-nowrap font-display text-2xl font-semibold tracking-tight sm:text-4xl ${outline ? "text-transparent [-webkit-text-stroke:1px_rgb(161_193_250/0.7)]" : ""}`}
      >
        {t}
        <Star />
      </li>
    ))}
  </ul>
);

/**
 * Two kinetic ribbons running in opposite directions. Scrolling speeds them up, flips their
 * direction with the scroll and skews the type with the velocity. One small rAF loop for both
 * rows that runs only while the ribbons are on screen.
 */
export default function Marquee() {
  const section = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = section.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const base = [-2.2, 2.2]; // % of row width per second
    const x = [0, -50];
    let dir = 1, vel = 0, lastY = window.scrollY, lastT = 0, raf = 0, on = false;

    const frame = (t: number) => {
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;
      const y = window.scrollY;
      const v = dt ? (y - lastY) / dt : 0; // px/s
      lastY = y;
      vel += (v - vel) * 0.12;
      if (Math.abs(vel) > 30) dir = vel > 0 ? 1 : -1;
      const boost = 1 + Math.min(5, Math.abs(vel) / 400);
      const skew = Math.max(-8, Math.min(8, -vel / 300));
      rows.current.forEach((r, i) => {
        if (!r) return;
        x[i] += dir * base[i] * dt * boost;
        if (x[i] <= -50) x[i] += 50;
        if (x[i] > 0) x[i] -= 50;
        r.style.transform = `translate3d(${x[i]}%,0,0) skewX(${skew.toFixed(2)}deg)`;
      });
      if (on) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) { lastT = 0; lastY = window.scrollY; raf = requestAnimationFrame(frame); }
    });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <section ref={section} aria-label="What we do" className="relative z-10 -rotate-1 space-y-3 border-y border-line bg-ink-2 py-6">
      {[false, true].map((outline, i) => (
        <div key={i} className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div ref={(d) => { rows.current[i] = d; }} className="flex w-max" style={{ transform: i ? "translate3d(-50%,0,0)" : undefined }}>
            <List outline={outline} hidden={outline} />
            <List outline={outline} hidden />
          </div>
        </div>
      ))}
    </section>
  );
}
