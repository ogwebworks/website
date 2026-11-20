"use client";

/**
 * Tiny synthesized UI sounds (Web Audio, no files). Off by default; the header toggle
 * turns them on and the choice is remembered. Never plays before the visitor opts in.
 */
const KEY = "og-sound";
let ctx: AudioContext | null = null;
let on = false;
const subs = new Set<(v: boolean) => void>();

if (typeof window !== "undefined") {
  try { on = localStorage.getItem(KEY) === "1"; } catch { /* ignore */ }
}

function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.05, when = 0, slideTo?: number) {
  if (!on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = ac();
  const t = a.currentTime + when;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  get enabled() { return on; },
  set(v: boolean) {
    on = v;
    try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* ignore */ }
    subs.forEach((f) => f(v));
    if (v) sfx.chime();
  },
  subscribe(f: (v: boolean) => void) { subs.add(f); return () => { subs.delete(f); }; },
  tick: () => tone(1800, 0.05, "triangle", 0.025),
  hover: () => tone(2400, 0.03, "sine", 0.012),
  chime: () => { tone(880, 0.35, "sine", 0.05); tone(1320, 0.4, "sine", 0.035, 0.07); tone(1760, 0.5, "sine", 0.02, 0.14); },
  whoosh: () => tone(220, 0.35, "sawtooth", 0.015, 0, 900),
};
