"use client";

import { useEffect, useState } from "react";
import { reviews } from "./data";

/** One big quote at a time; auto-advances, pauses on hover, numbered controls. */
export default function Quotes() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % reviews.length), 5500);
    return () => clearInterval(id);
  }, [paused]);
  const r = reviews[i];
  return (
    <div onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} className="mx-auto max-w-5xl text-center">
      <p className="font-rs text-[8rem] font-extrabold leading-[0.6] text-rs-tomato" aria-hidden="true">&ldquo;</p>
      <blockquote key={i} className="dm-fade-up font-rs text-[clamp(1.8rem,4vw,3.4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-rs-ink" aria-live="polite">
        {r.q}
      </blockquote>
      <p className="mt-6 font-rs-mono text-sm uppercase tracking-[0.18em] text-rs-mute">{r.who} · sample review</p>
      <div className="mt-8 flex justify-center gap-2" role="group" aria-label="Choose review">
        {reviews.map((x, k) => (
          <button key={x.who} type="button" onClick={() => setI(k)} aria-pressed={i === k} aria-label={`Review ${k + 1}`} className={`h-10 w-10 rounded-full font-rs-mono text-sm ring-2 ring-rs-ink transition ${i === k ? "bg-rs-ink text-rs-paper" : "hover:bg-rs-paper2"}`}>
            {k + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
