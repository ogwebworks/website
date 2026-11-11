"use client";

import { useEffect, useMemo, useState } from "react";
import { useNow } from "../motion";
import { areas, attorneys, fmtMoney, results, type AreaId } from "./data";

/* ---------------- Header ---------------- */
const links = [
  { href: "#practice", label: "Practice areas" },
  { href: "#results", label: "Results" },
  { href: "#attorneys", label: "Attorneys" },
  { href: "#fees", label: "Fees" },
];

export function LawLogo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className={`grid h-9 w-9 place-items-center rounded-lg border font-lw text-sm ${light ? "border-white/30 text-white" : "border-lw-navy/20 text-lw-navy"}`}>AL</span>
      <span className="leading-none">
        <span className={`block font-lw text-lg tracking-tight ${light ? "text-white" : "text-lw-navy"}`}>Ashford Lane</span>
        <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.32em] ${light ? "text-lw-cyan" : "text-lw-blue"}`}>Attorneys at law</span>
      </span>
    </span>
  );
}

export function LawNav({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 text-white transition-all duration-500 ${solid || open ? "border-b border-white/10 bg-lw-navy/90 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#top" aria-label="Ashford Lane Law home"><LawLogo light /></a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-white/80">
            {links.map((l) => <li key={l.href}><a href={l.href} className="dm-underline pb-0.5 hover:text-white">{l.label}</a></li>)}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a href={`tel:${phoneHref}`} className="hidden text-sm font-semibold md:inline">{phone}</a>
          <a href="#consult" className="dm-shine hidden rounded-full bg-lw-cyan px-5 py-2.5 text-sm font-semibold text-lw-navy sm:inline-flex">Free consultation</a>
          <button type="button" onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 lg:hidden" aria-expanded={open} aria-controls="lw-menu" aria-label={open ? "Close menu" : "Open menu"}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="lw-menu" aria-label="Mobile" className="px-4 pb-6 lg:hidden">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="dm-fade-up border-b border-white/10" style={{ "--i": i } as React.CSSProperties}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-lw text-xl">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

/* ---------------- Practice areas (tabs) ---------------- */
export function PracticeTabs() {
  const [id, setId] = useState<AreaId>("injury");
  const a = areas.find((x) => x.id === id)!;
  const n = areas.findIndex((x) => x.id === id);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div role="tablist" aria-label="Practice areas" className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible">
        {areas.map((x, i) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={id === x.id}
            aria-controls="lw-area-panel"
            onClick={() => setId(x.id)}
            className={`group flex shrink-0 items-center gap-4 rounded-full px-4 py-2.5 text-left transition lg:rounded-none lg:border-b lg:border-lw-line lg:px-0 lg:py-5 ${id === x.id ? "bg-lw-navy text-white lg:bg-transparent lg:text-lw-navy" : "bg-white text-lw-navy ring-1 ring-lw-line lg:bg-transparent lg:ring-0"}`}
          >
            <span className={`hidden font-lw text-sm tabular-nums lg:inline ${id === x.id ? "text-lw-blue" : "text-lw-mute"}`}>0{i + 1}</span>
            <span className={`font-lw text-sm transition lg:text-2xl ${id === x.id ? "" : "lg:text-lw-mute lg:group-hover:text-lw-navy"}`}>{x.title}</span>
            <span className={`ml-auto hidden h-px bg-lw-blue transition-all duration-500 lg:block ${id === x.id ? "w-16" : "w-0"}`} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div id="lw-area-panel" role="tabpanel" aria-label={a.title} key={id} className="dm-fade-up relative min-w-0 overflow-hidden rounded-[2rem] bg-lw-navy p-8 text-white sm:p-10">
        <span className="pointer-events-none absolute -right-4 -top-10 font-lw text-[11rem] leading-none text-white/[0.04]" aria-hidden="true">0{n + 1}</span>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lw-cyan">Practice area</p>
        <h3 className="mt-3 font-lw text-3xl tracking-tight sm:text-4xl">{a.title}</h3>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">{a.long}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {a.points.map((p, i) => (
            <li key={p} className="dm-fade-up flex items-center gap-3 border-t border-white/10 pt-3" style={{ "--i": i } as React.CSSProperties}>
              <span className="h-1.5 w-1.5 rounded-full bg-lw-cyan" aria-hidden="true" /> {p}
            </li>
          ))}
        </ul>
        <a href="#consult" className="mt-10 inline-flex items-center gap-2 font-semibold text-lw-cyan">Discuss my {a.title.toLowerCase()} matter <span aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}

/* ---------------- Case results ---------------- */
export function Results() {
  const [f, setF] = useState<AreaId | "all">("all");
  const list = results.filter((r) => f === "all" || r.area === f);
  const used = areas.filter((a) => results.some((r) => r.area === a.id));
  const chip = (on: boolean) => `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${on ? "bg-lw-cyan text-lw-navy" : "text-white/80 ring-1 ring-white/20 hover:ring-white/50"}`;
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Filter results">
        <button type="button" aria-pressed={f === "all"} onClick={() => setF("all")} className={chip(f === "all")}>All results</button>
        {used.map((a) => <button key={a.id} type="button" aria-pressed={f === a.id} onClick={() => setF(a.id)} className={chip(f === a.id)}>{a.title}</button>)}
      </div>
      <ul key={f} className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden rounded-[2rem] bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r, i) => (
          <li key={r.detail} className="dm-fade-up group bg-lw-navy p-8 transition-colors duration-500 hover:bg-lw-deep" style={{ "--i": i } as React.CSSProperties}>
            <p className="font-lw text-5xl tracking-tight text-white">{r.amount ? fmtMoney(r.amount) : r.label}</p>
            {r.amount > 0 && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-lw-cyan">{r.label}</p>}
            <p className="mt-6 border-t border-white/10 pt-4 text-white/80">{r.detail}</p>
            <p className="mt-1 text-sm text-[#9fb0d1]">{areas.find((a) => a.id === r.area)!.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Attorneys ---------------- */
export function Attorneys() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {attorneys.map((a, i) => {
        const isOpen = open === a.name;
        return (
          <li key={a.name} className="dm-fade-up" style={{ "--i": i } as React.CSSProperties}>
            <div className="group h-full overflow-hidden rounded-[2rem] bg-white ring-1 ring-lw-line transition duration-500 hover:shadow-[0_30px_60px_-35px_rgba(5,12,38,0.5)]">
              <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-[linear-gradient(160deg,#0a1f5c,#050c26)]">
                <span className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" aria-hidden="true" />
                <span className="relative font-lw text-6xl text-white transition duration-700 group-hover:scale-110">{a.initials}</span>
                <span className="absolute bottom-4 left-4 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">{a.years} yrs experience</span>
              </div>
              <div className="p-6">
                <p className="font-lw text-xl text-lw-navy">{a.name}</p>
                <p className="text-sm font-semibold text-lw-blue">{a.role}</p>
                <p className="mt-3 text-sm text-lw-mute">{a.areas.map((x) => areas.find((y) => y.id === x)!.title).join(" · ")}</p>
                <button type="button" onClick={() => setOpen(isOpen ? null : a.name)} aria-expanded={isOpen} aria-controls={`bio-${i}`} className="mt-4 text-sm font-semibold text-lw-navy underline decoration-lw-blue underline-offset-4">
                  {isOpen ? "Hide profile" : "View profile"}
                </button>
                {isOpen && (
                  <div id={`bio-${i}`} className="dm-fade-up mt-4 border-t border-lw-line pt-4 text-sm text-lw-mute">
                    <p>{a.bio}</p>
                    <p className="mt-2"><strong className="text-lw-navy">Education:</strong> {a.school}</p>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- Contingency fee explainer ---------------- */
export function FeeCalc() {
  const [award, setAward] = useState(250000);
  const [stage, setStage] = useState<"settle" | "trial">("settle");
  const pct = stage === "settle" ? 0.3333 : 0.4;
  const costs = Math.round(award * 0.03);
  const fee = Math.round(award * pct);
  const you = Math.max(0, award - fee - costs);
  const parts = [
    { k: "You receive", v: you, c: "#12d6f8" },
    { k: `Attorney fee (${Math.round(pct * 1000) / 10}%)`, v: fee, c: "#1d6dff" },
    { k: "Case costs (est.)", v: costs, c: "#a1c1fa" },
  ];
  const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 rounded-[2rem] bg-white p-6 ring-1 ring-lw-line sm:p-10 lg:grid-cols-2">
      <div>
        <label className="block text-sm text-lw-mute">Example recovery <strong className="float-right font-lw text-xl text-lw-navy">{usd(award)}</strong>
          <input type="range" min={25000} max={2000000} step={5000} value={award} onChange={(e) => setAward(Number(e.target.value))} className="mt-3 w-full accent-[#1a52c4]" />
        </label>
        <fieldset className="mt-6">
          <legend className="text-sm text-lw-mute">Case resolved</legend>
          <div className="mt-2 flex gap-2">
            {([["settle", "Before trial"], ["trial", "At trial"]] as const).map(([v, l]) => (
              <button key={v} type="button" aria-pressed={stage === v} onClick={() => setStage(v)} className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${stage === v ? "bg-lw-navy text-white" : "bg-lw-paper text-lw-navy ring-1 ring-lw-line hover:ring-lw-navy/40"}`}>{l}</button>
            ))}
          </div>
        </fieldset>
        <p className="mt-6 rounded-2xl bg-lw-paper p-4 text-sm text-lw-mute"><strong className="text-lw-navy">No win, no fee.</strong> If we don&apos;t recover compensation, you owe no attorney fee. Illustrative figures only, not a quote.</p>
      </div>
      <div className="min-w-0">
        <div className="flex h-5 overflow-hidden rounded-full" aria-hidden="true">
          {parts.map((p) => <span key={p.k} className="h-full transition-all duration-700 ease-out-expo" style={{ width: `${(p.v / award) * 100}%`, background: p.c }} />)}
        </div>
        <ul className="mt-6 space-y-4" aria-live="polite">
          {parts.map((p) => (
            <li key={p.k} className="flex items-baseline justify-between gap-4 border-b border-lw-line pb-4">
              <span className="flex items-center gap-3 text-lw-mute"><span className="h-3 w-3 rounded-full" style={{ background: p.c }} />{p.k}</span>
              <span className={`font-lw tabular-nums ${p.k === "You receive" ? "text-3xl text-lw-navy" : "text-xl text-lw-navy"}`}>{usd(p.v)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- "Do I have a case?" intake + consultation ---------------- */
const questions: { q: string; opts: string[] }[] = [
  { q: "What is your matter about?", opts: areas.map((a) => a.title) },
  { q: "When did this happen?", opts: ["Within the last month", "1 to 12 months ago", "1 to 2 years ago", "More than 2 years ago"] },
  { q: "Has anyone else been involved yet?", opts: ["No, this is my first step", "An insurance company", "Another lawyer", "A court or agency"] },
];

export function CaseQuiz() {
  const now = useNow(60 * 60 * 1000);
  const [answers, setAnswers] = useState<string[]>([]);
  const [slot, setSlot] = useState<string | null>(null);
  const [mode, setMode] = useState<"Phone" | "Video" | "In office">("Video");
  const [done, setDone] = useState(false);
  const step = answers.length;
  const days = useMemo(() => {
    if (!now) return [];
    const out: Date[] = [];
    const d = new Date(now);
    while (out.length < 3) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
    }
    return out;
  }, [now]);

  if (done)
    return (
      <div className="dm-fade-up rounded-[2rem] bg-white p-8 text-center text-lw-navy sm:p-10" role="status">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lw-cyan text-2xl">✓</div>
        <p className="mt-5 font-lw text-3xl">Consultation requested</p>
        <p className="mt-2 text-lw-mute">{mode} · {slot}. An attorney will confirm within one business hour.</p>
        <p className="mt-6 rounded-2xl bg-lw-paper px-5 py-4 text-sm text-lw-mute">Demo: on your real site this goes to your intake team, CRM and calendar, with conflict-check details.</p>
        <button type="button" onClick={() => { setAnswers([]); setSlot(null); setDone(false); }} className="mt-6 font-semibold underline underline-offset-4">Start again</button>
      </div>
    );

  return (
    <div className="rounded-[2rem] bg-white p-6 text-lw-navy shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-lw-mute">
        <span>{step < questions.length ? `Question ${step + 1} of ${questions.length}` : "Book your free consultation"}</span>
        {step > 0 && <button type="button" onClick={() => setAnswers(answers.slice(0, -1))} className="normal-case tracking-normal underline underline-offset-4">← Back</button>}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-lw-paper">
        <div className="h-full rounded-full bg-gradient-to-r from-lw-cyan to-[#1d6dff] transition-all duration-700 ease-out-expo" style={{ width: `${(Math.min(step, questions.length) / questions.length) * 100}%` }} />
      </div>

      <div key={step} className="dm-fade-up mt-7">
        {step < questions.length ? (
          <fieldset>
            <legend className="font-lw text-2xl">{questions[step].q}</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {questions[step].opts.map((o) => (
                <button key={o} type="button" onClick={() => setAnswers([...answers, o])} className="rounded-xl bg-lw-paper px-4 py-3.5 text-left font-medium ring-1 ring-lw-line transition hover:bg-white hover:ring-lw-blue">
                  {o}
                </button>
              ))}
            </div>
          </fieldset>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (slot && e.currentTarget.reportValidity()) setDone(true);
            }}
          >
            <p className="rounded-2xl bg-lw-paper p-4 text-sm">
              <strong>{answers[0]}</strong> · {answers[1].toLowerCase()}.{" "}
              {answers[1] === "More than 2 years ago" ? "Time limits may apply to your claim, so it's worth speaking to us soon." : "This sounds like something we can help you with."}
            </p>
            <div className="mt-5 inline-flex rounded-full bg-lw-paper p-1">
              {(["Video", "Phone", "In office"] as const).map((m) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === m ? "bg-lw-navy text-white" : "text-lw-mute"}`}>{m}</button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Choose a time">
              {days.flatMap((d) => ["10:00 am", "2:30 pm"].map((t) => `${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}, ${t}`)).map((s) => (
                <button key={s} type="button" aria-pressed={slot === s} onClick={() => setSlot(s)} className={`rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${slot === s ? "bg-lw-navy text-white" : "bg-lw-paper ring-1 ring-lw-line hover:ring-lw-blue"}`}>{s}</button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium">Name<input required autoComplete="name" className="mt-1 w-full rounded-xl border border-lw-line bg-white px-4 py-3 focus:border-lw-blue focus:outline-none" /></label>
              <label className="block text-sm font-medium">Phone<input required type="tel" autoComplete="tel" className="mt-1 w-full rounded-xl border border-lw-line bg-white px-4 py-3 focus:border-lw-blue focus:outline-none" /></label>
            </div>
            <p className="mt-3 text-xs text-lw-mute">Demo form: nothing is sent. Don&apos;t share confidential details here. Submitting does not create an attorney-client relationship.</p>
            <button type="submit" disabled={!slot} className="dm-shine mt-5 w-full rounded-full bg-lw-navy py-4 font-semibold text-white transition disabled:opacity-40">{slot ? "Request free consultation" : "Choose a time"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
