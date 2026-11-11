"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import Riso from "./Riso";

const panels = [
  { n: "I", t: "Fire", d: "One oak-and-cherry hearth, lit every morning at six. Everything we cook passes over it.", seed: 4, bg: "bg-rs-paper" },
  { n: "II", t: "Season", d: "Thirty-two farms within a day's drive. The menu changes when the market does.", seed: 9, bg: "bg-rs-paper2" },
  { n: "III", t: "Table", d: "Loud, warm and shared. Plates arrive when they're ready, and the wine list is mostly natural.", seed: 15, bg: "bg-rs-paper" },
];

/** Pinned section that scrolls sideways through three panels (vertical stack on small screens). */
export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const panel = (p: (typeof panels)[number]) => (
    <div className={`grid h-full w-full grid-cols-[minmax(0,1fr)] items-center gap-8 px-5 py-16 sm:px-10 md:grid-cols-2 lg:px-20 ${p.bg}`}>
      <div className="min-w-0">
        <p className="font-rs-mono text-sm uppercase tracking-[0.2em] text-rs-deep">Chapter {p.n}</p>
        <h3 className="mt-3 font-rs text-[clamp(3.5rem,9vw,8.5rem)] break-words font-extrabold leading-[0.85] tracking-[-0.05em] text-rs-ink">{p.t}.</h3>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-rs-mute">{p.d}</p>
      </div>
      <Riso seed={p.seed} className="aspect-square w-full max-w-md justify-self-center rounded-[3rem] ring-2 ring-rs-ink" />
    </div>
  );

  return (
    <section id="story" aria-labelledby="rs-story-h">
      <h2 id="rs-story-h" className="sr-only">Our story</h2>
      {/* small screens: simple stack */}
      <div className="md:hidden">{panels.map((p) => <div key={p.n}>{panel(p)}</div>)}</div>
      {/* md+: pinned horizontal scroll */}
      <div ref={ref} className="relative hidden h-[300vh] md:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <m.div style={{ x }} className="flex h-full w-[300%]">
            {panels.map((p) => (
              <div key={p.n} className="h-full w-1/3 border-r-2 border-rs-ink">{panel(p)}</div>
            ))}
          </m.div>
          <div className="absolute inset-x-10 bottom-8 h-1 bg-rs-ink/15" aria-hidden="true">
            <m.div style={{ width: bar }} className="h-full bg-rs-deep" />
          </div>
        </div>
      </div>
    </section>
  );
}
