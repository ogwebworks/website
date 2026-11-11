"use client";

import { useEffect, useState } from "react";
import { useNow } from "../motion";
import { clinic, hours } from "./data";
import { useBookingPrefill } from "./store";

const links = [
  { href: "#services", label: "Services" },
  { href: "#doctors", label: "Our clinicians" },
  { href: "#insurance", label: "Insurance" },
  { href: "#visit", label: "Visit" },
];

export function ClinicLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="10" fill="#071134" />
        <path d="M13 8h6v5h5v6h-5v5h-6v-5H8v-6h5z" fill="#12d6f8" />
      </svg>
      <span className="font-cl text-lg tracking-tight">{clinic.name}</span>
    </span>
  );
}

/** "Open now" pill computed in the visitor's browser. */
export function OpenNow({ dark = false }: { dark?: boolean }) {
  const now = useNow();
  if (!now) return <span className="inline-block h-5" />;
  const today = hours.find((h) => h.day === now.toLocaleDateString("en-US", { weekday: "long" }));
  const h = now.getHours() + now.getMinutes() / 60;
  const open = !!today?.open && h >= today.open[0] && h < today.open[1];
  return (
    <span className={`inline-flex items-center gap-2 text-sm ${dark ? "text-white/85" : "text-cl-mute"}`}>
      <span className="relative flex h-2.5 w-2.5">
        {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${open ? "bg-[#22c55e]" : "bg-cl-mute"}`} />
      </span>
      {open ? `Open now · until ${today!.open![1] > 12 ? today!.open![1] - 12 : today!.open![1]}pm` : "Closed now · video visits available"}
    </span>
  );
}

export default function ClinicNav() {
  const pre = useBookingPrefill();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${solid || open ? "border-b border-cl-navy/10 bg-white/85 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#top" aria-label={`${clinic.name} home`} className="text-cl-navy"><ClinicLogo /></a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-cl-navy/75">
            {links.map((l) => <li key={l.href}><a href={l.href} className="dm-underline pb-0.5 hover:text-cl-navy">{l.label}</a></li>)}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${clinic.phoneHref}`} className="hidden text-sm font-semibold text-cl-navy lg:inline">{clinic.phone}</a>
          <button type="button" onClick={() => pre.book(null)} className="dm-shine hidden rounded-full bg-cl-navy px-5 py-2.5 text-sm font-semibold text-white sm:inline-flex">Book online</button>
          <button type="button" onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-cl-navy/15 text-cl-navy md:hidden" aria-expanded={open} aria-controls="cl-menu" aria-label={open ? "Close menu" : "Open menu"}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="cl-menu" aria-label="Mobile" className="px-4 pb-6 md:hidden">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="dm-fade-up border-b border-cl-navy/10" style={{ "--i": i } as React.CSSProperties}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-cl text-xl text-cl-navy">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

/** Small client button that pre-fills booking (usable from server components). */
export function BookButton({ service, children, className = "" }: { service: Parameters<ReturnType<typeof useBookingPrefill>["book"]>[0]; children: React.ReactNode; className?: string }) {
  const pre = useBookingPrefill();
  return <button type="button" onClick={() => pre.book(service)} className={className}>{children}</button>;
}

/** Insurance checker: pick a plan, see coverage status. */
export function InsuranceCheck({ insurers }: { insurers: string[] }) {
  const [plan, setPlan] = useState("");
  return (
    <div className="rounded-[2rem] bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur sm:p-8">
      <label className="block text-sm font-medium text-white/85">Check your plan
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-cl-cyan focus:outline-none [&>option]:text-cl-navy">
          <option value="">Choose your insurance</option>
          {insurers.map((i) => <option key={i}>{i}</option>)}
        </select>
      </label>
      <div className="mt-5 min-h-[72px]" aria-live="polite">
        {plan && (
          <p className="dm-fade-up rounded-2xl bg-white/10 px-5 py-4 text-white">
            {plan === "Self-pay" ? (
              <>Clear self-pay pricing: visits from <strong className="text-cl-cyan">$95</strong>, video visits <strong className="text-cl-cyan">$59</strong>.</>
            ) : (
              <><span className="font-semibold text-cl-cyan">✓ In network.</span> We accept {plan}. Your usual copay applies.</>
            )}
          </p>
        )}
      </div>
      <p className="text-xs text-white/70">Fictional plans and prices (demo).</p>
    </div>
  );
}
