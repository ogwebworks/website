"use client";

import { useEffect, useState } from "react";
import { project } from "./data";

/** Private preview request form (demo: nothing is sent). Pre-filled from the availability card. */
export default function Enquire() {
  const [interest, setInterest] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const on = (e: Event) => { setInterest((e as CustomEvent<string>).detail); setSent(false); };
    window.addEventListener("hb:enquire", on);
    return () => window.removeEventListener("hb:enquire", on);
  }, []);
  const input = "w-full rounded-xl border border-hb-ink/15 bg-white px-4 py-3 text-sm focus:border-hb-gold focus:outline-none";
  return (
    <section id="enquire" className="scroll-mt-20 bg-hb-sand/60 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#74592a]">Sales gallery</p>
          <h2 className="mt-2 font-hb-serif text-4xl sm:text-5xl">Book a private preview</h2>
          <p className="mt-4 max-w-md text-hb-mute">Walk the model residence, see finishes in person and review floor plans with our sales team at {project.address}.</p>
          <ul className="mt-6 space-y-2 text-sm">
            <li>Open daily 10am-6pm · evenings by appointment</li>
            <li>Video previews for international buyers</li>
            <li><a className="underline underline-offset-4" href={`tel:${project.phoneHref}`}>{project.phone}</a></li>
          </ul>
        </div>
        {sent ? (
          <div className="grid place-items-center rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_-30px_rgba(10,18,34,0.35)]" role="status">
            <div>
              <p className="font-hb-serif text-3xl">Thank you.</p>
              <p className="mt-2 text-hb-mute">A sales director would confirm your preview within one business day. (Demo: nothing is sent.)</p>
              <button type="button" onClick={() => setSent(false)} className="mt-4 text-sm underline underline-offset-4">Send another request</button>
            </div>
          </div>
        ) : (
          <form className="space-y-3 rounded-3xl bg-white p-6 shadow-[0_20px_60px_-30px_rgba(10,18,34,0.35)] sm:p-8" onSubmit={(e) => { e.preventDefault(); if (e.currentTarget.reportValidity()) setSent(true); }}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm"><span className="mb-1 block font-medium">Name</span><input required autoComplete="name" className={input} /></label>
              <label className="block text-sm"><span className="mb-1 block font-medium">Email</span><input required type="email" autoComplete="email" className={input} /></label>
            </div>
            <label className="block text-sm"><span className="mb-1 block font-medium">Interested in</span><input value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="e.g. Residence A, high floor" className={input} /></label>
            <label className="block text-sm"><span className="mb-1 block font-medium">Preferred preview</span>
              <select className={input} defaultValue="gallery"><option value="gallery">In person, sales gallery</option><option value="video">Live video preview</option></select>
            </label>
            <button type="submit" className="w-full rounded-full bg-hb-ink py-3.5 text-sm font-semibold text-white transition hover:bg-hb-navy">Request my preview</button>
          </form>
        )}
      </div>
    </section>
  );
}
