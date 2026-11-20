"use client";

import { useEffect, useRef } from "react";

/**
 * Two-part cursor for mouse users: a precise dot plus a trailing ring that grows over
 * interactive elements and shows a label from `data-cursor` (e.g. "Play", "Drag").
 * The native cursor stays visible in text fields. Off for touch and reduced motion.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = dot.current!, r = ring.current!, l = label.current!;
    document.documentElement.classList.add("has-cursor");
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, shown = false;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; r.dataset.on = d.dataset.on = "1"; }
      const t = e.target as Element | null;
      const tagged = t?.closest?.("[data-cursor]") as HTMLElement | null;
      const interactive = t?.closest?.("a, button, summary, label, select, [role=button], [role=radio], canvas");
      const text = t?.closest?.("input, textarea, [contenteditable=true]");
      const txt = tagged?.dataset.cursor ?? "";
      if (l.textContent !== txt) l.textContent = txt;
      r.dataset.mode = text ? "text" : txt ? "label" : interactive ? "hover" : "";
    };
    const onLeave = () => { shown = false; r.dataset.on = d.dataset.on = ""; };
    // entering an iframe (live demos) or leaving the window: hide ours, the iframe shows its own
    const onOut = (e: PointerEvent) => {
      const to = e.relatedTarget as Element | null;
      if (!to || to.tagName === "IFRAME") onLeave();
    };
    const onDown = () => r.classList.add("press");
    const onUp = () => r.classList.remove("press");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={ring} className="og-cursor-ring"><span ref={label} /></div>
      <div ref={dot} className="og-cursor-dot" />
    </div>
  );
}
