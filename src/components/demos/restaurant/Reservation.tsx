"use client";

import { useMemo, useState } from "react";
import { useNow } from "../motion";
import { hours } from "./data";

const slotsFor = (open?: [number, number]) => {
  if (!open) return [];
  const out: string[] = [];
  for (let h = open[0]; h < Math.min(open[1], 23) - 0.5; h += 0.5) {
    const hh = Math.floor(h);
    out.push(`${hh > 12 ? hh - 12 : hh}:${h % 1 ? "30" : "00"} ${hh >= 12 ? "pm" : "am"}`);
  }
  return out;
};

const field = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-es-cream placeholder:text-es-mute/70 focus:border-es-saffron focus:outline-none";

/** Reservation widget: party size, next 14 days, time slots (some fully booked), details, confirmation ticket. */
export default function Reservation() {
  const now = useNow(60 * 60 * 1000);
  const days = useMemo(() => {
    if (!now) return [];
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
      return { key: d.toDateString(), d, weekday, open: hours.find((h) => h.day === weekday)?.open };
    });
  }, [now]);

  const [party, setParty] = useState(2);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "details" | "done">("pick");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const day = days.find((d) => d.key === dayKey) ?? days.find((d) => d.open);
  const slots = slotsFor(day?.open);
  const booked = (s: string, i: number) => ((day?.d.getDate() ?? 0) + i * 3 + party) % 5 === 0;

  if (step === "done")
    return (
      <div className="dm-fade-up relative overflow-hidden rounded-3xl bg-es-cream p-8 text-es-char shadow-2xl sm:p-10" role="status">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-es-ember/30 blur-2xl" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a3f1f]">Reservation confirmed · {code}</p>
        <p className="mt-3 font-es text-5xl leading-none">See you soon, {name.split(" ")[0] || "friend"}.</p>
        <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-dashed border-es-char/25 py-5 text-sm">
          <div><dt className="text-es-char/60">Guests</dt><dd className="mt-1 font-es text-2xl">{party}</dd></div>
          <div><dt className="text-es-char/60">Date</dt><dd className="mt-1 font-es text-2xl">{day?.d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</dd></div>
          <div><dt className="text-es-char/60">Time</dt><dd className="mt-1 font-es text-2xl">{slot}</dd></div>
        </dl>
        <p className="mt-5 text-sm text-es-char/70">Demo: on your real site this books straight into your reservation system and sends an SMS and email reminder.</p>
        <button type="button" onClick={() => { setStep("pick"); setSlot(null); }} className="mt-6 font-semibold underline underline-offset-4">Make another booking</button>
      </div>
    );

  return (
    <div className="rounded-3xl border border-white/10 bg-es-card/80 p-6 shadow-2xl backdrop-blur sm:p-8">
      {step === "pick" ? (
        <>
          <div className="flex items-center justify-between">
            <p className="font-es text-3xl">Book a table</p>
            <div className="flex items-center gap-3 rounded-full ring-1 ring-white/15">
              <button type="button" onClick={() => setParty(Math.max(1, party - 1))} className="h-10 w-10 text-xl" aria-label="Fewer guests">−</button>
              <span className="min-w-16 text-center text-sm" aria-live="polite">{party} {party === 1 ? "guest" : "guests"}</span>
              <button type="button" onClick={() => setParty(Math.min(12, party + 1))} className="h-10 w-10 text-xl" aria-label="More guests">+</button>
            </div>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-es-mute">Date</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" role="group" aria-label="Choose a date">
            {days.length === 0 && <span className="h-[74px]" />}
            {days.map((d) => {
              const active = day?.key === d.key;
              return (
                <button
                  key={d.key}
                  type="button"
                  disabled={!d.open}
                  aria-pressed={active}
                  onClick={() => { setDayKey(d.key); setSlot(null); }}
                  className={`flex w-16 shrink-0 flex-col items-center rounded-2xl py-3 text-sm transition ${active ? "bg-es-ember text-es-char" : "ring-1 ring-white/10 hover:ring-white/40"} disabled:cursor-not-allowed disabled:opacity-35`}
                >
                  <span className="text-[11px] uppercase">{d.d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="font-es text-2xl">{d.d.getDate()}</span>
                  {!d.open && <span className="text-[10px]">Closed</span>}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-es-mute">Time</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label="Choose a time">
            {slots.map((s, i) => {
              const full = booked(s, i);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={full}
                  aria-pressed={slot === s}
                  onClick={() => setSlot(s)}
                  className={`rounded-xl py-2.5 text-sm transition ${slot === s ? "bg-es-saffron font-semibold text-es-char" : "ring-1 ring-white/10 hover:ring-es-saffron/60"} disabled:cursor-not-allowed disabled:line-through disabled:opacity-35`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <button type="button" disabled={!slot} onClick={() => setStep("details")} className="dm-shine mt-6 w-full rounded-full bg-es-ember py-4 font-semibold text-es-char transition hover:brightness-110 disabled:opacity-40">
            {slot ? `Continue: ${party} guests at ${slot}` : "Choose a time"}
          </button>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!e.currentTarget.reportValidity()) return;
            setCode(`ES-${(party * 7919 + slot!.length * 104729) % 90000 + 10000}`);
            setStep("done");
          }}
          className="dm-fade-up space-y-4"
        >
          <button type="button" onClick={() => setStep("pick")} className="text-sm text-es-mute underline underline-offset-4">← {party} guests · {day?.d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {slot}</button>
          <p className="font-es text-3xl">Your details</p>
          <label className="block text-sm">Name<input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={`${field} mt-1.5`} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">Phone<input required type="tel" autoComplete="tel" className={`${field} mt-1.5`} /></label>
            <label className="block text-sm">Email<input required type="email" autoComplete="email" className={`${field} mt-1.5`} /></label>
          </div>
          <label className="block text-sm">
            Occasion or allergies (optional)
            <textarea rows={2} placeholder="Birthday, anniversary, nut allergy…" className={`${field} mt-1.5 resize-none`} />
          </label>
          <button type="submit" className="dm-shine w-full rounded-full bg-es-ember py-4 font-semibold text-es-char transition hover:brightness-110">Confirm reservation</button>
          <p className="text-center text-xs text-es-mute">Demo booking: nothing is sent.</p>
        </form>
      )}
    </div>
  );
}

/** "Open now" status computed in the visitor's browser. */
export function OpenStatus() {
  const now = useNow();
  if (!now) return <span className="inline-block h-6" />;
  const today = hours.find((h) => h.day === now.toLocaleDateString("en-US", { weekday: "long" }));
  const h = now.getHours() + now.getMinutes() / 60;
  const isOpen = !!today?.open && h >= today.open[0] && h < today.open[1];
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="relative flex h-2.5 w-2.5">
        {isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5fd38a] opacity-75" />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOpen ? "bg-[#5fd38a]" : "bg-es-mute"}`} />
      </span>
      {isOpen ? "Open now" : today?.open && h < today.open[0] ? `Opens today at ${today.open[0] > 12 ? today.open[0] - 12 : today.open[0]}pm` : "Closed now"}
    </span>
  );
}
