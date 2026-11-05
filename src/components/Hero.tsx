"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform } from "motion/react";
import MagneticButton from "./MagneticButton";
import OrbCss from "./OrbCss";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => <OrbCss /> });

const words = [
  { text: "Original.", className: "text-paper" },
  { text: "Digital.", className: "text-gradient" },
  { text: "Solutions!", className: "text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)] sm:[-webkit-text-stroke:2px_var(--color-paper)]" },
];

type Nav = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/**
 * Real-time WebGL only where it's cheap to run: large screens with a mouse, enough CPU/RAM,
 * no data-saver and no reduced-motion preference. It starts on the first interaction (or after
 * a long idle fallback), so it never competes with the page's initial load.
 */
function useWebGLWhenReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const nav = navigator as Nav;
    const capable =
      window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !nav.connection?.saveData &&
      (nav.deviceMemory ?? 8) >= 4 &&
      (nav.hardwareConcurrency ?? 8) >= 4;
    if (!capable) return;

    const events = ["pointermove", "pointerdown", "wheel", "keydown", "scroll"] as const;
    let timer = 0;
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, go));
      clearTimeout(timer);
    };
    function go() {
      cleanup();
      setReady(true);
    }
    events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    timer = window.setTimeout(go, 6000);
    return cleanup;
  }, []);
  return ready;
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const show3D = useWebGLWhenReady();
  const [url, setUrl] = useState("");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const startCheck = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("og:prefill", { detail: { url, service: "Free Site Check" } }));
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="top" className="noise relative isolate min-h-[100svh] overflow-hidden pt-28 sm:pt-32">
      {/* backdrop: radial gradients instead of huge CSS blurs (much cheaper to paint) */}
      <div className="grid-bg absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" aria-hidden="true" />
      <div className="absolute -left-56 top-0 -z-20 h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(123_97_255/0.28),transparent)]" aria-hidden="true" />
      <div className="absolute -right-40 bottom-[-10rem] -z-20 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgb(198_244_50/0.14),transparent)]" aria-hidden="true" />

      {/* 3D scene */}
      <m.div
        style={{ scale: sceneScale, opacity: sceneOpacity }}
        className="absolute inset-x-0 top-0 -z-10 h-[62svh] opacity-50 sm:h-full sm:opacity-60 lg:inset-y-0 lg:left-[42%] lg:opacity-100"
        aria-hidden="true"
      >
        {show3D ? (
          <div className="hero-fade-in h-full w-full">
            <HeroScene />
          </div>
        ) : (
          <OrbCss />
        )}
      </m.div>

      <m.div style={{ y: textY }} className="container-x relative flex min-h-[calc(100svh-8rem)] flex-col justify-center pb-16">
        {/* Entrance animations are pure CSS: they play on first paint, before any JavaScript runs. */}
        <p
          className="hero-rise mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-mute"
          style={{ "--delay": "0ms" } as React.CSSProperties}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          Digital agency · Worldwide
        </p>

        <h1 className="font-display text-[clamp(3.2rem,11vw,9.5rem)] font-bold leading-[0.9] tracking-[-0.045em]">
          <span className="sr-only">OG WebWorks: Original. Digital. Solutions!</span>
          {words.map((w, i) => (
            <span key={w.text} className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
              <span className={`hero-word block ${w.className}`} style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}>
                {w.text}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-rise mt-8 max-w-xl text-lg text-paper/75 sm:text-xl" style={{ "--delay": "250ms" } as React.CSSProperties}>
          We design and build fast, original websites, then grow them with SEO, AI search (AEO & GEO) and ads. When
          something breaks, we fix it.
        </p>

        <div className="hero-rise mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" style={{ "--delay": "380ms" } as React.CSSProperties}>
          <MagneticButton href="#contact">Get a Free Proposal</MagneticButton>

          <form onSubmit={startCheck} className="flex w-full max-w-md items-center rounded-full border border-line bg-white/[0.04] p-1.5 focus-within:border-lime/60">
            <label htmlFor="hero-url" className="sr-only">
              Your website URL
            </label>
            <input
              id="hero-url"
              type="text"
              inputMode="url"
              placeholder="yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-paper placeholder:text-mute focus:outline-none"
            />
            <button type="submit" className="shrink-0 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20">
              Free Site Check →
            </button>
          </form>
        </div>
      </m.div>

      {/* scroll cue (CSS only) */}
      <div
        className="hero-rise absolute bottom-8 right-10 hidden flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-mute lg:flex"
        style={{ "--delay": "900ms" } as React.CSSProperties}
        aria-hidden="true"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="scroll-cue absolute left-0 top-0 h-4 w-px bg-lime" />
        </span>
      </div>
    </section>
  );
}
