import Link from "next/link";
import { Attorneys, CaseQuiz, FeeCalc, LawLogo, LawNav, PracticeTabs, Results } from "@/components/demos/law/Interactive";
import { faqs, firm, testimonials } from "@/components/demos/law/data";
import { CountUp, InView, Marquee, Particles, Words } from "@/components/demos/motion";

const eyebrow = "text-xs font-semibold uppercase tracking-[0.28em] text-lw-blue";
const h2 = "mt-4 font-lw text-4xl tracking-tight text-lw-navy sm:text-5xl";

const steps = [
  ["Free consultation", "Tell us what happened. An attorney reviews your matter and explains your options, at no cost."],
  ["Strategy & evidence", "We investigate, gather records and experts, and give you a clear plan with honest expectations."],
  ["Negotiate or litigate", "We negotiate hard for a fair outcome, and prepare every case as if it's going to trial."],
  ["Resolution", "You get the result and the closure. We stay with you until every detail is finished."],
];

export default function LawFirmDemo() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <div className="relative isolate overflow-hidden bg-lw-navy text-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:120px_100%]" aria-hidden="true" />
        <div className="dm-pulse-glow absolute -right-40 -top-40 -z-10 h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(29,109,255,0.35),transparent)]" aria-hidden="true" />
        <div className="absolute -bottom-40 left-10 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.14),transparent)]" aria-hidden="true" />
        <Particles count={12} className="-z-10 opacity-40" />
        <LawNav phone={firm.phone} phoneHref={firm.phoneHref} />
        <section id="top" className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-end gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:pb-28 lg:pt-20">
          <div className="min-w-0">
            <p className="dm-fade-up flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-lw-cyan">
              <span className="h-px w-10 bg-lw-cyan" aria-hidden="true" /> Chicago trial attorneys since 2001
            </p>
            <h1 className="mt-7 font-lw text-[clamp(2.7rem,6.4vw,5.6rem)] leading-[1.02] tracking-[-0.04em]">
              <Words text="Clarity when it" delay={100} /> <Words text="matters most." delay={380} wordClass="text-lw-cyan" />
            </h1>
            <p className="dm-fade-up mt-7 max-w-xl text-lg leading-relaxed text-white/80" style={{ "--d": "700ms" } as React.CSSProperties}>
              Personal injury, employment, family and business law. Senior attorneys on every case, plain-English advice, and a record of results that speaks for itself.
            </p>
            <div className="dm-fade-up mt-9 flex flex-wrap gap-3" style={{ "--d": "850ms" } as React.CSSProperties}>
              <a href="#consult" className="dm-shine rounded-full bg-lw-cyan px-7 py-4 font-semibold text-lw-navy shadow-[0_15px_40px_-15px_rgba(18,214,248,0.8)]">Get a free consultation</a>
              <a href="#results" className="rounded-full px-7 py-4 font-semibold ring-1 ring-white/25 transition hover:bg-white/5 hover:ring-white/60">See our results</a>
            </div>
          </div>

          <dl className="dm-fade-up grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] bg-white/10 ring-1 ring-white/10" style={{ "--d": "1000ms" } as React.CSSProperties}>
            {[
              { n: 410, p: "$", s: "M+", l: "recovered for clients" },
              { n: 98, s: "%", l: "client satisfaction" },
              { n: 2600, s: "+", l: "cases resolved" },
              { n: 24, s: " yrs", l: "in practice" },
            ].map((x) => (
              <div key={x.l} className="bg-lw-navy/80 p-6 backdrop-blur">
                <dt className="sr-only">{x.l}</dt>
                <dd>
                  <CountUp to={x.n} prefix={x.p ?? ""} suffix={x.s} className="block font-lw text-3xl tracking-tight sm:text-4xl" />
                  <span className="text-sm text-[#9fb0d1]">{x.l}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <div className="border-t border-white/10 py-5">
          <Marquee duration={44}>
            {["Super Lawyers 2026", "Best Law Firms", "Top 100 Trial Lawyers", "Million Dollar Advocates", "AV Preeminent", "Client Champion"].map((t) => (
              <span key={t} className="flex items-center gap-10 pr-10 text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                {t} <span className="text-lw-cyan" aria-hidden="true">◆</span>
              </span>
            ))}
          </Marquee>
          <p className="mt-2 text-center text-[11px] text-white/60">Recognitions shown are illustrative (demo).</p>
        </div>
      </div>

      <main id="main" className="pb-24 md:pb-0">
        {/* ---------- Practice areas ---------- */}
        <section id="practice" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
          <InView className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className={eyebrow}>Practice areas</p>
              <h2 className={h2}>Focused expertise. Full-service firm.</h2>
            </div>
            <p className="max-w-sm text-lw-mute">Six practice groups, one standard: a senior attorney who knows your case and returns your calls.</p>
          </InView>
          <PracticeTabs />
        </section>

        {/* ---------- Results ---------- */}
        <section id="results" className="scroll-mt-20 bg-lw-navy py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <InView className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lw-cyan">Case results</p>
                <h2 className="mt-4 font-lw text-4xl tracking-tight sm:text-5xl">Results, not promises.</h2>
              </div>
              <p className="max-w-sm text-white/75">A selection of recent outcomes. Every case is different and past results do not guarantee a similar outcome.</p>
            </InView>
            <Results />
          </div>
        </section>

        {/* ---------- Process ---------- */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <InView className="mb-12">
            <p className={eyebrow}>How we work</p>
            <h2 className={h2}>A clear path from first call to resolution.</h2>
          </InView>
          <ol className="grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden rounded-[2rem] bg-lw-line sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([t, d], i) => (
              <InView as="li" key={t} i={i} className="group relative bg-white p-8 transition-colors duration-500 hover:bg-lw-navy">
                <span className="font-lw text-6xl text-lw-line transition-colors duration-500 group-hover:text-white/15">0{i + 1}</span>
                <h3 className="mt-6 font-lw text-xl text-lw-navy transition-colors duration-500 group-hover:text-white">{t}</h3>
                <p className="mt-3 text-lw-mute transition-colors duration-500 group-hover:text-white/75">{d}</p>
              </InView>
            ))}
          </ol>
        </section>

        {/* ---------- Attorneys ---------- */}
        <section id="attorneys" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 sm:pb-28">
          <InView className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className={eyebrow}>Our attorneys</p>
              <h2 className={h2}>Senior counsel on every case.</h2>
            </div>
            <p className="text-xs text-lw-mute">Fictional attorneys (demo content).</p>
          </InView>
          <Attorneys />
        </section>

        {/* ---------- Fees ---------- */}
        <section id="fees" className="scroll-mt-20 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <InView className="mb-12 max-w-2xl">
              <p className={eyebrow}>Transparent fees</p>
              <h2 className={h2}>No win, no fee. Here&apos;s exactly how it works.</h2>
            </InView>
            <InView i={1}><FeeCalc /></InView>
          </div>
        </section>

        {/* ---------- Testimonials ---------- */}
        <section aria-label="Client testimonials" className="py-16">
          <Marquee duration={52}>
            {testimonials.map((t) => (
              <figure key={t.q} className="mr-5 w-[320px] shrink-0 border-l-2 border-lw-blue bg-white p-7 sm:w-[440px]">
                <blockquote className="text-lg leading-relaxed text-lw-navy">&ldquo;{t.q}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-lw-mute">{t.who} · sample testimonial</figcaption>
              </figure>
            ))}
          </Marquee>
        </section>

        {/* ---------- Consultation ---------- */}
        <section id="consult" className="relative isolate scroll-mt-20 overflow-hidden bg-lw-navy py-20 text-white sm:py-28">
          <div className="dm-pulse-glow absolute -left-40 bottom-0 -z-10 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.2),transparent)]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <InView className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lw-cyan">Free case review</p>
              <h2 className="mt-4 font-lw text-4xl tracking-tight sm:text-5xl">Do you have a case?</h2>
              <p className="mt-5 max-w-md text-lg text-white/80">Answer three quick questions, then book a free, confidential consultation by video, phone or in our office.</p>
              <a href={`tel:${firm.phoneHref}`} className="mt-8 inline-block font-lw text-3xl text-lw-cyan">{firm.phone}</a>
              <p className="mt-2 text-sm text-white/70">Available 24/7 for urgent matters</p>
            </InView>
            <InView i={1} className="min-w-0"><CaseQuiz /></InView>
          </div>
        </section>

        {/* ---------- FAQ + office ---------- */}
        <section className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2">
          <div className="min-w-0">
            <p className={eyebrow}>FAQ</p>
            <h2 className={h2}>Straight answers.</h2>
            <div className="mt-8 divide-y divide-lw-line border-y border-lw-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-lw-line transition group-open:rotate-45 group-open:bg-lw-navy group-open:text-white" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-lw-mute">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <p className={eyebrow}>Our office</p>
            <h2 className={h2}>In the heart of the Loop.</h2>
            <div className="mt-8 overflow-hidden rounded-[2rem] bg-white ring-1 ring-lw-line">
              <div className="relative aspect-[16/9] bg-lw-navy" aria-hidden="true">
                <svg viewBox="0 0 200 110" className="h-full w-full">
                  <g stroke="rgba(255,255,255,0.08)" strokeWidth="5"><path d="M0 30 H200 M0 70 H200 M50 0 V110 M110 0 V110 M165 0 V110" /></g>
                  <path d="M0 95 Q60 80 110 92 T200 84" stroke="#16307a" strokeWidth="12" fill="none" />
                </svg>
                <span className="absolute left-[55%] top-[27%] -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-lw-cyan/40" />
                  <span className="relative block h-4 w-4 rounded-full border-2 border-white bg-lw-cyan" />
                </span>
              </div>
              <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lw-mute">Address</p>
                  <p className="mt-2">{firm.address}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lw-mute">Hours</p>
                  <p className="mt-2">Mon–Fri 8am–7pm<br />Weekends by appointment</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-lw-navy py-12 text-sm text-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <LawLogo light />
            <p>
              {firm.name} {firm.suffix} is a fictional firm. Website designed &amp; built by{" "}
              <Link href="/" target="_top" className="font-semibold text-lw-cyan underline underline-offset-4">OG WebWorks</Link>.
            </p>
          </div>
          <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/60">
            Attorney advertising. This website is for general information only and is not legal advice. Contacting us does not create an attorney-client relationship. Prior results do not guarantee a similar outcome.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-lw-line bg-white/95 p-3 backdrop-blur md:hidden">
        <a href={`tel:${firm.phoneHref}`} className="rounded-full py-3 text-center font-semibold text-lw-navy ring-2 ring-lw-navy">Call 24/7</a>
        <a href="#consult" className="rounded-full bg-lw-navy py-3 text-center font-semibold text-white">Free consult</a>
      </div>
    </>
  );
}
