"use client";

import { useState, type ReactNode } from "react";

/** Accessible before/after comparison: drag, click or use arrow keys (native range input). */
export default function BeforeAfter({ before, after }: { before: ReactNode; after: ReactNode }) {
  const [pos, setPos] = useState(52);
  return (
    <div className="relative aspect-[16/10] select-none overflow-hidden rounded-3xl shadow-xl ring-1 ring-tree-ink/10">
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-tree-ink/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-tree-cream">Before</span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-tree-orange px-3 py-1 text-xs font-bold uppercase tracking-wider text-tree-ink">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,.4)]" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-tree-forest shadow-lg">⇆</span>
      </div>
      <label className="sr-only" htmlFor="ba-range">Compare before and after</label>
      <input
        id="ba-range"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
