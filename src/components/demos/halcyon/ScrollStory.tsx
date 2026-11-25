"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { floorBand, fmt, img, penthouse, phSpots, priceOf, resSpots, statusOf, types } from "./data";

/**
 * The scroll film: a waterfront tower where a highlight climbs floor by floor, a dive through
 * the facade into a 3D cutaway of Residence A, a glide into its living room, back out to the
 * crown and into the Sky Penthouse. All CSS transforms on four photos, driven by scroll
 * (smoothed), so it runs on phones without WebGL.
 */

type LayerKey = "tower" | "resCut" | "living" | "phCut";
type Cam = { z: number; fx: number; fy: number; o: number };
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const RES = types[0];
const DIVE_FLOOR = 15;
const center = (f: number) => { const b = floorBand(f); return (b.top + b.bottom) / 2; };

function frame(p: number) {
  const climb = ease(seg(p, 0.06, 0.26));
  const floor = Math.round(3 + climb * (DIVE_FLOOR - 3));
  const toPh = ease(seg(p, 0.74, 0.8));
  const tower: Cam = { z: 1, fx: 0.5, fy: 0.45, o: 1 };
  // climb + gentle push, then dive into the facade
  tower.z = 1 + 0.25 * ease(seg(p, 0.03, 0.28));
  tower.fy = lerp(0.45, center(floor), ease(seg(p, 0.04, 0.2)));
  const dive = ease(seg(p, 0.28, 0.38));
  tower.z += dive * 3.6;
  tower.o = 1 - seg(p, 0.355, 0.385);
  // back to the tower, up to the crown, dive again
  if (p > 0.7) {
    tower.o = seg(p, 0.72, 0.76) * (1 - seg(p, 0.845, 0.875));
    tower.z = lerp(1.05, 1.7, toPh) + ease(seg(p, 0.8, 0.87)) * 3.4;
    tower.fx = 0.5;
    tower.fy = lerp(0.45, 0.16, toPh);
  }
  const resIn = ease(seg(p, 0.36, 0.42));
  const resDive = ease(seg(p, 0.56, 0.64));
  const resCut: Cam = { z: lerp(1.35, 1, resIn) + resDive * 2.4, fx: lerp(0.5, 0.44, resDive), fy: lerp(0.5, 0.45, resDive), o: seg(p, 0.36, 0.4) * (1 - seg(p, 0.6, 0.635)) };
  const living: Cam = { z: lerp(1.04, 1.16, seg(p, 0.6, 0.76)), fx: 0.5, fy: 0.5, o: seg(p, 0.6, 0.635) * (1 - seg(p, 0.72, 0.76)) };
  const phIn = ease(seg(p, 0.85, 0.9));
  const phCut: Cam = { z: lerp(1.4, 1, phIn) + ease(seg(p, 0.96, 1)) * 0.08, fx: 0.5, fy: 0.5, o: seg(p, 0.85, 0.88) };
  const band = p < 0.33 && p > 0.03 ? { floors: [floor], kind: "res" as const } : p > 0.74 && p < 0.84 ? { floors: [23, 24], kind: "ph" as const } : null;
  const chapter =
    p < 0.06 ? "intro" : p < 0.3 ? "climb" : p < 0.4 ? "" : p < 0.58 ? "residence" : p < 0.62 ? "" : p < 0.73 ? "living" : p < 0.84 ? "phTower" : p < 0.88 ? "" : p < 0.96 ? "penthouse" : "cta";
  return { cams: { tower, resCut, living, phCut } as Record<LayerKey, Cam>, floor, band, chapter, bandAlpha: p < 0.33 ? 1 - seg(p, 0.29, 0.32) : 1 - seg(p, 0.8, 0.83) };
}

const fits: Record<LayerKey, "cover" | "contain"> = { tower: "cover", resCut: "contain", living: "cover", phCut: "contain" };
const chapters = [
  { key: "intro", label: "The tower", at: 0.0 },
  { key: "climb", label: "Choose a floor", at: 0.16 },
  { key: "residence", label: "Residence A", at: 0.48 },
  { key: "living", label: "Interiors", at: 0.68 },
  { key: "phTower", label: "Sky Penthouse", at: 0.79 },
  { key: "cta", label: "Private preview", at: 0.985 },
];

export default function ScrollStory() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const boxes = useRef<Partial<Record<LayerKey, HTMLDivElement | null>>>({});
  const bandEl = useRef<HTMLDivElement>(null);
  const tipEl = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ floor: 3, chapter: "intro", bandKind: "res" as "res" | "ph" | null });
  const [spot, setSpot] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0, cur = 0, running = false;
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = () => {
      const el = section.current!;
      const r = el.getBoundingClientRect();
      return clamp(-r.top / (r.height - window.innerHeight));
    };
    const apply = () => {
      const st = stage.current!;
      const W = st.clientWidth, H = st.clientHeight, sa = W / H;
      const portrait = sa < 0.9;
      const f = frame(cur);
      (Object.keys(f.cams) as LayerKey[]).forEach((k) => {
        const box = boxes.current[k];
        if (!box) return;
        const c = f.cams[k];
        box.style.opacity = String(c.o);
        box.style.visibility = c.o < 0.01 ? "hidden" : "visible";
        if (c.o < 0.01) return;
        const ia = img[k].aspect;
        let dw: number, dh: number;
        if (fits[k] === "cover") { if (sa > ia) { dw = W; dh = W / ia; } else { dh = H; dw = H * ia; } }
        else { const s = portrait ? 1.7 : 0.94; if (sa > ia) { dh = H * s; dw = dh * ia; } else { dw = W * s; dh = dw / ia; } }
        const ox = (W - dw) / 2, oy = (H - dh) / 2 - (portrait && fits[k] === "contain" ? H * 0.1 : 0);
        const z = c.z;
        const fx = c.fx + (look.x * 0.012) / z, fy = c.fy + (look.y * 0.01) / z;
        const px = ox + fx * dw, py = oy + fy * dh;
        const k2 = clamp((z - 1) / 0.6);
        let tx = lerp(px, W / 2, k2) - fx * dw * z;
        let ty = lerp(py, H / 2, k2) - fy * dh * z;
        if (fits[k] === "cover") {
          if (dw * z >= W) tx = clamp(tx, W - dw * z, 0);
          if (dh * z >= H) ty = clamp(ty, H - dh * z, 0);
        }
        if (fits[k] === "cover") {
          // the photo keeps the stage's size (object-fit: cover) so its painted size never changes;
          // only the transform moves it. Overlays live in an image-space box inside it.
          box.style.transform = `translate3d(${tx - ox * z}px, ${ty - oy * z}px, 0) scale(${z})`;
        } else {
          box.style.width = `${dw}px`;
          box.style.height = `${dh}px`;
          box.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${z})`;
        }
        if (k === "tower") {
          const band = bandEl.current, tip = tipEl.current;
          if (band && tip) {
            if (f.band) {
              const fl = f.band.floors;
              const top = Math.min(...fl.map((x) => floorBand(x).top)), bottom = Math.max(...fl.map((x) => floorBand(x).bottom));
              const b0 = floorBand(fl[0]);
              band.style.top = `${top * 100}%`;
              band.style.height = `${(bottom - top) * 100}%`;
              band.style.left = `${b0.left * 100}%`;
              band.style.width = `${(b0.right - b0.left) * 100}%`;
              band.style.opacity = String(f.bandAlpha);
              if (portrait) {
                tip.style.top = `${bottom * 100 + 0.6}%`;
                tip.style.left = "50%";
                tip.style.transform = `translateX(-50%) scale(${1 / z})`;
                tip.style.transformOrigin = "top center";
              } else {
                tip.style.top = `${((top + bottom) / 2) * 100}%`;
                tip.style.left = `${(b0.right + 0.012) * 100}%`;
                tip.style.transform = `translateY(-50%) scale(${1 / z})`;
                tip.style.transformOrigin = "left center";
              }
              tip.style.opacity = String(f.bandAlpha * (1 - clamp((z - 1.35) / 0.25)));
            } else {
              band.style.opacity = "0";
              tip.style.opacity = "0";
            }
          }
        }
      });
      setState((s) => (s.floor === f.floor && s.chapter === f.chapter && s.bandKind === (f.band?.kind ?? null) ? s : { floor: f.floor, chapter: f.chapter, bandKind: f.band?.kind ?? null }));
    };
    const loop = () => {
      const t = target();
      cur += (t - cur) * (reduce ? 1 : 0.1);
      look.x += (look.tx - look.x) * 0.06;
      look.y += (look.ty - look.y) * 0.06;
      apply();
      if (running) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(loop);
    });
    io.observe(section.current!);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduce) return;
      look.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      look.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    cur = target();
    apply();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("pointermove", onMove); };
  }, []);

  const goTo = (at: number) => {
    const el = section.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + at * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  const ch = state.chapter;
  const fl = state.floor;
  const st = statusOf(fl, 0);
  const layer = (k: LayerKey, alt: string, children?: React.ReactNode, eager = false) => (
    <div ref={(el) => { boxes.current[k] = el; }} className="absolute left-0 top-0 h-full w-full origin-top-left will-change-transform" style={{ opacity: k === "tower" ? 1 : 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimised */}
      <img src={img[k].lg} srcSet={`${img[k].sm} 1400w, ${img[k].lg} 2400w`} sizes="100vw" alt={alt} className={`h-full w-full select-none ${fits[k] === "cover" ? "object-cover" : ""}`} draggable={false} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding={eager ? "sync" : "async"} />
      {/* image-space box for overlays; for "cover" photos it matches object-fit: cover purely in CSS */}
      <div
        className="absolute"
        style={fits[k] === "cover"
          ? { left: "50%", top: "50%", width: `max(100cqw, calc(100cqh * ${img[k].aspect}))`, height: `max(100cqh, calc(100cqw / ${img[k].aspect}))`, transform: "translate(-50%, -50%)" }
          : { inset: 0 }}
      >
        {children}
      </div>
    </div>
  );
  const spots = (list: typeof resSpots | typeof phSpots, show: boolean, prefix: string) =>
    list.map((s, i) => {
      const id = `${prefix}-${i}`;
      return (
        <button
          key={id}
          type="button"
          onClick={() => setSpot(spot === id ? null : id)}
          aria-label={s.label}
          aria-expanded={spot === id}
          className="group absolute -ml-3 -mt-3 transition duration-500"
          style={{ left: `${s.q[0] * 100}%`, top: `${s.q[1] * 100}%`, opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.4)", transitionDelay: show ? `${i * 90}ms` : "0ms", pointerEvents: show ? "auto" : "none" }}
        >
          <span className="relative grid h-6 w-6 place-items-center rounded-full bg-hb-gold ring-4 ring-hb-gold/30">
            <span className="absolute inset-0 animate-ping rounded-full bg-hb-gold/50" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className={`absolute left-8 top-1/2 w-max max-w-[14rem] -translate-y-1/2 rounded-xl bg-hb-ink/90 px-3 py-2 text-left text-[11px] leading-snug text-white shadow-xl backdrop-blur transition ${spot === id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <b className="block text-xs">{s.label}</b>
            {s.text}
          </span>
        </button>
      );
    });

  return (
    <section ref={section} id="story" aria-label="Explore the tower" className="relative h-[1000vh] bg-hb-navy">
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden [container-type:size] bg-[radial-gradient(ellipse_at_center,#14305e,#0a1a36_70%)]">
        {layer(
          "tower",
          "Halcyon Bay Residences: a white waterfront tower with curved glass balconies (AI-generated illustration)",
          <>
            <div ref={bandEl} className="pointer-events-none absolute rounded-[3px] bg-[#f0b94f]/60 mix-blend-multiply shadow-[0_0_30px_6px_rgba(240,185,79,0.75)] outline outline-2 outline-[#ffd88a] transition-[top,height] duration-300" style={{ opacity: 0 }}>
              <span className="absolute inset-0 animate-pulse rounded-[3px] bg-[#ffcf70]/40" />
            </div>
            <div ref={tipEl} className="pointer-events-none absolute origin-left whitespace-nowrap" style={{ opacity: 0 }}>
              <div className="flex items-center gap-3 rounded-xl bg-hb-ink/90 px-3.5 py-2.5 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur">
                <span className="font-hb-serif text-3xl leading-none text-hb-gold">{state.bandKind === "ph" ? "PH" : fl}</span>
                <span className="text-[11px] leading-snug">
                  <b className="block text-[13px]">{state.bandKind === "ph" ? "Sky Penthouse" : `Residence A · Floor ${fl}`}</b>
                  {state.bandKind === "ph" ? `Floors 23-24 · ${fmt(penthouse.price)} · 1 of 2 left` : `${RES.beds} · ${RES.sqft.toLocaleString("en-US")} sf · ${st === "Sold" ? "Sold" : `${st} · ${fmt(priceOf(RES, fl))}`}`}
                </span>
              </div>
            </div>
          </>,
          true,
        )}
        {layer("resCut", "Isometric 3D cutaway of Residence A, a two-bedroom apartment (AI-generated)", spots(resSpots, ch === "residence", "r"))}
        {layer("living", "Residence A living room and kitchen with a view of the bay (AI-generated)")}
        {layer("phCut", "Isometric 3D cutaway of the L-shaped Sky Penthouse with terrace pool (AI-generated)", spots(phSpots, ch === "penthouse", "p"))}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,18,34,0.45),transparent_25%,transparent_70%,rgba(10,18,34,0.55))]" aria-hidden="true" />

        {/* chapter copy */}
        <div className="pointer-events-none absolute inset-0 px-4 pb-24 pt-24 sm:px-10 lg:px-16">
          <AnimatePresence mode="wait" initial={false}>
            {ch === "intro" && (
              <m.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="max-w-md text-center text-white sm:mt-[8vh] sm:text-left lg:max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-hb-gold">Bayview · Completion {"Spring 2028"}</p>
                <h1 className="mt-3 font-hb-serif text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.02] drop-shadow-[0_4px_30px_rgba(0,0,0,0.55)]">Halcyon Bay Residences</h1>
                <p className="mt-4 max-w-md text-white/90 drop-shadow sm:max-w-sm">Twenty-four floors on the water. Scroll to rise through the tower and step inside.</p>
                <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-white/75">Scroll ↓</p>
              </m.div>
            )}
            {ch === "climb" && (
              <m.div key="climb" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="hidden max-w-xs rounded-2xl bg-hb-ink/70 p-5 text-white ring-1 ring-white/10 backdrop-blur-md sm:mt-10 sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-hb-gold">Residence A</p>
                <p className="mt-1 font-hb-serif text-5xl leading-none tabular-nums">Floor {fl}</p>
                <p className="mt-3 text-sm text-white/80">{RES.beds} · {RES.baths} bath · {RES.sqft.toLocaleString("en-US")} sf + {RES.outdoor} sf balcony. Every floor up adds more of the bay.</p>
              </m.div>
            )}
            {ch === "residence" && (
              <m.aside key="res" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-x-4 bottom-20 rounded-2xl bg-hb-ivory/95 p-4 text-hb-ink shadow-2xl sm:static sm:ml-auto sm:mt-6 sm:max-w-xs sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#74592a]">Floors 3-22 · Facing the bay</p>
                <h2 className="mt-1 font-hb-serif text-4xl">Residence A</h2>
                <dl className="mt-4 hidden grid-cols-3 gap-2 text-center sm:grid">
                  {[[RES.beds.split(" ")[0], "beds + den"], [String(RES.baths), "baths"], [RES.sqft.toLocaleString("en-US"), "sq ft"]].map(([n, l]) => (
                    <div key={l} className="rounded-xl bg-hb-sand/70 px-1 py-2"><dt className="sr-only">{l}</dt><dd><span className="block font-hb-serif text-xl">{n}</span><span className="text-[10px] uppercase tracking-wider text-hb-mute">{l}</span></dd></div>
                  ))}
                </dl>
                <p className="mt-3 text-sm text-hb-mute">From {fmt(RES.from)} · tap the gold points to explore each room.</p>
                <a href="#availability" className="pointer-events-auto mt-4 inline-block rounded-full bg-hb-ink px-4 py-2.5 text-sm font-semibold text-white">See availability</a>
              </m.aside>
            )}
            {ch === "living" && (
              <m.div key="living" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-24 left-4 max-w-sm rounded-2xl bg-hb-ink/70 p-5 text-white ring-1 ring-white/10 backdrop-blur-md sm:left-10 lg:left-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-hb-gold">Residence A · Interiors</p>
                <p className="mt-1 font-hb-serif text-3xl">Living &amp; kitchen</p>
                <p className="mt-2 text-sm text-white/80">Eighteen feet of glass to the bay, a marble waterfall island and wide-plank oak underfoot.</p>
              </m.div>
            )}
            {ch === "phTower" && (
              <m.div key="pht" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-xs rounded-2xl bg-hb-ink/70 p-5 text-white ring-1 ring-white/10 backdrop-blur-md sm:mt-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-hb-gold">The crown</p>
                <p className="mt-1 font-hb-serif text-4xl leading-tight">Sky Penthouse</p>
                <p className="mt-3 text-sm text-white/80">Two duplex residences on floors 23-24, each with a private plunge pool. One remains.</p>
              </m.div>
            )}
            {ch === "penthouse" && (
              <m.aside key="ph" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-x-4 bottom-20 rounded-2xl bg-hb-ivory/95 p-4 text-hb-ink shadow-2xl sm:static sm:ml-auto sm:mt-6 sm:max-w-xs sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#74592a]">Floors 23-24 · 1 of 2 remaining</p>
                <h2 className="mt-1 font-hb-serif text-4xl">Sky Penthouse</h2>
                <p className="mt-3 text-sm text-hb-mute">{penthouse.beds} · {penthouse.baths} baths · {penthouse.sqft.toLocaleString("en-US")} sf interior + {penthouse.outdoor.toLocaleString("en-US")} sf terrace with plunge pool.</p>
                <p className="mt-3 font-hb-serif text-2xl">{fmt(penthouse.price)}</p>
              </m.aside>
            )}
            {ch === "cta" && (
              <m.div key="cta" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="pointer-events-auto mx-auto mt-[12vh] max-w-lg rounded-3xl bg-hb-ivory/95 p-7 text-center text-hb-ink shadow-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#74592a]">Private previews</p>
                <h2 className="mt-2 font-hb-serif text-4xl">See Halcyon Bay in person</h2>
                <p className="mt-3 text-hb-mute">Tour the sales gallery and model residence, by appointment.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <a href="#enquire" className="rounded-full bg-hb-ink px-5 py-3 text-sm font-semibold text-white">Book a preview</a>
                  <a href="#availability" className="rounded-full px-5 py-3 text-sm font-semibold ring-1 ring-hb-ink/20">View availability</a>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* chapter rail */}
        <nav aria-label="Story chapters" className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-hb-ink/60 p-1 ring-1 ring-white/10 backdrop-blur md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col">
          {chapters.map((c) => {
            const on = ch === c.key || (c.key === "phTower" && ch === "penthouse") || (c.key === "living" && ch === "living");
            return (
              <button key={c.key} type="button" onClick={() => goTo(c.at)} aria-label={c.label} aria-current={on ? "step" : undefined} className="group relative grid h-7 w-7 place-items-center">
                <span className={`block rounded-full transition-all ${on ? "h-2.5 w-2.5 bg-hb-gold" : "h-1.5 w-1.5 bg-white/50 group-hover:bg-white"}`} />
                <span className="pointer-events-none absolute right-9 hidden whitespace-nowrap rounded-md bg-hb-ink/90 px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100 md:block">{c.label}</span>
              </button>
            );
          })}
        </nav>
        <p className="absolute bottom-1 right-3 text-[10px] text-white/45">Illustrations: AI-generated, fictional development</p>
      </div>
    </section>
  );
}
