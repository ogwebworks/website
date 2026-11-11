import Link from "next/link";
import ClinicNav, { BookButton, ClinicLogo, InsuranceCheck, OpenNow } from "@/components/demos/clinic/ClinicNav";
import Booking from "@/components/demos/clinic/Booking";
import Doctors from "@/components/demos/clinic/Doctors";
import { clinic, faqs, hours, insurers, reviews, services } from "@/components/demos/clinic/data";
import { CountUp, InView, Marquee, Words } from "@/components/demos/motion";

const eyebrow = "text-xs font-semibold uppercase tracking-[0.24em] text-cl-blue";
const h2 = "mt-3 font-cl text-4xl tracking-tight text-cl-navy sm:text-5xl";
const fmt = (h: number) => `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;

const icons: Record<string, React.ReactNode> = {
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  child: <><circle cx="12" cy="6" r="2.5" /><path d="M8 21v-6l-2-3 3-3h6l3 3-2 3v6" /></>,
  skin: <><circle cx="12" cy="12" r="8" /><circle cx="9" cy="10" r="1" /><circle cx="14" cy="14" r="1.2" /><circle cx="15" cy="9" r=".8" /></>,
  flower: <><circle cx="12" cy="9" r="3" /><path d="M12 12v9M8 17c2 0 4 1 4 3M16 15c-2 0-4 1-4 3" /></>,
  move: <><circle cx="14" cy="4.5" r="2" /><path d="m6 20 4-6 3 2 1-5 4 3M10 14l-2-4 4-2" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>,
};

export default function ClinicDemo() {
  return (
    <>
      <div className="bg-cl-navy px-4 py-2 text-center text-sm text-white">
        <strong>In an emergency, call 911.</strong> <span className="text-white/80">For urgent but non-life-threatening care, same-day slots open at 8am.</span>
      </div>
      <div className="relative isolate overflow-hidden">
        <div className="dm-pulse-glow absolute -right-32 -top-32 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.25),transparent)]" aria-hidden="true" />
        <div className="absolute -left-40 top-60 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(29,109,255,0.14),transparent)]" aria-hidden="true" />
        <ClinicNav />

        {/* ---------- Hero ---------- */}
        <section id="top" className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:pb-28 lg:pt-16">
          <div className="min-w-0">
            <p className="dm-fade-up inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-cl-navy shadow-sm ring-1 ring-cl-navy/5">
              <span className="text-cl-blue" aria-hidden="true">★★★★★</span> 4.9 from 2,300+ patients <span className="sr-only">(demo figure)</span>
            </p>
            <h1 className="mt-6 font-cl text-[clamp(2.6rem,6vw,5rem)] leading-[1.03] tracking-[-0.035em] text-cl-navy">
              <Words text="Care that fits" delay={100} /> <Words text="your life." delay={330} wordClass="bg-gradient-to-r from-[#1a52c4] to-[#0b7fa0] bg-clip-text text-transparent" />
            </h1>
            <p className="dm-fade-up mt-6 max-w-xl text-lg text-cl-mute" style={{ "--d": "650ms" } as React.CSSProperties}>
              Family medicine, pediatrics, skin, women&apos;s health and physio under one roof, plus video visits from home. Book in under a minute.
            </p>
            <div className="dm-fade-up mt-8 flex flex-wrap gap-3" style={{ "--d": "800ms" } as React.CSSProperties}>
              <BookButton service={null} className="dm-shine rounded-full bg-cl-navy px-7 py-4 font-semibold text-white shadow-[0_15px_40px_-15px_rgba(7,17,52,0.7)]">Book an appointment</BookButton>
              <BookButton service="telehealth" className="rounded-full bg-white px-7 py-4 font-semibold text-cl-navy ring-1 ring-cl-navy/15 transition hover:ring-cl-navy/40">Start a video visit</BookButton>
            </div>
            <div className="dm-fade-up mt-8 flex flex-wrap items-center gap-x-6 gap-y-2" style={{ "--d": "950ms" } as React.CSSProperties}>
              <OpenNow />
              <span className="text-sm text-cl-mute">✓ Accepting new patients</span>
              <span className="text-sm text-cl-mute">✓ Most insurance accepted</span>
            </div>
          </div>

          {/* hero composition */}
          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_40px_90px_-40px_rgba(7,17,52,0.55)] ring-1 ring-cl-navy/5">
              <div className="flex items-center justify-between">
                <p className="font-cl text-lg">Next available</p>
                <span className="rounded-full bg-[#22c55e]/15 px-3 py-1 text-xs font-semibold text-[#166534]">Today</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["9:30 am", "11:00 am", "2:30 pm"].map((t, i) => (
                  <span key={t} className={`rounded-xl py-2.5 text-center text-sm font-semibold ${i === 2 ? "bg-gradient-to-r from-cl-cyan to-[#1d6dff] text-cl-navy" : "bg-cl-ice text-cl-navy"}`}>{t}</span>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-cl-navy p-4">
                <div className="flex items-center justify-between text-xs text-white/70"><span>Heart rate</span><span className="font-semibold text-cl-cyan">72 bpm</span></div>
                <svg viewBox="0 0 300 70" className="mt-2 h-16 w-full" aria-hidden="true">
                  <path className="cl-ecg" d="M0 40 H60 L72 40 L80 15 L90 62 L100 28 L108 40 H170 L182 40 L190 12 L200 64 L210 30 L218 40 H300" fill="none" stroke="#12d6f8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cl-cyan to-[#1d6dff] font-semibold text-cl-navy">LC</span>
                <div>
                  <p className="font-semibold">Dr. Lena Chen</p>
                  <p className="text-sm text-cl-mute">Family physician · 14 yrs</p>
                </div>
              </div>
            </div>
            <div className="dm-float absolute -left-6 -top-6 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-cl-navy/5" style={{ "--rot": "-2deg" } as React.CSSProperties}>
              <p className="text-xs text-cl-mute">Average wait</p>
              <p className="font-cl text-2xl text-cl-blue">8 min</p>
            </div>
            <div className="dm-float absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl bg-cl-navy px-4 py-3 text-white shadow-xl" style={{ "--rot": "2deg", "--d": "-3s" } as React.CSSProperties}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cl-cyan text-cl-navy" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">{icons.video}</svg>
              </span>
              <span><span className="block text-sm font-semibold">Video visit</span><span className="text-xs text-white/75">Doctor online now</span></span>
            </div>
          </div>
        </section>
      </div>

      <main id="main" className="pb-24 md:pb-0">
        {/* ---------- Stats ---------- */}
        <section aria-label="Clinic at a glance" className="mx-auto max-w-6xl px-4 sm:px-6">
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { n: 12, s: "", l: "clinicians" },
              { n: 18000, s: "+", l: "patients cared for" },
              { n: 8, s: " min", l: "average wait" },
              { n: 98, s: "%", l: "would recommend" },
            ].map((x, i) => (
              <InView key={x.l} i={i} className="rounded-3xl bg-white p-6 text-center ring-1 ring-cl-navy/5">
                <dt className="sr-only">{x.l}</dt>
                <dd>
                  <CountUp to={x.n} suffix={x.s} className="block font-cl text-3xl text-cl-navy sm:text-4xl" />
                  <span className="text-sm text-cl-mute">{x.l}</span>
                </dd>
              </InView>
            ))}
          </dl>
          <p className="mt-2 text-center text-xs text-cl-mute">Demo figures for a fictional clinic.</p>
        </section>

        {/* ---------- Services (bento) ---------- */}
        <section id="services" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
          <InView className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className={eyebrow}>Services</p>
              <h2 className={h2}>One clinic for the whole family.</h2>
            </div>
            <p className="max-w-sm text-cl-mute">Every service books online in seconds. Pick one to jump straight to available times.</p>
          </InView>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <InView as="li" key={s.id} i={i} className={i === 0 ? "lg:row-span-2" : ""}>
                <div className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7 ring-1 transition duration-500 hover:-translate-y-1 ${i === 0 ? "bg-cl-navy text-white ring-cl-navy" : "bg-white ring-cl-navy/5 hover:shadow-[0_25px_60px_-30px_rgba(7,17,52,0.45)]"}`}>
                  {i === 0 && <span className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.35),transparent)]" aria-hidden="true" />}
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl transition group-hover:scale-110 ${i === 0 ? "bg-cl-cyan text-cl-navy" : "bg-cl-ice text-cl-blue"}`}>
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[s.icon]}</svg>
                  </span>
                  <h3 className={`mt-6 font-cl tracking-tight ${i === 0 ? "text-3xl" : "text-2xl"}`}>{s.title}</h3>
                  <p className={`mt-3 ${i === 0 ? "text-lg text-white/80" : "text-cl-mute"}`}>{s.text}</p>
                  {i === 0 && (
                    <ul className="mt-6 space-y-2 text-white/85">
                      <li>✓ Same-day sick visits</li>
                      <li>✓ Annual physicals &amp; vaccines</li>
                      <li>✓ Diabetes, blood pressure, asthma</li>
                    </ul>
                  )}
                  <BookButton service={s.id} className={`relative mt-auto inline-flex w-fit items-center gap-2 pt-6 font-semibold ${i === 0 ? "text-cl-cyan" : "text-cl-blue"}`}>
                    Book {s.title.toLowerCase()} <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                  </BookButton>
                </div>
              </InView>
            ))}
          </ul>
        </section>

        {/* ---------- Booking ---------- */}
        <section id="book" className="scroll-mt-20 bg-gradient-to-b from-cl-ice to-cl-bg py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <InView className="min-w-0">
              <p className={eyebrow}>Online booking</p>
              <h2 className={h2}>Book in four taps.</h2>
              <p className="mt-5 text-lg text-cl-mute">Choose your visit, a clinician (or first available), a time that works, and you&apos;re done. Confirmation by text, reminders the day before.</p>
              <ul className="mt-8 space-y-4">
                {[["No phone queues", "Book 24/7 from any device."], ["Real availability", "Live slots straight from the schedule."], ["Add to calendar", "One tap to save your appointment."]].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cl-cyan/20 text-sm text-cl-blue" aria-hidden="true">✓</span>
                    <span><strong className="block text-cl-navy">{t}</strong><span className="text-cl-mute">{d}</span></span>
                  </li>
                ))}
              </ul>
            </InView>
            <InView i={1} className="min-w-0"><Booking /></InView>
          </div>
        </section>

        {/* ---------- Doctors ---------- */}
        <section id="doctors" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
          <InView className="mb-10">
            <p className={eyebrow}>Our clinicians</p>
            <h2 className={h2}>Doctors who know you by name.</h2>
          </InView>
          <Doctors />
        </section>

        {/* ---------- Insurance ---------- */}
        <section id="insurance" className="relative isolate overflow-hidden bg-cl-navy py-20 text-white sm:py-28">
          <div className="dm-pulse-glow absolute -right-40 -top-20 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.22),transparent)]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <InView>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cl-cyan">Insurance</p>
              <h2 className="mt-3 font-cl text-4xl tracking-tight sm:text-5xl">Covered, or clearly priced.</h2>
              <p className="mt-5 max-w-md text-lg text-white/80">We work with most major plans and publish simple self-pay prices. No surprise bills.</p>
            </InView>
            <InView i={1} className="min-w-0"><InsuranceCheck insurers={insurers} /></InView>
          </div>
          <div className="mt-16 border-y border-white/10 py-5">
            <Marquee duration={40}>
              {insurers.map((i) => (
                <span key={i} className="flex items-center gap-10 pr-10 font-cl text-xl text-white/70 sm:text-2xl">
                  {i} <span className="text-cl-cyan" aria-hidden="true">+</span>
                </span>
              ))}
            </Marquee>
          </div>
        </section>

        {/* ---------- Reviews ---------- */}
        <section aria-label="Patient reviews" className="py-16">
          <Marquee duration={50}>
            {reviews.map((r) => (
              <figure key={r.who} className="mr-5 w-[320px] shrink-0 rounded-3xl bg-white p-7 ring-1 ring-cl-navy/5 sm:w-[420px]">
                <p className="text-cl-blue" aria-label="5 out of 5 stars">★★★★★</p>
                <blockquote className="mt-3 text-lg leading-relaxed text-cl-navy">&ldquo;{r.q}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-cl-mute">{r.who} · sample review</figcaption>
              </figure>
            ))}
          </Marquee>
        </section>

        {/* ---------- FAQ + Visit ---------- */}
        <section id="visit" className="mx-auto grid max-w-7xl scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-14 px-4 pb-24 sm:px-6 lg:grid-cols-2">
          <div className="min-w-0">
            <p className={eyebrow}>FAQ</p>
            <h2 className={h2}>Good to know.</h2>
            <div className="mt-8 divide-y divide-cl-navy/10 border-y border-cl-navy/10">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-cl-navy [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cl-ice transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-cl-mute">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <p className={eyebrow}>Visit us</p>
            <h2 className={h2}>Easy to find, easy to park.</h2>
            <div className="mt-8 rounded-[2rem] bg-white p-6 ring-1 ring-cl-navy/5 sm:p-8">
              <p className="font-semibold">{clinic.address}</p>
              <a href={`tel:${clinic.phoneHref}`} className="mt-1 block font-cl text-2xl text-cl-blue">{clinic.phone}</a>
              <div className="mt-3"><OpenNow /></div>
              <table className="mt-5 w-full text-sm">
                <tbody>
                  {hours.slice(1).concat(hours[0]).map((h) => (
                    <tr key={h.day} className="border-b border-cl-navy/5">
                      <th scope="row" className="py-1.5 text-left font-normal text-cl-mute">{h.day}</th>
                      <td className="py-1.5 text-right font-medium">{h.open ? `${fmt(h.open[0])} – ${fmt(h.open[1])}` : "Closed · video visits only"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-cl-ice" aria-hidden="true">
                <svg viewBox="0 0 200 110" className="h-full w-full">
                  <g stroke="#fff" strokeWidth="7"><path d="M0 35 H200 M0 80 H200 M60 0 V110 M140 0 V110" /></g>
                  <path d="M0 105 Q70 85 120 100 T200 90" stroke="#a1c1fa" strokeWidth="10" fill="none" />
                </svg>
                <span className="absolute left-[70%] top-[32%] -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-cl-cyan/40" />
                  <span className="relative grid h-7 w-7 place-items-center rounded-lg bg-cl-navy text-xs font-bold text-cl-cyan">+</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-cl-navy py-12 text-sm text-white/70">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <span className="text-white"><ClinicLogo /></span>
          <p>
            {clinic.name} is a fictional clinic. Not medical advice. Website designed &amp; built by{" "}
            <Link href="/" target="_top" className="font-semibold text-cl-cyan underline underline-offset-4">OG WebWorks</Link>.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-cl-navy/10 bg-white/95 p-3 backdrop-blur md:hidden">
        <a href={`tel:${clinic.phoneHref}`} className="rounded-full py-3 text-center font-semibold text-cl-navy ring-2 ring-cl-navy">Call</a>
        <BookButton service={null} className="rounded-full bg-cl-navy py-3 text-center font-semibold text-white">Book online</BookButton>
      </div>
    </>
  );
}
