"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

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

export default function Stats() {
  return (
    <section aria-label="Our standards" className="border-y border-line bg-ink-2/60">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`border-line px-2 py-10 sm:px-6 sm:py-14 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block font-display text-5xl font-bold tracking-tight text-paper sm:text-7xl">
                <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </span>
              <span className="mt-3 block max-w-[14rem] text-sm text-mute">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
