"use client";

import { useEffect, useMemo, useState } from "react";
import { useNow } from "../motion";
import { busyByHour, days, gym, plans, timetable, types, type ClassType, type GymClass } from "./data";

/* ---------------- Header ---------------- */
const links = [
  { href: "#classes", label: "Classes" },
  { href: "#plans", label: "Memberships" },
  { href: "#coaches", label: "Coaches" },
  { href: "#visit", label: "Visit" },
];

export function GymLogo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#12d6f8" />
        <path d="M5 17h5l3-7 5 13 3-6h6" fill="none" stroke="#030713" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-gm text-lg">Pulse<span className="text-gm-cyan">.</span></span>
    </span>
  );
}

export function GymNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 text-white transition-all duration-500 ${solid || open ? "border-b border-white/10 bg-gm-black/90 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#top" aria-label={`${gym.name} home`}><GymLogo /></a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.12em] text-white/80">
            {links.map((l) => <li key={l.href}><a href={l.href} className="dm-underline pb-0.5 hover:text-white">{l.label}</a></li>)}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#trial" className="dm-shine hidden rounded-full bg-gm-cyan px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-gm-black sm:inline-flex">Free pass</a>
          <button type="button" onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 md:hidden" aria-expanded={open} aria-controls="gm-menu" aria-label={open ? "Close menu" : "Open menu"}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="gm-menu" aria-label="Mobile" className="px-4 pb-6 md:hidden">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="dm-fade-up border-b border-white/10" style={{ "--i": i } as React.CSSProperties}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-gm text-2xl">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

/* ---------------- Live busy meter ---------------- */
export function BusyMeter() {
  const now = useNow(60000);
  const hour = now?.getHours() ?? 18;
  const pct = busyByHour[hour];
  const label = pct < 35 ? "Quiet" : pct < 65 ? "Moderate" : "Busy";
  const quiet = useMemo(() => {
    for (let i = 1; i < 24; i++) {
      const h = (hour + i) % 24;
      if (busyByHour[h] < 35 && h >= 6 && h <= 22) return h;
    }
    return 14;
  }, [hour]);
  const fmt = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "am" : "pm"}`;
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-gm-panel/70 p-6 backdrop-blur" aria-live="polite">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gm-cyan opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gm-cyan" /></span>
          Live floor
        </p>
        <p className="text-sm text-gm-mute">{now ? `${fmt(hour)} now` : ""}</p>
      </div>
      <p className="mt-3 font-gm text-4xl text-white">{now ? `${pct}% · ${label}` : "…"}</p>
      <div className="mt-5 flex h-20 items-end gap-1" aria-hidden="true">
        {busyByHour.slice(5, 23).map((v, i) => {
          const h = i + 5;
          return (
            <span key={h} className="flex-1 origin-bottom rounded-t-sm [animation:gm-bar_.9s_var(--ease-out-expo)_both]" style={{ height: `${Math.max(8, v)}%`, animationDelay: `${i * 40}ms`, background: h === hour ? "#12d6f8" : "rgba(159,176,209,0.28)" }} />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-gm-mute" aria-hidden="true"><span>5am</span><span>2pm</span><span>10pm</span></div>
      <p className="mt-4 text-sm text-gm-mute">Next quiet window: <strong className="text-white">{fmt(quiet)}</strong></p>
    </div>
  );
}

/* ---------------- Timetable ---------------- */
export function Timetable() {
  const now = useNow(60 * 60 * 1000);
  const today = now ? days[(now.getDay() + 6) % 7] : "Mon";
  const [day, setDay] = useState<(typeof days)[number] | null>(null);
  const active = day ?? today;
  const [type, setType] = useState<ClassType | "All">("All");
  const [booked, setBooked] = useState<string[]>([]);
  const list = timetable.filter((c) => c.day === active && (type === "All" || c.type === type));
  const spots = (c: GymClass) => Math.max(0, c.spots - (booked.includes(c.id) ? 1 : 0));
  const chip = (on: boolean) => `shrink-0 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] transition ${on ? "bg-gm-cyan text-gm-black" : "text-white/80 ring-1 ring-white/20 hover:ring-white/50"}`;

  return (
    <div className="min-w-0">
      <div className="grid grid-cols-7 gap-1.5 rounded-2xl bg-gm-panel/60 p-1.5" role="tablist" aria-label="Day">
        {days.map((d) => (
          <button key={d} role="tab" type="button" aria-selected={active === d} onClick={() => setDay(d)} className={`rounded-xl py-3 text-xs font-extrabold uppercase tracking-wider transition sm:text-sm ${active === d ? "bg-white text-gm-black" : "text-white/75 hover:bg-white/10"}`}>
            {d}
            {d === today && <span className={`mx-auto mt-1 block h-1 w-1 rounded-full ${active === d ? "bg-gm-black" : "bg-gm-cyan"}`} aria-label="today" />}
          </button>
        ))}
      </div>
      <div className="mt-4 flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Class type">
        {(["All", ...types] as const).map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={chip(type === t)}>{t}</button>)}
      </div>

      <ul key={`${active}-${type}`} className="mt-6 divide-y divide-white/10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gm-navy/60" aria-live="polite">
        {list.length === 0 && <li className="p-8 text-center text-gm-mute">No {type.toLowerCase()} classes this day. Try another day.</li>}
        {list.map((c, i) => {
          const left = spots(c);
          const isBooked = booked.includes(c.id);
          const pct = Math.round(((c.cap - left) / c.cap) * 100);
          return (
            <li key={c.id} className="dm-fade-up grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-4 transition-colors hover:bg-white/[0.03] sm:gap-6 sm:p-5" style={{ "--i": i } as React.CSSProperties}>
              <span className="w-16 font-gm text-lg text-white sm:w-20 sm:text-xl">{c.time.replace(" ", "")}</span>
              <div className="min-w-0">
                <p className="truncate font-bold text-white">{c.name}</p>
                <p className="text-sm text-gm-mute">{c.type} · {c.mins} min · {c.coach} · {c.level}</p>
                <div className="mt-2 h-1 max-w-[220px] overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <span className="block h-full rounded-full bg-gradient-to-r from-gm-cyan to-gm-blue" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="text-right">
                <p className={`mb-1.5 text-xs font-bold uppercase tracking-wider ${left === 0 && !isBooked ? "text-[#ff9b9b]" : left <= 3 ? "text-[#ffd27a]" : "text-gm-mute"}`}>
                  {isBooked ? "You're in" : left === 0 ? "Full" : `${left} spots left`}
                </p>
                <button
                  type="button"
                  disabled={left === 0 && !isBooked}
                  onClick={() => setBooked(isBooked ? booked.filter((x) => x !== c.id) : [...booked, c.id])}
                  aria-pressed={isBooked}
                  aria-label={`${isBooked ? "Cancel" : left === 0 ? "Join waitlist for" : "Book"} ${c.name} at ${c.time}`}
                  className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition sm:px-5 ${isBooked ? "bg-white text-gm-black" : "bg-gm-cyan text-gm-black hover:brightness-110"} disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/60`}
                >
                  {isBooked ? "Booked ✓" : left === 0 ? "Full" : "Book"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-gm-mute">{booked.length > 0 ? `${booked.length} class${booked.length > 1 ? "es" : ""} booked (demo, nothing is sent).` : "Demo timetable: booking holds a spot on this page only."}</p>
    </div>
  );
}

/* ---------------- Plans ---------------- */
export function Plans() {
  const [annual, setAnnual] = useState(true);
  return (
    <div>
      <div className="mx-auto flex w-fit items-center gap-1 rounded-full bg-gm-panel p-1" role="group" aria-label="Billing period">
        {([[false, "Monthly"], [true, "Annual · save 20%"]] as const).map(([v, l]) => (
          <button key={l} type="button" aria-pressed={annual === v} onClick={() => setAnnual(v)} className={`rounded-full px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide transition ${annual === v ? "bg-gm-cyan text-gm-black" : "text-white/80"}`}>{l}</button>
        ))}
      </div>
      <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-3">
        {plans.map((p, i) => {
          const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
          return (
            <li key={p.id} className="dm-fade-up" style={{ "--i": i } as React.CSSProperties}>
              <div className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 transition duration-500 hover:-translate-y-1 ${p.featured ? "bg-gradient-to-b from-gm-cyan to-[#0fb8d6] text-gm-black" : "border border-white/10 bg-gm-panel/60 text-white"}`}>
                {p.featured && <span className="absolute right-6 top-6 rounded-full bg-gm-black px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-gm-cyan">Most popular</span>}
                <p className="font-gm text-2xl">{p.name}</p>
                <p className={`mt-1 text-sm ${p.featured ? "text-gm-black/75" : "text-gm-mute"}`}>{p.blurb}</p>
                <p className="mt-7 flex items-end gap-1">
                  <span key={price} className="dm-fade-up font-gm text-6xl">${price}</span>
                  <span className={`pb-2 text-sm font-semibold ${p.featured ? "text-gm-black/75" : "text-gm-mute"}`}>/mo</span>
                </p>
                <p className={`text-xs ${p.featured ? "text-gm-black/75" : "text-gm-mute"}`}>{annual ? `Billed $${price * 12} yearly` : "No contract · cancel anytime"}</p>
                <ul className="mt-7 flex-1 space-y-2.5 text-sm">
                  {p.features.map((f) => <li key={f} className="flex gap-2.5"><span aria-hidden="true">✓</span>{f}</li>)}
                </ul>
                <a href="#trial" className={`mt-8 block rounded-full py-3.5 text-center font-extrabold uppercase tracking-wide transition ${p.featured ? "bg-gm-black text-white hover:bg-gm-navy" : "bg-white text-gm-black hover:bg-gm-cyan"}`}>Start with {p.name}</a>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-center text-xs text-gm-mute">Demo prices for a fictional gym.</p>
    </div>
  );
}

/* ---------------- Free trial pass ---------------- */
export function TrialPass() {
  const [goal, setGoal] = useState("Get stronger");
  const [name, setName] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const field = "mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-gm-cyan focus:outline-none";
  if (code)
    return (
      <div className="dm-fade-up relative overflow-hidden rounded-[2rem] bg-gm-cyan p-8 text-gm-black" role="status">
        <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[18px] border-gm-black/10" aria-hidden="true" />
        <p className="text-xs font-extrabold uppercase tracking-[0.2em]">7-day free pass · {code}</p>
        <p className="mt-3 font-gm text-4xl">See you on the floor, {name.split(" ")[0] || "champ"}.</p>
        <div className="mt-6 flex items-center gap-5">
          <div className="grid h-28 w-28 shrink-0 grid-cols-7 gap-0.5 rounded-xl bg-white p-2" aria-label="Pass code (demo)">
            {Array.from({ length: 49 }).map((_, i) => <span key={i} className={((i * 37 + code.length * 11) % 5) < 2 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i) ? "bg-gm-black" : ""} />)}
          </div>
          <p className="text-sm">Show this at the front desk. Goal: <strong>{goal}</strong>. A coach will text you to book a free intro session.</p>
        </div>
        <p className="mt-6 text-xs">Demo: nothing is sent. On your real site this creates the lead in your gym software and sends the pass by SMS.</p>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (e.currentTarget.reportValidity()) setCode(`PULSE-${(name.length * 7919) % 9000 + 1000}`);
      }}
      className="rounded-[2rem] border border-white/10 bg-gm-panel/70 p-6 backdrop-blur sm:p-8"
    >
      <fieldset>
        <legend className="text-sm font-bold uppercase tracking-[0.14em] text-white">Your main goal</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Get stronger", "Lose fat", "Build fitness", "Feel better"].map((g) => (
            <button key={g} type="button" aria-pressed={goal === g} onClick={() => setGoal(g)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${goal === g ? "bg-gm-cyan text-gm-black" : "text-white/80 ring-1 ring-white/20 hover:ring-white/50"}`}>{g}</button>
          ))}
        </div>
      </fieldset>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/80">Name<input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
        <label className="block text-sm text-white/80">Mobile<input required type="tel" autoComplete="tel" className={field} /></label>
      </div>
      <label className="mt-4 block text-sm text-white/80">Email<input required type="email" autoComplete="email" className={field} /></label>
      <button type="submit" className="dm-shine mt-6 w-full rounded-full bg-gm-cyan py-4 font-extrabold uppercase tracking-wide text-gm-black">Claim my free week</button>
      <p className="mt-3 text-center text-xs text-gm-mute">No card needed · demo form, nothing is sent</p>
    </form>
  );
}
