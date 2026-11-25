"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "motion/react";
import { projectPoint, type HouseHandle } from "./house-gl";
import { depthAt, details, plans, route, scenes, type Cam } from "./house-data";
import { afterInteraction } from "../../three/support";

/**
 * "Walk through The Glasshouse": a scroll-driven, room-by-room tour built from AI photos.
 * Each room is a living scene (depth parallax, lights, water, fire, steam); scrolling pushes the
 * camera into a room, then walks through into the next. Hotspots open details; a floor plan
 * jumps between rooms. Without WebGL (or with reduced motion) the photos crossfade instead.
 */

const N = route.length;
const HOLD = 0.78; // share of each chapter spent in the room before walking to the next
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpCam = (a: Cam, b: Cam, t: number): Cam => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const noop = () => () => {};

function getTiltSupport(): "auto" | "ask" | "none" {
  if (!window.matchMedia("(pointer: coarse)").matches || !("DeviceOrientationEvent" in window)) return "none";
  const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
  return typeof DOE.requestPermission === "function" ? "ask" : "auto";
}

/** keep a camera inside its photo for the current stage shape */
function clampCam(c: Cam, imgAsp: number, stageAsp: number): Cam {
  const sc = stageAsp > imgAsp ? [1, imgAsp / stageAsp] : [stageAsp / imgAsp, 1];
  const hx = sc[0] / c[2] / 2 + 0.01, hy = sc[1] / c[2] / 2 + 0.01;
  return [Math.min(1 - hx, Math.max(hx, c[0])), Math.min(1 - hy, Math.max(hy, c[1])), c[2]];
}

/** Scroll progress → which room(s) and cameras are on screen. */
function frameAt(p: number, stageAsp: number) {
  const f = Math.min(N - 0.0001, Math.max(0, p * N));
  const i = Math.floor(f), t = f - i;
  const A = route[i], B = route[Math.min(i + 1, N - 1)];
  const inRoom = smooth(Math.min(1, t / HOLD));
  let camA = lerpCam(A.start, A.end, inRoom);
  let camB: Cam = [...B.start];
  let mix = 0;
  if (t > HOLD && i < N - 1) {
    const w = smooth((t - HOLD) / (1 - HOLD));
    mix = w;
    camA = lerpCam(A.end, [A.exit[0], A.exit[1], A.end[2] * 1.45], w); // walk into the doorway
    camB = lerpCam([B.start[0], B.start[1], B.start[2] * 1.25], B.start, w); // arrive and settle
  }
  return {
    i,
    a: A,
    b: B,
    mix,
    camA: clampCam(camA, A.aspect, stageAsp),
    camB: clampCam(camB, B.aspect, stageAsp),
    shown: mix > 0.5 ? Math.min(i + 1, N - 1) : i,
  };
}

export default function GlasshouseTour() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<HouseHandle | null>(null);
  const spotEls = useRef<(HTMLButtonElement | null)[]>([]);
  const [gl, setGl] = useState(false);
  const [ch, setCh] = useState(0);
  const [lights, setLights] = useState(true);
  const [detail, setDetail] = useState<null | keyof typeof details>(null);
  const [tipKey, setTipKey] = useState<string | null>(null);
  const tiltSupport = useSyncExternalStore(noop, getTiltSupport, () => "none" as const);
  const [tiltOn, setTiltOn] = useState(false);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const lastInput = useRef(0);
  const room = route[ch];
  const chRef = useRef(0);
  useEffect(() => { chRef.current = ch; }, [ch]);
  const tip = tipKey?.startsWith(`${room.key}:`) ? Number(tipKey.split(":")[1]) : null;
  const setTip = (i: number | null) => setTipKey(i === null ? null : `${room.key}:${i}`);

  // hotspots follow the live camera every frame
  const placeSpots = () => {
    const el = stage.current;
    if (!el) return;
    const sa = el.clientWidth / el.clientHeight;
    const v = handle.current?.view();
    const useB = v ? v.mix > 0.5 : false;
    const cam = v ? (useB ? v.camB : v.camA) : clampCam(route[chRef.current].start, route[chRef.current].aspect, sa);
    const fade = v ? Math.abs(v.mix - 0.5) * 2 : 1;
    route[chRef.current].spots.forEach((s, i) => {
      const b = spotEls.current[i];
      if (!b) return;
      const [x, y] = projectPoint(s.q, depthAt(route[chRef.current], s.q), v?.look ?? [0, 0], cam, sa, route[chRef.current].aspect);
      const out = x < 0.04 || x > 0.96 || y < 0.1 || y > 0.9;
      b.style.transform = `translate3d(${x * el.clientWidth}px, ${y * el.clientHeight}px, 0)`;
      b.style.opacity = out ? "0" : String(fade);
      b.style.pointerEvents = out || fade < 0.5 ? "none" : "auto";
    });
  };

  // scroll → frame
  useEffect(() => {
    const onScroll = () => {
      const el = section.current, st = stage.current;
      if (!el || !st) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      const fr = frameAt(p, st.clientWidth / st.clientHeight);
      setCh((c) => (c === fr.shown ? c : fr.shown));
      handle.current?.frame({ a: fr.a.id, b: fr.b.id, mix: fr.mix, camA: fr.camA, camB: fr.camB });
      if (handle.current) handle.current.preload(route[Math.min(fr.i + 2, N - 1)].id);
      if (!handle.current) placeSpots();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  });

  // WebGL: when near, after the first interaction
  useEffect(() => {
    const el = section.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let cancelWait: (() => void) | null = null;
    const start = async () => {
      try {
        const { mountHouse } = await import("./house-gl");
        if (!alive || !canvas.current) return;
        const small = window.innerWidth < 900;
        const sc = scenes.map((s) => (s.id === "exterior" && small ? { ...s, img: "/tour/glasshouse-1200.webp" } : s));
        const h = await mountHouse(canvas.current, sc, route[0].id, () => placeSpots());
        if (!alive) { h.dispose(); return; }
        handle.current = h;
        h.preload(route[1].id);
        setGl(true);
        window.dispatchEvent(new Event("scroll"));
      } catch {
        /* photos stay */
      }
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      cancelWait = afterInteraction(start);
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => { alive = false; io.disconnect(); cancelWait?.(); handle.current?.dispose(); handle.current = null; };
  }, []);

  // look: mouse, tilt, idle drift
  useEffect(() => {
    const el = stage.current!;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      lastInput.current = performance.now();
      handle.current?.look([((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2]);
    };
    const onLeave = () => handle.current?.look([0, 0]);
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      lastInput.current = performance.now();
      handle.current?.look([Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (e.beta - 45) / 25))]);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    if (getTiltSupport() === "auto") window.addEventListener("deviceorientation", onOrient);
    const id = window.setInterval(() => {
      if (performance.now() - lastInput.current < 2500) return;
      const t = performance.now() / 1000;
      handle.current?.look([Math.sin(t * 0.35) * 0.55, Math.sin(t * 0.23) * 0.3]);
    }, 120);
    (el as HTMLDivElement & { _orient?: typeof onOrient })._orient = onOrient;
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onOrient);
      clearInterval(id);
    };
  }, []);

  // Esc closes the close-up
  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDetail(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

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

  const goTo = (key: string) => {
    const i = route.findIndex((r) => r.key === key || (r.id === key && r.key !== "finale"));
    if (i < 0) return;
    const el = section.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((i + 0.35) / N) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  const toggleLights = () => {
    const v = !lights;
    setLights(v);
    handle.current?.lights(v ? 1 : 0);
  };

  const roomNo = route.filter((r) => r.floor !== "Outside" || r.key === "terrace").findIndex((r) => r.key === room.key) + 1;
  const roomCount = route.filter((r) => r.floor !== "Outside" || r.key === "terrace").length;

  return (
    <section ref={section} id="tour3d" aria-labelledby="tour3d-h" className="relative bg-re-navy" style={{ height: `${N * 85}vh` }}>
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* photo layer: instant, and the fallback */}
        <AnimatePresence initial={false}>
          <m.div key={room.key} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimised */}
            <img
              src={scenes.find((s) => s.id === room.id)!.img.replace("glasshouse-2000", "glasshouse-1200")}
              alt={`${room.title}: AI-generated photo of a fictional home`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </m.div>
        </AnimatePresence>
        <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${gl ? "opacity-100" : "opacity-0"}`} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,17,52,0.6),transparent_28%,transparent_62%,rgba(7,17,52,0.85))]" aria-hidden="true" />

        {/* hotspots */}
        {room.spots.map((s, i) => (
          <button
            key={`${room.key}-${s.label}`}
            ref={(el) => { spotEls.current[i] = el; }}
            type="button"
            onClick={() => (s.go ? goTo(s.go) : s.detail ? setDetail(s.detail) : setTip(tip === i ? null : i))}
            aria-label={s.label}
            aria-expanded={!s.go && !s.detail ? tip === i : undefined}
            className="group absolute left-0 top-0 -ml-5 -mt-5 transition-opacity duration-300"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-white/25 ring-2 ring-white/85 backdrop-blur transition group-hover:bg-re-cyan">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
              <span className="relative text-sm font-bold text-white">{s.detail ? "⤢" : s.go ? "→" : "+"}</span>
            </span>
            <span className={`absolute left-12 top-1/2 w-max max-w-[16rem] -translate-y-1/2 rounded-2xl bg-re-navy/85 px-3 py-2 text-left text-xs text-white shadow-xl backdrop-blur transition ${tip === i ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
              <b className="block text-sm">{s.label}</b>
              {tip === i ? s.text : s.detail ? "Tap for a close-up" : s.go ? "Go to this room" : "Tap for details"}
            </span>
          </button>
        ))}

        {/* room card */}
        <div className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-20 sm:px-8 sm:pt-24 lg:px-14">
          <AnimatePresence mode="wait">
            <m.div
              key={room.key}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md rounded-3xl border border-white/15 bg-re-navy/50 p-5 text-white shadow-2xl backdrop-blur-md sm:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-re-cyan">
                {room.floor}
                {roomNo > 0 && <span className="text-white/60"> · Room {roomNo} of {roomCount}</span>}
              </p>
              {ch === 0 ? (
                <h2 id="tour3d-h" className="mt-2 font-re text-4xl tracking-tight sm:text-5xl">{room.title}</h2>
              ) : (
                <h3 className="mt-2 font-re text-3xl tracking-tight sm:text-4xl">{room.title}</h3>
              )}
              <p className="mt-2.5 text-sm text-white/80 sm:text-base">{room.body}</p>
              {room.facts && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {room.facts.map((f) => <li key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/15">{f}</li>)}
                </ul>
              )}
              {room.key === "finale" && (
                <div className="pointer-events-auto mt-5 flex flex-wrap gap-2">
                  <a href="#tour" className="rounded-full bg-re-cyan px-5 py-3 text-sm font-semibold text-re-navy">Book a private viewing</a>
                  <button type="button" onClick={() => goTo("arrive")} className="rounded-full px-5 py-3 text-sm font-semibold ring-1 ring-white/30">Walk through again</button>
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* floor plan navigator */}
        <nav aria-label="Floor plan" className="absolute right-4 top-20 hidden w-56 rounded-2xl bg-re-navy/60 p-3 text-white ring-1 ring-white/15 backdrop-blur-md sm:right-8 sm:top-24 md:block lg:right-14">
          {plans.map((pl) => (
            <div key={pl.floor} className="mb-2 last:mb-0">
              <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${room.floor === pl.floor ? "text-re-cyan" : "text-white/55"}`}>{pl.floor}</p>
              <svg viewBox="0 0 100 64" className="w-full">
                {pl.rooms.map((r) => {
                  const on = room.key === r.key;
                  return (
                    <g key={r.key} role="link" tabIndex={0} aria-label={`Go to ${r.label}`} aria-current={on ? "location" : undefined} onClick={() => goTo(r.key)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), goTo(r.key))} className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-white">
                      <rect x={r.r[0]} y={r.r[1]} width={r.r[2]} height={r.r[3]} rx="2" fill={on ? "#12d6f8" : "rgba(255,255,255,0.08)"} stroke={on ? "#12d6f8" : "rgba(255,255,255,0.3)"} strokeWidth="0.8" style={{ transition: "fill .3s" }} />
                      <text x={r.r[0] + r.r[2] / 2} y={r.r[1] + r.r[3] / 2 + 2.2} textAnchor="middle" fontSize="6.5" fontWeight="600" fill={on ? "#071134" : "rgba(255,255,255,0.85)"}>{r.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ))}
        </nav>

        {/* bottom bar */}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 px-4 pb-24 sm:px-8 md:pb-5 lg:px-14">
          <nav aria-label="Rooms" className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-re-navy/60 p-1 ring-1 ring-white/15 backdrop-blur [scrollbar-width:none]">
            {route.map((r, i) => (
              <button key={r.key} type="button" onClick={() => goTo(r.key)} aria-current={ch === i ? "step" : undefined} aria-label={r.title} className="group grid h-7 min-w-7 place-items-center">
                <span className={`block h-2 rounded-full transition-all duration-500 ${ch === i ? "w-7 bg-re-cyan" : "w-2 bg-white/40 group-hover:bg-white/75"}`} />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {tiltSupport === "ask" && !tiltOn && gl && (
              <button type="button" onClick={enableTilt} className="rounded-full bg-re-navy/60 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">Tilt to look around</button>
            )}
            {gl && (
              <button type="button" onClick={toggleLights} aria-pressed={lights} className="flex items-center gap-2 rounded-full bg-re-navy/60 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">
                <span className={`h-2 w-2 rounded-full ${lights ? "bg-[#f7d48a] shadow-[0_0_10px_#f7d48a]" : "bg-white/30"}`} />
                Lights {lights ? "on" : "off"}
              </button>
            )}
            <span className="hidden rounded-full bg-re-navy/60 px-4 py-2 text-xs text-white/75 ring-1 ring-white/15 backdrop-blur lg:inline">
              Scroll to walk through · {gl ? "move to look around" : "tap the dots"}
            </span>
          </div>
        </div>
        <p className="absolute bottom-1 right-4 text-[10px] text-white/40 sm:right-8">AI-generated images of a fictional home</p>
      </div>

      {/* detail close-up */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {detail && (
              <m.div
                role="dialog"
                aria-modal="true"
                aria-label={details[detail].title}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030820]/90 p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && setDetail(null)}
                data-lenis-prevent
              >
                <m.figure initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-re-navy text-white shadow-2xl ring-1 ring-white/15">
                  <div className="aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
                    <img src={details[detail].img} alt={details[detail].title} className="dm-kenburns h-full w-full object-cover" />
                  </div>
                  <figcaption className="p-5 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-re-cyan">Detail</p>
                    <p className="mt-1 font-re text-2xl sm:text-3xl">{details[detail].title}</p>
                    <p className="mt-2 max-w-2xl text-white/75">{details[detail].text}</p>
                  </figcaption>
                  <button type="button" autoFocus onClick={() => setDetail(null)} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-re-navy/70 ring-1 ring-white/25 backdrop-blur">✕</button>
                </m.figure>
              </m.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
