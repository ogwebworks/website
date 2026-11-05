"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import MagneticButton from "./MagneticButton";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => <OrbFallback /> });

function OrbFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <div className="h-[55%] aspect-square animate-pulse-glow rounded-full bg-[radial-gradient(circle_at_35%_30%,#c6f432_0%,#7b61ff_45%,transparent_70%)] blur-2xl" />
    </div>
  );
}

const words = [
  { text: "Original.", className: "text-paper" },
  { text: "Digital.", className: "text-gradient" },
  { text: "Solutions!", className: "text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)] sm:[-webkit-text-stroke:2px_var(--color-paper)]" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [show3D, setShow3D] = useState(false);
  const [url, setUrl] = useState("");

  // Mount WebGL after the page is interactive, so it never blocks first paint.
  useEffect(() => {
    if (reduce) return;
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const id = ric ? ric(() => setShow3D(true)) : window.setTimeout(() => setShow3D(true), 300);
    return () => {
      if (!ric) clearTimeout(id);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const startCheck = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("og:prefill", { detail: { url, service: "Free Site Check" } }));
    document.querySelector("#contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section ref={ref} id="top" className="noise relative isolate min-h-[100svh] overflow-hidden pt-28 sm:pt-32">
      {/* backdrop */}
      <div className="grid-bg absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" aria-hidden="true" />
      <div className="absolute -left-40 top-20 -z-20 h-[32rem] w-[32rem] rounded-full bg-violet/25 blur-[120px]" aria-hidden="true" />
      <div className="absolute -right-20 bottom-0 -z-20 h-[26rem] w-[26rem] rounded-full bg-lime/15 blur-[120px]" aria-hidden="true" />

      {/* 3D scene */}
      <m.div
        style={{ scale: sceneScale, opacity: sceneOpacity }}
        className="absolute inset-x-0 top-0 -z-10 h-[62svh] opacity-50 sm:h-full sm:opacity-60 lg:inset-y-0 lg:left-[42%] lg:opacity-100"
        aria-hidden="true"
      >
        {show3D ? <HeroScene /> : <OrbFallback />}
      </m.div>

      <m.div style={{ y: textY }} className="container-x relative flex min-h-[calc(100svh-8rem)] flex-col justify-center pb-16">
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-mute backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          Digital agency · Worldwide
        </m.p>

        <h1 className="font-display text-[clamp(3.2rem,11vw,9.5rem)] font-bold leading-[0.9] tracking-[-0.045em]">
          <span className="sr-only">OG WebWorks: Original. Digital. Solutions!</span>
          {words.map((w, i) => (
            <span key={w.text} className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
              <m.span
                className={`block ${w.className}`}
                initial={{ y: "110%", rotate: 4 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease }}
              >
                {w.text}
              </m.span>
            </span>
          ))}
        </h1>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
          className="mt-8 max-w-xl text-lg text-paper/75 sm:text-xl"
        >
          We design and build fast, original websites, then grow them with SEO, AI search (AEO & GEO) and ads. When
          something breaks, we fix it.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <MagneticButton href="#contact">Get a Free Proposal</MagneticButton>

          <form onSubmit={startCheck} className="flex w-full max-w-md items-center rounded-full border border-line bg-white/[0.04] p-1.5 backdrop-blur focus-within:border-lime/60">
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
        </m.div>
      </m.div>

      {/* scroll cue */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 right-10 hidden flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-mute lg:flex"
        aria-hidden="true"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <m.span
            className="absolute left-0 top-0 h-4 w-px bg-lime"
            animate={{ y: [-16, 40] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          />
        </span>
      </m.div>
    </section>
  );
}
