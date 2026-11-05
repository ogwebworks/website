"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/** Inertia-based smooth scrolling. Disabled for reduced-motion users. */
export default function SmoothScroll() {
  useEffect(() => {
    // Desktop + mouse only (touch devices already have native momentum scrolling),
    // and loaded lazily after the browser is idle so it never delays first load.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let lenis: Lenis | null = null;
    let cancelled = false;
    let raf = 0;
    const onClick = (e: MouseEvent) => {
      if (!lenis) return;
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
      history.replaceState(null, "", id);
    };

    const start = async () => {
      const { default: LenisCtor } = await import("lenis");
      if (cancelled) return;
      lenis = new LenisCtor({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      document.addEventListener("click", onClick);
    };
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const idleId = ric ? ric(start, { timeout: 3000 }) : window.setTimeout(start, 1500);

    return () => {
      cancelled = true;
      if (!ric) clearTimeout(idleId);
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
