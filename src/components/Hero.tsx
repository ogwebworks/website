"use client";

import { useRef, useState } from "react";
import { m, useScroll, useTransform } from "motion/react";
import MagneticButton from "./MagneticButton";
import HeroVisual from "./HeroVisual";

const words = [
  { text: "Original.", className: "text-paper", glow: "rgb(242 246 255 / 0.75)" },
  { text: "Digital.", className: "text-gradient", glow: "rgb(18 214 248 / 0.85)" },
  { text: "Solutions!", className: "text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)] sm:[-webkit-text-stroke:2px_var(--color-paper)]", glow: "rgb(29 109 255 / 0.95)" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
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

      {/* Hero visual (wide screens >= 1280px): laptop + growth cards, right side */}
      <m.div
        style={{ scale: sceneScale, opacity: sceneOpacity }}
        className="absolute right-[1%] top-1/2 hidden w-[50%] max-w-[48rem] -translate-y-[46%] xl:block"
      >
        <HeroVisual />
      </m.div>

      <m.div style={{ y: textY }} className="container-x relative flex min-h-[calc(100svh-8rem)] flex-col justify-center pb-16">
        {/* Entrance animations are pure CSS: they play on first paint, before any JavaScript runs.
            Below 1280px the intro is centred and fills the first screen; the visual follows below. */}
        <div className="flex min-h-[calc(100svh-9rem)] flex-col items-center justify-center text-center xl:min-h-0 xl:items-start xl:text-left">
        <p
          className="hero-rise mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-mute"
          style={{ "--delay": "0ms" } as React.CSSProperties}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          Digital agency · Worldwide
        </p>

        <h1 className="font-display text-[clamp(3.4rem,18vw,8rem)] font-bold leading-[0.92] tracking-[-0.045em] xl:text-[clamp(4rem,8.6vw,8rem)]">
          <span className="sr-only">OG WebWorks: Original. Digital. Solutions!</span>
          {words.map((w, i) => (
            <span key={w.text} className="block pb-[0.06em]" aria-hidden="true">
              {/* "Bulb" reveal: each word flickers on in turn, then keeps a soft glowing halo */}
              <span
                className={`bulb ${i === 2 ? "bulb-falter" : ""} ${w.className}`}
                data-text={w.text}
                style={{ "--delay": `${150 + i * 750}ms`, "--glow": w.glow } as React.CSSProperties}
              >
                {w.text}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-rise mt-8 max-w-xl text-lg text-paper/75 sm:text-xl" style={{ "--delay": "1500ms" } as React.CSSProperties}>
          We design and build fast, original websites, then grow them with SEO, AI search (AEO & GEO) and ads. When
          something breaks, we fix it.
        </p>

        <div className="hero-rise mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row xl:items-center" style={{ "--delay": "1650ms" } as React.CSSProperties}>
          <MagneticButton href="#contact">Get a Free Proposal</MagneticButton>

          <form onSubmit={startCheck} className="flex w-full max-w-md items-center rounded-full border border-line bg-white/[0.04] p-1.5 focus-within:border-brand/60">
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
        </div>

        {/* Hero visual (phones/tablets/small laptops): in flow, below the calls to action */}
        <div className="hero-rise mx-auto mt-6 w-full max-w-lg lg:max-w-2xl xl:hidden" style={{ "--delay": "1800ms" } as React.CSSProperties}>
          <HeroVisual />
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
          <span className="scroll-cue absolute left-0 top-0 h-4 w-px bg-brand" />
        </span>
      </div>
    </section>
  );
}
