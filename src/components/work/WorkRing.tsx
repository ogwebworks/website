"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DemoLightbox } from "../DemoPreview";

type Item = { src: string; host: string; title: string; kind: string; heading: string; poster: ReactNode };

/**
 * A 3D carousel: project cards stand on a cylinder that turns slowly on its own,
 * follows drag/swipe with inertia, nudges with scroll speed and snaps to the nearest
 * card. CSS 3D transforms only (no WebGL), so it is light on every device.
 */
export default function WorkRing({ items }: { items: Item[] }) {
  const n = items.length;
  const step = 360 / n;
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const state = useRef({ angle: 0, vel: 0, target: null as number | null, drag: false, lastX: 0, lastT: 0, idle: 0, moved: 0 });
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Item | null>(null);
  const [radius, setRadius] = useState(640);

  // radius from card width so cards sit edge to edge
  useEffect(() => {
    const el = stage.current!;
    const ro = new ResizeObserver(() => {
      const w = Math.min(el.clientWidth * 0.72, 560);
      el.style.setProperty("--card-w", `${w}px`);
      setRadius(Math.round((w / 2) / Math.tan(Math.PI / n) * 1.12));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  useEffect(() => {
    const s = state.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = !window.matchMedia("(pointer: fine)").matches;
    let raf = 0, visible = false, lastScroll = window.scrollY, drawn = NaN;
    const norm = (a: number) => ((a % 360) + 360) % 360;
    const frame = (t: number) => {
      const dt = Math.min(48, t - (s.lastT || t));
      s.lastT = t;
      if (!s.drag) {
        if (s.target !== null) {
          const d = s.target - s.angle;
          s.angle += d * 0.12;
          if (Math.abs(d) < 0.05) { s.angle = s.target; s.target = null; }
          s.vel = 0;
        } else {
          s.angle += s.vel;
          s.vel *= 0.94;
          s.idle += dt;
          if (Math.abs(s.vel) < 0.02 && s.idle > 2600 && !reduce && !touch) s.angle -= dt * 0.006; // slow auto-turn (mouse devices)
          // gentle snap when nearly stopped after a throw
          if (Math.abs(s.vel) < 0.08 && Math.abs(s.vel) > 0.001 && s.idle < 2600) {
            const snap = Math.round(s.angle / step) * step;
            s.angle += (snap - s.angle) * 0.08;
          }
        }
      }
      if (Math.abs(s.angle - drawn) < 0.002) { if (visible && !document.hidden) raf = requestAnimationFrame(frame); return; }
      drawn = s.angle;
      ring.current!.style.transform = `translateZ(${-radius}px) rotateY(${s.angle}deg)`;
      // depth shading: cards facing away fade
      const front = Math.round(norm(-s.angle) / step) % n;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const rel = norm(i * step + s.angle);
        const facing = Math.cos((rel * Math.PI) / 180); // 1 front, -1 back
        c.style.opacity = String(Math.max(0, 0.15 + facing * 0.85));
        c.style.setProperty("--shade", String(0.55 - Math.max(0, facing) * 0.55));
        c.style.pointerEvents = facing > 0.6 ? "auto" : "none";
      });
      setActive((a) => (a === front ? a : front));
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const startLoop = () => { cancelAnimationFrame(raf); s.lastT = 0; raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) startLoop(); });
    io.observe(stage.current!);
    const onScroll = () => {
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (visible && !s.drag && !reduce) s.vel += Math.max(-1.5, Math.min(1.5, dy * 0.01));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [n, step, radius]);

  const s = state.current;
  const go = (i: number) => {
    // shortest turn to bring card i to the front
    const cur = s.angle;
    const want = -i * step;
    const diff = ((((want - cur) % 360) + 540) % 360) - 180;
    s.target = cur + diff;
    s.idle = 0;
  };

  const onDown = (e: React.PointerEvent) => {
    s.drag = true; s.lastX = e.clientX; s.vel = 0; s.target = null; s.idle = 0; s.moved = 0;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!s.drag) return;
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.moved += Math.abs(dx);
    // capture only once it is clearly a drag, so plain clicks still reach the card buttons
    const el = e.currentTarget as HTMLElement;
    if (s.moved > 8 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
    const d = dx * 0.18;
    s.angle += d;
    s.vel = d;
  };
  const onUp = () => { s.drag = false; s.idle = 0; };

  return (
    <div className="relative">
      <div
        ref={stage}
        className="relative mx-auto h-[min(68vw,420px)] touch-pan-y select-none [perspective:1800px] sm:h-[460px]"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        data-cursor="Drag"
      >
        {/* floor glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[-12%] mx-auto h-40 w-[70%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(18_214_248/0.22),transparent)] blur-xl" aria-hidden="true" />
        <div ref={ring} className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]" style={{ transform: `translateZ(${-radius}px)` }}>
          {items.map((it, i) => (
            <div
              key={it.src}
              ref={(el) => { cards.current[i] = el; }}
              className="absolute left-0 top-0 [backface-visibility:hidden]"
              style={{ width: "var(--card-w)", transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)` }}
            >
              <button
                type="button"
                onClick={() => (s.moved > 8 ? null : i === active ? setOpen(it) : go(i))}
                onFocus={() => go(i)}
                aria-label={i === active ? `Open live demo: ${it.title}` : `Show ${it.heading}`}
                data-cursor={i === active ? "Open" : "View"}
                className="group block w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-3 text-left shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
              >
                <span className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2" aria-hidden="true">
                  <i className="h-2 w-2 rounded-full bg-coral/80" />
                  <i className="h-2 w-2 rounded-full bg-[#f5c542]" />
                  <i className="h-2 w-2 rounded-full bg-[#3fcf6b]" />
                  <span className="ml-2 truncate text-[11px] text-mute">{it.host}</span>
                </span>
                <span className="relative block aspect-[16/10] overflow-hidden">
                  <span className="absolute inset-0 block transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">{it.poster}</span>
                  <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(3_8_32/0.85),transparent_55%)]" aria-hidden="true" />
                  <span className="pointer-events-none absolute inset-0 z-10 bg-ink" style={{ opacity: "var(--shade, 0)" }} aria-hidden="true" />
                  <span className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">{it.kind}</span>
                      <span className="mt-1 block font-display text-xl font-bold tracking-tight sm:text-2xl">{it.heading}</span>
                    </span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-ink transition group-hover:scale-110" aria-hidden="true">↗</span>
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x mt-10 flex items-center justify-between gap-4">
        <p className="font-display text-sm tabular-nums text-mute" aria-live="polite">
          <span className="text-paper">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")} · {items[active].heading}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => go((active - 1 + n) % n)} aria-label="Previous project" className="grid h-12 w-12 place-items-center rounded-full border border-line transition hover:border-brand hover:text-brand">←</button>
          <button type="button" onClick={() => setOpen(items[active])} className="whitespace-nowrap rounded-full bg-brand px-4 text-sm font-semibold text-ink transition hover:brightness-110 sm:px-5 sm:text-base">Open live site</button>
          <button type="button" onClick={() => go((active + 1) % n)} aria-label="Next project" className="grid h-12 w-12 place-items-center rounded-full border border-line transition hover:border-brand hover:text-brand">→</button>
        </div>
      </div>

      {open && <DemoLightbox src={open.src} title={open.title} host={open.host} onClose={() => setOpen(null)} />}
    </div>
  );
}
