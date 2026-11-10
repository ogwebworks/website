"use client";

import { useEffect, useState } from "react";
import { resto } from "./data";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Our story" },
  { href: "#experiences", label: "Private dining" },
  { href: "#visit", label: "Visit" },
];

export function RestoLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-es text-2xl leading-none tracking-tight ${className}`}>
      Ember <em className="text-es-ember">&amp;</em> Salt
    </span>
  );
}

export default function RestoNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${solid || open ? "border-b border-white/10 bg-es-char/85 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#top" aria-label={`${resto.name} home`}>
          <RestoLogo />
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm text-es-cream/80">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="dm-underline pb-0.5 transition hover:text-es-cream">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#book" className="dm-shine hidden rounded-full bg-es-ember px-5 py-2.5 sm:inline-flex text-sm font-semibold text-es-char shadow-[0_0_30px_-6px_#ff6a2b] transition hover:brightness-110">
            Book a table
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 md:hidden" aria-expanded={open} aria-controls="es-menu" aria-label={open ? "Close menu" : "Open menu"}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="es-menu" aria-label="Mobile" className="px-4 pb-6 md:hidden">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="dm-fade-up border-b border-white/10" style={{ "--i": i } as React.CSSProperties}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-es text-3xl">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
