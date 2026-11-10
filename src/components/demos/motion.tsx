"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, m, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";

/** Headline that rises in word by word (pure CSS, plays on first paint). */
/** `wordClass` styles every word; `wordClasses[i]` styles word i (both are plain strings, safe from server components). */
export function Words({ text, delay = 0, className = "", wordClass = "", wordClasses = [] }: { text: string; delay?: number; className?: string; wordClass?: string; wordClasses?: string[] }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="dm-mask">
            <span className={`dm-word ${wordClass} ${wordClasses[i] ?? ""}`} style={{ "--i": i, "--d": `${delay}ms` } as React.CSSProperties}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

/** Infinite kinetic ticker (CSS). Content is duplicated for a seamless loop. */
export function Marquee({ children, duration = 40, reverse = false, className = "" }: { children: ReactNode; duration?: number; reverse?: boolean; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`dm-marquee ${reverse ? "dm-marquee-rev" : ""} hover:[animation-play-state:paused]`} style={{ "--dur": `${duration}s` } as React.CSSProperties}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

/** Number that counts up when scrolled into view. */
export function CountUp({ to, prefix = "", suffix = "", decimals = 0, className = "" }: { to: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = prefix + v.toFixed(decimals) + suffix) });
    return () => c.stop();
  }, [inView, to, prefix, suffix, decimals]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {to.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Moves its content vertically as the page scrolls (parallax). */
export function Parallax({ children, amount = 60, className = "" }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <m.div style={{ y, height: `calc(100% + ${amount * 2}px)`, marginTop: -amount }} className="w-full">
        {children}
      </m.div>
    </div>
  );
}

/** Card that tilts toward the cursor with a moving highlight. */
export function Tilt({ children, className = "", max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 160, damping: 18 });
  const ry = useSpring(0, { stiffness: 160, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useTransform([gx, gy], ([x, y]) => `radial-gradient(400px circle at ${x}% ${y}%, rgb(255 255 255 / 0.12), transparent 60%)`);
  return (
    <div className="[perspective:1000px]">
      <m.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * max * 2);
          rx.set(-(py - 0.5) * max * 2);
          gx.set(px * 100);
          gy.set(py * 100);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        className={`relative ${className}`}
      >
        {children}
        <m.div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glow }} aria-hidden="true" />
      </m.div>
    </div>
  );
}

/** Fades/slides children in when scrolled into view (staggered by index). */
export function InView({ children, i = 0, className = "", y = 30, as = "div" }: { children: ReactNode; i?: number; className?: string; y?: number; as?: "div" | "li" }) {
  const M = m[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/** Rising particles (embers, pollen, leaves) with deterministic positions. */
export function Particles({ count = 24, className = "", render }: { count?: number; className?: string; render?: (i: number) => ReactNode }) {
  const items = Array.from({ length: count }, (_, i) => ({
    x: `${(i * 37) % 100}%`,
    s: `${3 + ((i * 7) % 6)}px`,
    dur: `${7 + ((i * 13) % 9)}s`,
    d: `${-((i * 1.7) % 12)}s`,
    drift: `${((i % 5) - 2) * 30}px`,
  }));
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((p, i) =>
        render ? (
          <span key={i} className="dm-rise !bg-none" style={{ "--x": p.x, "--s": "auto", "--dur": p.dur, "--d": p.d, "--drift": p.drift } as React.CSSProperties}>
            {render(i)}
          </span>
        ) : (
          <span key={i} className="dm-rise" style={{ "--x": p.x, "--s": p.s, "--dur": p.dur, "--d": p.d, "--drift": p.drift } as React.CSSProperties} />
        ),
      )}
    </div>
  );
}

/** Live clock value that is null during server render (avoids hydration mismatch). */
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}
