"use client";

import { useRef } from "react";
import { m, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { services } from "@/lib/site";

const items = [...services.map((s) => s.title), "Core Web Vitals", "Schema & Entities", "Conversion Design"];

const Star = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand sm:h-7 sm:w-7" fill="currentColor" aria-hidden="true">
    <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
  </svg>
);

/**
 * Two kinetic ribbons running in opposite directions. Scrolling speeds them up,
 * flips their direction with the scroll and skews the type with the velocity.
 */
function Row({ base, outline = false, hidden = false }: { base: number; outline?: boolean; hidden?: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const skew = useTransform(vel, [-2500, 0, 2500], [8, 0, -8]);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    const move = dir.current * base * (delta / 1000) * (1 + Math.abs(f));
    x.set(wrap(-50, 0, x.get() + move));
  });
  const tx = useTransform(x, (v) => `${v}%`);

  const list = (dup: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || dup || undefined}>
      {items.map((t) => (
        <li
          key={t}
          className={`flex items-center gap-10 whitespace-nowrap font-display text-2xl font-semibold tracking-tight sm:text-4xl ${outline ? "text-transparent [-webkit-text-stroke:1px_rgb(161_193_250/0.7)]" : ""}`}
        >
          {t}
          <Star />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <m.div className="flex w-max will-change-transform" style={{ x: tx, skewX: skew }}>
        {list(false)}
        {list(true)}
      </m.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="What we do" className="relative z-10 -rotate-1 space-y-3 border-y border-line bg-ink-2 py-6">
      <Row base={-2.2} />
      <Row base={2.2} outline hidden />
    </section>
  );
}
