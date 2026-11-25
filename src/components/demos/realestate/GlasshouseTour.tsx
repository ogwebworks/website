"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m } from "motion/react";
import { projectPoint, type TourHandle } from "./glasshouse-gl";
import { afterInteraction } from "../../three/support";

/**
 * "Step inside The Glasshouse": the listing photo becomes a living scene. Scrolling flies a
 * camera through it chapter by chapter (arrival → living → main suite → pool → garden → viewing),
 * the lights come on at dusk, the pool ripples, stars twinkle, and the view leans with the mouse
 * or the phone's tilt. Hotspots on the photo open details. Static photo + hotspots without WebGL.
 */

type Chapter = { id: string; cam: [number, number, number]; kicker: string; title: string; body: string; facts?: string[] };
const chapters: Chapter[] = [
  { id: "arrive", cam: [0.5, 0.5, 1], kicker: "Just listed · Oak Hills", title: "The Glasshouse", body: "Four bedrooms of glass, oak and light, set around a 12-metre pool. Scroll to step inside." },
  { id: "living", cam: [0.43, 0.6, 1.5], kicker: "Ground floor", title: "Open-plan living", body: "A double-height room that opens straight onto the terrace.", facts: ["4.2 m ceilings", "6 m sliding glass wall", "Wide-plank oak floors"] },
  { id: "suite", cam: [0.42, 0.37, 1.55], kicker: "First floor", title: "The main suite", body: "Corner glazing on two sides, a dressing room and a private balcony.", facts: ["38 m² suite", "Walk-in dressing room", "Stone en-suite with rain shower"] },
  { id: "pool", cam: [0.74, 0.78, 1.5], kicker: "Outdoors", title: "12-metre heated pool", body: "Lit after dark and framed by a travertine terrace for long summer evenings.", facts: ["Heated, LED-lit pool", "Travertine terrace", "Outdoor kitchen wiring"] },
  { id: "garden", cam: [0.2, 0.66, 1.45], kicker: "Landscape", title: "The olive garden", body: "Mature olive trees, ornamental grasses and low, warm garden lighting.", facts: ["Mature olive trees", "Smart garden lighting", "Irrigation on timers"] },
  { id: "view", cam: [0.5, 0.52, 1.04], kicker: "$2,450,000 · 4 bd · 3.5 ba · 3,420 sqft", title: "See it in person", body: "Private viewings this week, or a live video walk-through with the listing agent." },
];

// Hotspots on the photo (image uv) with an approximate depth (matches the depth map)
const spots = [
  { ch: 1, q: [0.43, 0.63] as [number, number], d: 0.45, label: "Living room" },
  { ch: 2, q: [0.42, 0.4] as [number, number], d: 0.42, label: "Main suite" },
  { ch: 3, q: [0.76, 0.8] as [number, number], d: 0.78, label: "Pool" },
  { ch: 4, q: [0.17, 0.6] as [number, number], d: 0.68, label: "Olive garden" },
];

const noop = () => () => {};
function getTiltSupport(): "auto" | "ask" | "none" {
  if (!window.matchMedia("(pointer: coarse)").matches || !("DeviceOrientationEvent" in window)) return "none";
  const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
  return typeof DOE.requestPermission === "function" ? "ask" : "auto";
}
const smooth = (t: number) => t * t * (3 - 2 * t);
const IMG_ASPECT = 2400 / 1792;

export default function GlasshouseTour() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<TourHandle | null>(null);
  const spotEls = useRef<(HTMLButtonElement | null)[]>([]);
  const [gl, setGl] = useState(false);
  const [ch, setCh] = useState(0);
  const [lights, setLights] = useState(true);
  // tilt support: "auto" (Android etc.), "ask" (iOS needs a tap to grant), "none"
  const tiltSupport = useSyncExternalStore(noop, getTiltSupport, () => "none" as const);
  const [tiltOn, setTiltOn] = useState(false);
  const look = useRef<[number, number]>([0, 0]);
  const lastInput = useRef(0);

  // camera for a scroll progress (0..1) → interpolated between chapters, clamped to the photo
  const camAt = (p: number): [number, number, number] => {
    const f = Math.min(chapters.length - 1, Math.max(0, p * (chapters.length - 1)));
    const i = Math.floor(f), t = smooth(f - i);
    const a = chapters[i].cam, b = chapters[Math.min(i + 1, chapters.length - 1)].cam;
    const cam: [number, number, number] = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const el = stage.current;
    if (el) {
      const ca = el.clientWidth / el.clientHeight;
      const sc = ca > IMG_ASPECT ? [1, IMG_ASPECT / ca] : [ca / IMG_ASPECT, 1];
      const hx = sc[0] / cam[2] / 2 + 0.012, hy = sc[1] / cam[2] / 2 + 0.012;
      cam[0] = Math.min(1 - hx, Math.max(hx, cam[0]));
      cam[1] = Math.min(1 - hy, Math.max(hy, cam[1]));
    }
    return cam;
  };

  // hotspots follow the scene (camera + parallax) every frame; static positions without WebGL
  const placeSpots = () => {
    const el = stage.current;
    if (!el) return;
    const ca = el.clientWidth / el.clientHeight;
    const cur = handle.current?.current();
    spots.forEach((s, i) => {
      const b = spotEls.current[i];
      if (!b) return;
      const [x, y] = projectPoint(s.q, s.d, cur?.look ?? [0, 0], cur?.cam ?? [0.5, 0.5, 1], ca, IMG_ASPECT);
      const out = x < 0.03 || x > 0.97 || y < 0.08 || y > 0.92;
      b.style.transform = `translate3d(${x * el.clientWidth}px, ${y * el.clientHeight}px, 0)`;
      b.style.opacity = out ? "0" : "1";
      b.style.pointerEvents = out ? "none" : "auto";
    });
  };
  // scroll → chapter + camera
  useEffect(() => {
    const onScroll = () => {
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      const idx = Math.round(p * (chapters.length - 1));
      setCh((c) => (c === idx ? c : idx));
      handle.current?.set({ cam: camAt(p) });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [gl]);

  // WebGL scene, loaded when the section comes near
  useEffect(() => {
    const el = section.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let cancelWait: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // start on the visitor's first scroll/touch/mouse move, so page load stays light
        cancelWait = afterInteraction(start);
      },
      { rootMargin: "600px 0px" },
    );
    const start = async () => {
        try {
          const { mountGlasshouse } = await import("./glasshouse-gl");
          if (!alive || !canvas.current) return;
          const small = window.innerWidth < 900;
          const h = await mountGlasshouse(
            canvas.current,
            { img: small ? "/tour/glasshouse-1200.webp" : "/tour/glasshouse-2000.webp", depth: "/tour/glasshouse-depth.png", mask: "/tour/glasshouse-masks.png" },
            () => placeSpots(),
          );
          if (!alive) { h.dispose(); return; }
          handle.current = h;
          h.set({ lights: 1 });
          setGl(true);
        } catch {
          /* static photo stays */
        }
    };
    io.observe(el);
    return () => { alive = false; io.disconnect(); cancelWait?.(); handle.current?.dispose(); handle.current = null; };
  }, []);

  // pointer look + idle drift + device tilt
  useEffect(() => {
    const el = stage.current!;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      look.current = [((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2];
      lastInput.current = performance.now();
      handle.current?.set({ look: look.current });
    };
    const onLeave = () => { look.current = [0, 0]; handle.current?.set({ look: [0, 0] }); };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      look.current = [Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (e.beta - 45) / 25))];
      lastInput.current = performance.now();
      handle.current?.set({ look: look.current });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    if (getTiltSupport() === "auto") window.addEventListener("deviceorientation", onOrient);
    // idle drift so the scene never looks frozen
    const id = window.setInterval(() => {
      if (performance.now() - lastInput.current < 2500) return;
      const t = performance.now() / 1000;
      handle.current?.set({ look: [Math.sin(t * 0.35) * 0.55, Math.sin(t * 0.23) * 0.3] });
    }, 120);
    (el as HTMLDivElement & { _orient?: typeof onOrient })._orient = onOrient;
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onOrient);
      clearInterval(id);
    };
  }, []);

  const enableTilt = async () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    try {
      if ((await DOE.requestPermission?.()) === "granted") {
        const fn = (stage.current as HTMLDivElement & { _orient?: (e: DeviceOrientationEvent) => void })._orient;
        if (fn) window.addEventListener("deviceorientation", fn);
        setTiltOn(true);
      }
    } catch { /* denied */ }
  };

  useEffect(() => {
    placeSpots();
    const ro = new ResizeObserver(() => placeSpots());
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = section.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (i / (chapters.length - 1)) * (el.offsetHeight - window.innerHeight) + 2;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  const toggleLights = () => {
    const v = !lights;
    setLights(v);
    handle.current?.set({ lights: v ? 1 : 0 });
  };

  const c = chapters[ch];
  return (
    <section ref={section} id="tour3d" aria-labelledby="tour3d-h" className="relative h-[520vh] scroll-mt-0 bg-re-navy">
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden" data-cursor="Look">
        {/* static photo (instant, and the fallback) */}
        <picture>
          <source media="(max-width: 899px)" srcSet="/tour/glasshouse-1200.webp" />
          <img src="/tour/glasshouse-2000.webp" alt="The Glasshouse: modern glass and timber home at dusk with a lit pool" width={2000} height={1494} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${gl ? "opacity-100" : "opacity-0"}`} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,17,52,0.55),transparent_30%,transparent_60%,rgba(7,17,52,0.85))]" aria-hidden="true" />

        {/* hotspots */}
        {spots.map((s, i) => (
          <button
            key={s.label}
            ref={(el) => { spotEls.current[i] = el; }}
            type="button"
            onClick={() => goTo(s.ch)}
            aria-label={`Show ${s.label}`}
            className="group absolute left-0 top-0 -ml-5 -mt-5 transition-opacity duration-300"
          >
            <span className={`relative grid h-10 w-10 place-items-center rounded-full ${ch === s.ch ? "bg-re-cyan" : "bg-white/25 backdrop-blur"} ring-2 ring-white/80`}>
              <span className={`absolute inset-0 animate-ping rounded-full ${ch === s.ch ? "bg-re-cyan/60" : "bg-white/30"}`} />
              <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <span className={`absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-re-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur transition ${ch === s.ch ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              {s.label}
            </span>
          </button>
        ))}

        {/* chapter card */}
        <div className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-24 sm:px-8 sm:pt-28 lg:px-14">
          <AnimatePresence mode="wait">
            <m.div
              key={c.id}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md rounded-3xl border border-white/15 bg-re-navy/45 p-5 text-white shadow-2xl backdrop-blur-md sm:p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-re-cyan">{c.kicker}</p>
              {ch === 0 ? (
                <h2 id="tour3d-h" className="mt-2 font-re text-4xl tracking-tight sm:text-5xl">{c.title}</h2>
              ) : (
                <h3 className="mt-2 font-re text-3xl tracking-tight sm:text-4xl">{c.title}</h3>
              )}
              <p className="mt-3 text-white/80">{c.body}</p>
              {c.facts && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.facts.map((f) => <li key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/15">{f}</li>)}
                </ul>
              )}
              {c.id === "view" && (
                <div className="pointer-events-auto mt-5 flex flex-wrap gap-2">
                  <a href="#tour" className="rounded-full bg-re-cyan px-5 py-3 text-sm font-semibold text-re-navy">Book a private viewing</a>
                  <a href="#tour" className="rounded-full px-5 py-3 text-sm font-semibold ring-1 ring-white/30">Video walk-through</a>
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* control bar */}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 px-4 pb-24 sm:px-8 md:pb-5 lg:px-14">
          <nav aria-label="Tour chapters" className="flex items-center gap-1.5 rounded-full bg-re-navy/60 p-1.5 ring-1 ring-white/15 backdrop-blur">
            {chapters.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => goTo(i)}
                aria-current={ch === i ? "step" : undefined}
                aria-label={x.title}
                className="group grid h-6 min-w-6 place-items-center"
              >
                <span className={`block h-2.5 rounded-full transition-all duration-500 ${ch === i ? "w-8 bg-re-cyan" : "w-2.5 bg-white/40 group-hover:bg-white/70"}`} />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {tiltSupport === "ask" && !tiltOn && (
              <button type="button" onClick={enableTilt} className="rounded-full bg-re-navy/60 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">
                Tilt to look around
              </button>
            )}
            {gl && (
              <button type="button" onClick={toggleLights} aria-pressed={lights} className="flex items-center gap-2 rounded-full bg-re-navy/60 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">
                <span className={`h-2 w-2 rounded-full ${lights ? "bg-[#f7d48a] shadow-[0_0_10px_#f7d48a]" : "bg-white/30"}`} />
                Lights {lights ? "on" : "off"}
              </button>
            )}
            <span className="hidden rounded-full bg-re-navy/60 px-4 py-2 text-xs text-white/75 ring-1 ring-white/15 backdrop-blur md:inline">
              {gl ? "Move to look around · scroll to explore" : "Scroll to explore"}
            </span>
          </div>
        </div>
        <p className="absolute bottom-1 right-4 text-[10px] text-white/40 sm:right-8">AI-generated image of a fictional home</p>
      </div>
    </section>
  );
}
