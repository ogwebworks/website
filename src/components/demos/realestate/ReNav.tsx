"use client";

import { useEffect, useState } from "react";
import { agency } from "./data";

const links = [
  { href: "#listings", label: "Buy" },
  { href: "#map", label: "Map" },
  { href: "#mortgage", label: "Mortgage" },
  { href: "#value", label: "Sell" },
  { href: "#agents", label: "Agents" },
];

export function ReLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#12d6f8" />
        <path d="M7 22V14l9-6 9 6v8" fill="none" stroke="#071134" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M13 22v-5h6v5" fill="none" stroke="#071134" strokeWidth="2.6" strokeLinejoin="round" />
      </svg>
      <span className="font-re text-lg tracking-tight">{agency.name}</span>
    </span>
  );
}

export default function ReNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const light = solid || open;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${light ? "border-b border-re-navy/10 bg-white/85 text-re-navy backdrop-blur-xl" : "bg-transparent text-white"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#top" aria-label={`${agency.name} home`}><ReLogo /></a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className={`flex items-center gap-8 text-sm font-medium ${light ? "text-re-navy/75" : "text-white/80"}`}>
            {links.map((l) => (
              <li key={l.href}><a href={l.href} className="dm-underline pb-0.5 transition hover:opacity-100">{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${agency.phoneHref}`} className="hidden text-sm font-semibold lg:inline">{agency.phone}</a>
          <a href="#tour" className="dm-shine hidden rounded-full bg-re-cyan px-5 py-2.5 text-sm font-semibold text-re-navy shadow-[0_8px_30px_-8px_rgba(18,214,248,0.7)] sm:inline-flex">
            Book a tour
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} className={`grid h-10 w-10 place-items-center rounded-full border md:hidden ${light ? "border-re-navy/15" : "border-white/25"}`} aria-expanded={open} aria-controls="re-menu" aria-label={open ? "Close menu" : "Open menu"}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="re-menu" aria-label="Mobile" className="px-4 pb-6 md:hidden">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="dm-fade-up border-b border-re-navy/10" style={{ "--i": i } as React.CSSProperties}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-re text-2xl">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
