"use client";

import { useEffect, useState } from "react";
import { resto } from "./data";

const links = [
  { href: "#story", label: "Our story" },
  { href: "#menu", label: "The menu" },
  { href: "#reserve", label: "Reserve" },
  { href: "#visit", label: "Find us" },
];

/** Corner logo + round menu button that opens a full-screen index; floating reserve pill. */
export default function Shell() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-[42px] z-50 flex items-start justify-between p-4 sm:p-6">
        <a href="#top" className="pointer-events-auto rounded-full bg-rs-paper/90 px-4 py-2 font-rs text-lg font-bold tracking-tight text-rs-ink shadow-[0_2px_0_#1c1a16] ring-2 ring-rs-ink backdrop-blur">
          E<span className="text-rs-deep">&amp;</span>S<span className="sr-only">, {resto.name} home</span>
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="rs-index"
          className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full bg-rs-ink font-rs-mono text-xs uppercase tracking-[0.2em] text-rs-paper transition hover:scale-105 hover:bg-rs-deep"
        >
          Menu
        </button>
      </div>

      <a href="#reserve" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-rs-ink px-5 py-3.5 font-rs-mono text-sm uppercase tracking-[0.14em] text-rs-paper shadow-[4px_4px_0_#d9432b] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#d9432b] sm:bottom-8 sm:right-8">
        <span className="h-2 w-2 animate-pulse rounded-full bg-rs-tomato" aria-hidden="true" /> Reserve a table
      </a>

      {open && (
        <div id="rs-index" role="dialog" aria-modal="true" aria-label="Site menu" className="rs-grain fixed inset-0 z-[90] flex flex-col bg-rs-deep text-rs-paper [animation:fade-in_.3s_ease]">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <p className="font-rs-mono text-xs uppercase tracking-[0.2em]">{resto.name} · Fulton Market</p>
            <button type="button" onClick={() => setOpen(false)} className="grid h-16 w-16 place-items-center rounded-full bg-rs-paper font-rs-mono text-xs uppercase tracking-[0.2em] text-rs-ink">Close</button>
          </div>
          <nav aria-label="Main" className="flex flex-1 items-center px-4 sm:px-10">
            <ol className="w-full">
              {links.map((l, i) => (
                <li key={l.href} className="dm-fade-up border-b border-rs-paper/25" style={{ "--i": i } as React.CSSProperties}>
                  <a href={l.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-6 py-4 sm:py-5">
                    <span className="font-rs-mono text-sm text-rs-paper/70">0{i + 1}</span>
                    <span className="font-rs text-[clamp(2.6rem,9vw,7rem)] font-extrabold leading-none tracking-[-0.04em] transition group-hover:translate-x-4">{l.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <p className="p-6 font-rs-mono text-xs uppercase tracking-[0.16em] text-rs-paper/80">{resto.address} · {resto.phone}</p>
        </div>
      )}
    </>
  );
}
