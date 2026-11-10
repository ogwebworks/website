"use client";

import { useState } from "react";
import { brand } from "./data";

const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Our work" },
  { href: "#reviews", label: "Reviews" },
  { href: "#areas", label: "Service areas" },
  { href: "#faq", label: "FAQ" },
];

export function TreeLogo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill={light ? "#f7f3ea" : "#1f3d2b"} />
        <path d="M16 6c-4.5 0-7.5 3.4-7.5 7.2 0 2.3 1.1 4.1 2.8 5.2h9.4c1.7-1.1 2.8-2.9 2.8-5.2C23.5 9.4 20.5 6 16 6Z" fill="#3f6e35" />
        <path d="M14.6 18.2h2.8V26h-2.8z" fill={light ? "#1f3d2b" : "#f2913a"} />
      </svg>
      <span className={`font-tree text-xl font-semibold leading-none tracking-tight ${light ? "text-tree-cream" : "text-tree-forest"}`}>
        {brand.name}
      </span>
    </span>
  );
}

export default function TreeNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-tree-ink/10 bg-tree-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" aria-label={`${brand.name} home`}>
          <TreeLogo />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[15px] font-medium text-tree-ink/80">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition hover:text-tree-moss">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${brand.phoneHref}`} className="hidden items-center gap-2 rounded-full px-3 py-2 font-semibold text-tree-forest transition hover:bg-tree-sand md:inline-flex">
            <PhoneIcon /> {brand.phone}
          </a>
          <a href="#estimate" className="hidden rounded-full bg-tree-orange px-5 py-2.5 font-semibold text-tree-ink shadow-sm transition hover:brightness-105 sm:inline-flex">
            Free estimate
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-tree-ink/15 lg:hidden"
            aria-expanded={open}
            aria-controls="tree-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 block h-0.5 w-4 bg-tree-ink transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 block h-0.5 w-4 bg-tree-ink transition ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="tree-mobile-nav" aria-label="Mobile" className="border-t border-tree-ink/10 bg-tree-cream px-4 pb-6 lg:hidden">
          <ul className="divide-y divide-tree-ink/10">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-tree text-2xl font-semibold text-tree-forest">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#estimate" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-tree-orange py-3.5 text-center font-semibold text-tree-ink">
            Get a free estimate
          </a>
        </nav>
      )}
    </header>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />
    </svg>
  );
}
