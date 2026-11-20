"use client";

import { useEffect, useRef } from "react";

/**
 * Giant footer wordmark whose letters lift, brighten and lean toward the cursor
 * like a magnetic field passing over them.
 */
export default function FooterWordmark({ text = "Original." }: { text?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>("span"));
    let raf = 0, mx = -9999, my = -9999;
    const cur = letters.map(() => 0);
    const loop = () => {
      let moving = false;
      letters.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const d = Math.hypot(mx - cx, (my - cy) * 1.4);
        const target = Math.max(0, 1 - d / 420);
        cur[i] += (target - cur[i]) * 0.12;
        if (Math.abs(target - cur[i]) > 0.002) moving = true;
        const lean = mx === -9999 ? 0 : Math.max(-1, Math.min(1, (mx - cx) / 300));
        s.style.transform = `translateY(${-cur[i] * 28}px) skewX(${-lean * cur[i] * 10}deg)`;
        s.style.setProperty("--lit", cur[i].toFixed(3));
      });
      if (moving) raf = requestAnimationFrame(loop);
    };
    const kick = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); };
    const host = el.closest("footer") ?? el;
    const onMove = (e: Event) => { const p = e as PointerEvent; mx = p.clientX; my = p.clientY; kick(); };
    const onLeave = () => { mx = my = -9999; kick(); };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => { cancelAnimationFrame(raf); host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
  }, []);

  return (
    <p ref={ref} className="footer-wordmark font-display text-[clamp(3rem,13.5vw,13rem)] font-bold leading-[0.8] tracking-[-0.05em]">
      {Array.from(text).map((ch, i) => (
        <span key={i}>{ch}</span>
      ))}
    </p>
  );
}
