"use client";

import { useMemo, useState } from "react";
import { useNow } from "../motion";
import { clinic, doctors, hours, insurers, services, type ServiceId } from "./data";
import { useBookingPrefill } from "./store";

const steps = ["Visit", "Clinician", "Time", "Details"] as const;
const field = "mt-1.5 w-full rounded-xl border border-cl-navy/15 bg-white px-4 py-3 text-cl-navy placeholder:text-cl-mute/70 focus:border-cl-blue focus:outline-none";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function icsFor(start: Date, minutes: number, title: string) {
  const end = new Date(start.getTime() + minutes * 60000);
  const f = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//OG WebWorks demo//EN", "BEGIN:VEVENT", `DTSTART:${f(start)}`, `DTEND:${f(end)}`, `SUMMARY:${title}`, `LOCATION:${clinic.address}`, "DESCRIPTION:Demo appointment (fictional clinic)", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

/** Wrapper: remounts the wizard whenever another section pre-fills it. */
export default function Booking() {
  const pre = useBookingPrefill();
  return <Wizard key={pre.nonce} initialService={pre.service} initialDoctor={pre.doctor} />;
}

function Wizard({ initialService, initialDoctor }: { initialService: ServiceId | null; initialDoctor: string | null }) {
  const now = useNow(60 * 60 * 1000);
  const [step, setStep] = useState(initialDoctor ? 2 : initialService ? 1 : 0);
  const [service, setService] = useState<ServiceId | null>(initialService);
  const [doctor, setDoctor] = useState<string | "any" | null>(initialDoctor);
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");

  const svc = services.find((s) => s.id === service);
  const docs = doctors.filter((d) => !service || d.services.includes(service));
  const doc = doctors.find((d) => d.id === doctor);

  const days = useMemo(() => {
    if (!now) return [];
    const out: Date[] = [];
    const d = new Date(now);
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      const open = hours.find((h) => h.day === d.toLocaleDateString("en-US", { weekday: "long" }))?.open;
      if (open || service === "telehealth") out.push(new Date(d));
    }
    return out;
  }, [now, service]);
  const day = days[dayIdx];
  const slots = useMemo(() => {
    if (!day) return [];
    const open = hours.find((h) => h.day === day.toLocaleDateString("en-US", { weekday: "long" }))?.open ?? [9, 17];
    const len = svc?.length ?? 20;
    const out: { label: string; h: number; m: number; taken: boolean }[] = [];
    for (let t = open[0] * 60; t + len <= open[1] * 60; t += 30) {
      const h = Math.floor(t / 60), m = t % 60;
      const taken = (day.getDate() * 7 + t / 30 + (doctor?.length ?? 3)) % 4 === 0;
      out.push({ label: `${h > 12 ? h - 12 : h}:${pad(m)} ${h >= 12 ? "pm" : "am"}`, h, m, taken });
    }
    return out;
  }, [day, svc, doctor]);
  const chosen = slots.find((s) => s.label === slot);

  if (done && day && chosen) {
    const start = new Date(day);
    start.setHours(chosen.h, chosen.m, 0, 0);
    const who = doc ? doc.name : "First available clinician";
    return (
      <div className="dm-fade-up rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_80px_-40px_rgba(7,17,52,0.5)] ring-1 ring-cl-navy/5 sm:p-10" role="status">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-cl-cyan to-[#1d6dff] text-2xl text-white">✓</div>
        <p className="mt-5 font-cl text-3xl text-cl-navy">You&apos;re booked, {name.split(" ")[0] || "friend"}!</p>
        <p className="mt-2 text-cl-mute">{svc?.title} with {who}</p>
        <p className="mt-1 font-cl text-xl text-cl-blue">{start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {slot}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={icsFor(start, svc?.length ?? 20, `${svc?.title} · ${clinic.name}`)} download="appointment.ics" className="rounded-full bg-cl-navy px-6 py-3 font-semibold text-white">Add to calendar</a>
          <button type="button" onClick={() => { setDone(false); setStep(0); setSlot(null); }} className="rounded-full px-6 py-3 font-semibold text-cl-navy ring-1 ring-cl-navy/20">Book another</button>
        </div>
        <p className="mt-6 rounded-2xl bg-cl-ice px-5 py-4 text-sm text-cl-mute">
          Demo: on your real site this books into your scheduling system (EHR/practice software), sends a text reminder and pre-visit forms.
        </p>
      </div>
    );
  }

  const card = (active: boolean) => `rounded-2xl p-4 text-left ring-1 transition ${active ? "bg-cl-navy text-white ring-cl-navy" : "bg-white text-cl-navy ring-cl-navy/10 hover:ring-cl-blue/50"}`;

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(7,17,52,0.5)] ring-1 ring-cl-navy/5 sm:p-8">
      {/* progress */}
      <ol className="grid grid-cols-4 gap-2" aria-label="Booking steps">
        {steps.map((s, i) => (
          <li key={s}>
            <button type="button" disabled={i > step} onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined} className="w-full text-left disabled:cursor-default">
              <span className={`block h-1.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-gradient-to-r from-cl-cyan to-[#1d6dff]" : "bg-cl-ice"}`} />
              <span className={`mt-2 block text-xs font-semibold uppercase tracking-[0.12em] ${i === step ? "text-cl-navy" : "text-cl-mute"}`}>{i + 1}. {s}</span>
            </button>
          </li>
        ))}
      </ol>

      <div key={step} className="dm-fade-up mt-7 min-h-[300px]">
        {step === 0 && (
          <fieldset>
            <legend className="font-cl text-2xl text-cl-navy">What do you need?</legend>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button key={s.id} type="button" aria-pressed={service === s.id} onClick={() => { setService(s.id); setDoctor(null); setSlot(null); setStep(1); }} className={card(service === s.id)}>
                  <span className="block font-semibold">{s.title}</span>
                  <span className={`text-sm ${service === s.id ? "text-white/75" : "text-cl-mute"}`}>{s.length}-minute visit{s.id === "telehealth" ? " · from home" : ""}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-cl text-2xl text-cl-navy">Choose a clinician</legend>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button type="button" aria-pressed={doctor === "any"} onClick={() => { setDoctor("any"); setStep(2); }} className={card(doctor === "any")}>
                <span className="block font-semibold">First available</span>
                <span className={`text-sm ${doctor === "any" ? "text-white/75" : "text-cl-mute"}`}>Fastest appointment</span>
              </button>
              {docs.map((d) => (
                <button key={d.id} type="button" aria-pressed={doctor === d.id} onClick={() => { setDoctor(d.id); setSlot(null); setStep(2); }} className={`${card(doctor === d.id)} flex items-center gap-3`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-semibold text-cl-navy" style={{ background: `linear-gradient(135deg, ${d.hue[0]}, ${d.hue[1]})` }}>{d.initials}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{d.name}</span>
                    <span className={`text-sm ${doctor === d.id ? "text-white/75" : "text-cl-mute"}`}>{d.title}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <div>
            <p className="font-cl text-2xl text-cl-navy">Pick a time</p>
            <p className="mt-1 text-sm text-cl-mute">{svc?.title} · {doc ? doc.name : "First available"}</p>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]" role="group" aria-label="Choose a day">
              {days.length === 0 && <span className="h-[70px]" />}
              {days.map((d, i) => (
                <button key={d.toDateString()} type="button" aria-pressed={dayIdx === i} onClick={() => { setDayIdx(i); setSlot(null); }} className={`flex w-16 shrink-0 flex-col items-center rounded-2xl py-3 text-sm transition ${dayIdx === i ? "bg-cl-navy text-white" : "bg-cl-ice text-cl-navy hover:bg-[#dbe7fb]"}`}>
                  <span className="text-[11px] uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="font-cl text-xl">{d.getDate()}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label="Choose a time">
              {slots.map((s) => (
                <button key={s.label} type="button" disabled={s.taken} aria-pressed={slot === s.label} onClick={() => setSlot(s.label)} className={`rounded-xl py-2.5 text-sm transition ${slot === s.label ? "bg-gradient-to-r from-cl-cyan to-[#1d6dff] font-semibold text-cl-navy" : "bg-white text-cl-navy ring-1 ring-cl-navy/10 hover:ring-cl-blue/50"} disabled:cursor-not-allowed disabled:bg-cl-ice disabled:text-cl-mute disabled:line-through disabled:ring-0`}>
                  {s.label}
                </button>
              ))}
            </div>
            <button type="button" disabled={!slot} onClick={() => setStep(3)} className="dm-shine mt-6 w-full rounded-full bg-cl-navy py-4 font-semibold text-white transition disabled:opacity-40">
              {slot ? `Continue with ${slot}` : "Choose a time"}
            </button>
          </div>
        )}

        {step === 3 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (e.currentTarget.reportValidity()) setDone(true);
            }}
            className="space-y-4"
          >
            <p className="font-cl text-2xl text-cl-navy">Your details</p>
            <div className="inline-flex rounded-full bg-cl-ice p-1">
              {[["New patient", true], ["Returning", false]].map(([l, v]) => (
                <button key={l as string} type="button" aria-pressed={isNew === v} onClick={() => setIsNew(v as boolean)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isNew === v ? "bg-white text-cl-navy shadow" : "text-cl-mute"}`}>{l as string}</button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-cl-navy">Full name<input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
              <label className="block text-sm font-medium text-cl-navy">Mobile<input required type="tel" autoComplete="tel" className={field} /></label>
              <label className="block text-sm font-medium text-cl-navy">Email<input required type="email" autoComplete="email" className={field} /></label>
              <label className="block text-sm font-medium text-cl-navy">Insurance
                <select className={field} defaultValue="">
                  <option value="" disabled>Choose your plan</option>
                  {insurers.map((i) => <option key={i}>{i}</option>)}
                </select>
              </label>
            </div>
            <p className="rounded-xl bg-cl-ice px-4 py-3 text-sm text-cl-mute">Demo form: please don&apos;t enter real health information. Nothing is sent.</p>
            <button type="submit" className="dm-shine w-full rounded-full bg-gradient-to-r from-cl-cyan to-[#1d6dff] py-4 font-semibold text-cl-navy">Confirm appointment</button>
          </form>
        )}
      </div>
    </div>
  );
}
