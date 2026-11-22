"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { canUse3D } from "./three/support";
import type { CityHandle } from "./three/city-scene";

// Only standards we commit to. Swap in real client results as they come in.
const stats = [
  { value: 95, suffix: "+", label: "Lighthouse score target on every launch" },
  { value: 100, suffix: "%", label: "Custom design. Zero templates" },
  { value: 2.5, suffix: "s", prefix: "<", decimals: 1, label: "Load-time target (LCP) on mobile" },
  { value: 24, suffix: "/7", label: "Uptime monitoring on care plans" },
];

function Counter({ value, decimals = 0, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = prefix + v.toFixed(decimals) + suffix),
    });
    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/**
 * "Growth city": a pinned, scroll-driven WebGL skyline that rises as you scroll,
 * with our delivery standards laid over it. Loads only when the section comes near.
 * Without WebGL (or with reduced motion) a CSS skyline stands in.
 */
export default function Stats() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<CityHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => handle.current?.setProgress(v));

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let alive = true;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // the WebGL probe is only run once the section is near, never during start-up
        if (!canUse3D()) return;
        const { mountCityScene } = await import("./three/city-scene");
        if (!alive || !canvas.current) return;
        try {
          handle.current = mountCityScene(canvas.current, { small: window.innerWidth < 768 });
          handle.current.setProgress(scrollYProgress.get());
          requestAnimationFrame(() => setReady(true));
        } catch {
          /* keep the CSS skyline */
        }
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
      handle.current?.dispose();
      handle.current = null;
    };
  }, [scrollYProgress]);

  return (
    <section ref={section} aria-labelledby="growth-h" className="relative h-[180vh] border-y border-line md:h-[230vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
        {/* CSS skyline fallback */}
        <div data-in={seen || undefined} className={`city-fallback absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-0" : ""}`} aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} style={{ "--h": `${12 + (i / 27) ** 1.6 * 55 + ((i * 37) % 11)}%`, "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,transparent_28%,transparent_55%,var(--color-ink)_100%)]" aria-hidden="true" />

        <div className="container-x pointer-events-none relative flex h-full flex-col justify-between py-24 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Built to compound</p>
            <h2 id="growth-h" className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Growth, <span className="text-gradient">engineered.</span>
            </h2>
            <p className="mt-4 max-w-md text-paper/70">
              Every site we ship is built to the same standards, so traffic, rankings and AI citations stack up month after month.
            </p>
          </div>
          <div>
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="pointer-events-auto rounded-2xl border border-white/10 bg-ink/80 p-4 sm:p-6 lg:bg-ink/45 lg:backdrop-blur-md">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-bold tracking-tight text-paper sm:text-6xl">
                      <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                    </span>
                    <span className="mt-1.5 block max-w-[14rem] text-xs text-mute sm:mt-2 sm:text-sm">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-right text-[11px] uppercase tracking-[0.2em] text-mute/70">3D illustration<span className="hidden [@media(pointer:fine)]:inline"> · Move your cursor over the city</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
