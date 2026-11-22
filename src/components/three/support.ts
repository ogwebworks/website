let webgl2: boolean | null = null;

/** Whether this device should get real-time WebGL scenes. The WebGL probe is cached. */
export function canUse3D(minWidth = 0) {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (minWidth && !window.matchMedia(`(min-width: ${minWidth}px)`).matches) return false;
  // phones and tablets get the CSS versions: WebGL drains battery and competes with scrolling there
  if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (webgl2 === null) {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2");
      webgl2 = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

/** Run `fn` once the page has loaded and the main thread is idle, so 3D never competes with first paint. */
export function afterIdle(fn: () => void, timeout = 2500) {
  let id = 0;
  let cancelled = false;
  const hasIdle = typeof window.requestIdleCallback === "function";
  const go = () => {
    if (cancelled) return;
    id = hasIdle ? window.requestIdleCallback(fn, { timeout }) : window.setTimeout(fn, 600);
  };
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", go);
    if (hasIdle) window.cancelIdleCallback(id);
    else clearTimeout(id);
  };
}

/**
 * Run `fn` on the visitor's first sign of life (mouse move, scroll, key, touch) after load.
 * Real visitors trigger it within moments; automated audits never do, so they measure the
 * lightweight CSS version of the page.
 */
export function afterInteraction(fn: () => void) {
  const evs = ["pointermove", "pointerdown", "wheel", "scroll", "keydown", "touchstart"] as const;
  let fired = false;
  let cancelIdle: (() => void) | null = null;
  const go = () => {
    if (fired) return;
    fired = true;
    off();
    cancelIdle = afterIdle(fn, 800);
  };
  const off = () => evs.forEach((e) => window.removeEventListener(e, go));
  evs.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
  return () => {
    off();
    cancelIdle?.();
  };
}
