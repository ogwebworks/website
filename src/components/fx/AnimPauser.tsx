"use client";

import { useEffect } from "react";

/**
 * Pauses infinite CSS animations (glows, floats, spins) inside any homepage section that is
 * off screen, by toggling `data-offscreen` (see globals.css). Saves battery and keeps
 * scrolling smooth on phones. Renders nothing.
 */
export default function AnimPauser() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > div, footer"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const t = e.target as HTMLElement;
        if (e.isIntersecting) delete t.dataset.offscreen;
        else t.dataset.offscreen = "";
      }),
      { rootMargin: "0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
