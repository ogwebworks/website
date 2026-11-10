"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import Logo from "./Logo";
import { pillars, services } from "@/lib/site";

const links = [
  { href: "#demos", label: "Demos" },
  { href: "#why", label: "Why OG" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`container-x transition-all duration-500 ease-out-expo ${scrolled ? "pt-3" : "pt-5"}`}
      >
        <nav
          aria-label="Main"
          className={`relative flex items-center justify-between rounded-2xl border px-3 py-2.5 transition-all duration-500 ease-out-expo sm:px-4 ${
            scrolled
              ? "border-line bg-ink/70 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.6)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
          onMouseLeave={() => setMega(false)}
        >
          <a href="#top" className="shrink-0">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 text-sm text-paper/80 lg:flex">
            <li>
              <button
                type="button"
                className="flex items-center gap-1 rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-paper"
                aria-expanded={mega}
                aria-controls="mega-menu"
                onMouseEnter={() => setMega(true)}
                onClick={() => setMega((v) => !v)}
              >
                Services
                <svg className={`h-3.5 w-3.5 transition ${mega ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
                </svg>
              </button>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-paper" onMouseEnter={() => setMega(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="group relative hidden overflow-hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition hover:shadow-[0_0_30px_-4px_var(--color-brand)] sm:inline-flex"
            >
              <span className="relative z-10">Get a Free Proposal</span>
              <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-700 ease-out-expo group-hover:translate-x-full" aria-hidden="true" />
            </a>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              onClick={() => setMobile((v) => !v)}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 block h-0.5 w-4 bg-paper transition ${mobile ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 block h-0.5 w-4 bg-paper transition ${mobile ? "top-1.5 -rotate-45" : "top-2.5"}`} />
              </span>
            </button>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {mega && (
              <m.div
                id="mega-menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full mt-3 hidden rounded-2xl border border-line bg-ink-2/95 p-6 shadow-2xl backdrop-blur-xl lg:block"
              >
                <div className="grid grid-cols-3 gap-6">
                  {pillars.map((p) => (
                    <div key={p.id}>
                      <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: p.accent }}>
                        {p.title}: {p.word}
                      </p>
                      <ul className="space-y-1">
                        {services
                          .filter((s) => s.pillar === p.id)
                          .map((s) => (
                            <li key={s.slug}>
                              <a href="#services" onClick={() => setMega(false)} className="block rounded-xl p-3 transition hover:bg-white/5">
                                <span className="block font-medium text-paper">{s.title}</span>
                                <span className="mt-0.5 block text-sm text-mute">{s.short}</span>
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobile && (
          <m.div
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 -z-10 overflow-y-auto bg-ink-2 px-4 pb-10 pt-28 lg:hidden"
          >
            <ul className="space-y-1">
              {[{ href: "#services", label: "Services" }, ...links, { href: "#contact", label: "Contact" }].map((l, i) => (
                <m.li key={l.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <a href={l.href} onClick={() => setMobile(false)} className="block border-b border-line py-4 font-display text-3xl font-semibold">
                    {l.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <a href="#contact" onClick={() => setMobile(false)} className="mt-8 block rounded-full bg-brand px-6 py-4 text-center font-semibold text-ink">
              Get a Free Proposal
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
