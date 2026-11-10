import Link from "next/link";
import DemoBar from "@/components/demos/DemoBar";
import TreeNav, { PhoneIcon, TreeLogo } from "@/components/demos/tree/TreeNav";
import BeforeAfter from "@/components/demos/tree/BeforeAfter";
import EstimateForm from "@/components/demos/tree/EstimateForm";
import SiteImage from "@/components/SiteImage";
import { areas, brand, faqs, reviews, services } from "@/components/demos/tree/data";

const icons: Record<string, React.ReactNode> = {
  axe: <path d="M14 3 21 10l-3 3-2-2-8 8-3-3 8-8-2-2 3-3Z" />,
  shears: <path d="M6 7a3 3 0 1 1 0 .01ZM6 17a3 3 0 1 1 0 .01M8.5 8.5 20 18M8.5 15.5 20 6" />,
  stump: <path d="M5 20h14M7 20V9c0-2 2.2-3 5-3s5 1 5 3v11M10 11c0 1 1 1.5 2 1.5s2-.5 2-1.5" />,
  storm: <path d="M7 15a4 4 0 1 1 1-7.9A5 5 0 0 1 18 9a3 3 0 0 1 0 6H7Zm6 1-2 4h3l-2 4" />,
  leaf: <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l8-8" />,
  land: <path d="M3 20h18M5 20l4-8 3 5 2-3 5 6M15 7a2 2 0 1 1 0 .01" />,
};

function Stars() {
  return (
    <span className="text-tree-orange" aria-label="5 out of 5 stars">
      ★★★★★
    </span>
  );
}

export default function TreeServicesDemo() {
  return (
    <>
      <DemoBar label="Tree services demo" />
      <div className="hidden bg-tree-forest text-sm text-tree-cream/85 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <p>Licensed &amp; insured · Certified arborists · Serving the Greater Metro Area since {brand.since}</p>
          <p className="font-semibold text-tree-orange">24/7 emergency storm service</p>
        </div>
      </div>
      <TreeNav />

      <main id="main" className="pb-20 lg:pb-0">
        {/* ---------- Hero ---------- */}
        <section id="top" className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-tree-sand px-3 py-1.5 text-sm font-semibold text-tree-moss">
              <Stars /> 4.9 rating · 600+ local jobs <span className="sr-only">(demo figures)</span>
            </p>
            <h1 className="mt-6 font-tree text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[1.02] tracking-tight text-tree-forest">
              Safe, expert tree care for your home and property.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-tree-mute">
              Removals, pruning, stump grinding and 24/7 storm response from certified arborists who treat your yard like
              their own. Free, fixed-price estimates within the week.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#estimate" className="rounded-full bg-tree-orange px-7 py-4 text-center text-lg font-semibold text-tree-ink shadow-sm transition hover:brightness-105">
                Get a free estimate
              </a>
              <a href={`tel:${brand.phoneHref}`} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-tree-forest px-7 py-4 text-lg font-semibold text-tree-forest transition hover:bg-tree-forest hover:text-tree-cream">
                <PhoneIcon className="h-5 w-5" /> {brand.phone}
              </a>
            </div>
            <ul className="mt-10 grid grid-cols-3 gap-4 border-t border-tree-ink/10 pt-6 text-sm">
              {[
                ["Fully insured", "Liability & workers' comp"],
                ["Same-week", "Free on-site quotes"],
                ["Spotless", "Full clean-up included"],
              ].map(([t, d]) => (
                <li key={t}>
                  <span className="block font-tree text-lg font-semibold text-tree-forest">{t}</span>
                  <span className="text-tree-mute">{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-tree-ink/10">
              <SiteImage name="demo-tree-hero" priority sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3]" />
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-tree-ink/5 sm:-left-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-tree-orange/20 text-xl" aria-hidden="true">⛈</span>
              <span>
                <span className="block font-semibold text-tree-forest">Storm damage?</span>
                <span className="text-sm text-tree-mute">Emergency crew on call 24/7</span>
              </span>
            </div>
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section id="services" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="font-semibold uppercase tracking-[0.16em] text-tree-moss">Our services</p>
              <h2 className="mt-3 font-tree text-4xl font-semibold tracking-tight text-tree-forest sm:text-5xl">Everything your trees need, done right.</h2>
            </div>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <li key={s.title} className="group rounded-3xl border border-tree-ink/10 bg-tree-cream p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tree-forest text-tree-cream transition group-hover:bg-tree-moss">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {icons[s.icon]}
                    </svg>
                  </span>
                  <h3 className="mt-5 font-tree text-2xl font-semibold text-tree-forest">{s.title}</h3>
                  <p className="mt-2 text-tree-mute">{s.text}</p>
                  <a href="#estimate" className="mt-5 inline-flex items-center gap-1 font-semibold text-tree-moss">
                    Get a quote <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Before / after + stats ---------- */}
        <section id="work" className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_1fr]">
          <BeforeAfter
            before={<SiteImage name="demo-tree-before" sizes="(min-width: 1024px) 55vw, 100vw" />}
            after={<SiteImage name="demo-tree-after" sizes="(min-width: 1024px) 55vw, 100vw" />}
          />
          <div>
            <p className="font-semibold uppercase tracking-[0.16em] text-tree-moss">Real results</p>
            <h2 className="mt-3 font-tree text-4xl font-semibold tracking-tight text-tree-forest sm:text-5xl">From hazard to beautiful, in a day.</h2>
            <p className="mt-5 text-lg text-tree-mute">
              Drag the slider. This storm-damaged tree was leaning over the roof. We removed it in sections with ropes and a
              crane-free rigging system, ground the stump and left the lawn spotless.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["15+", "years in business"],
                ["600+", "trees cared for"],
                ["< 1 hr", "storm response"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-2xl bg-tree-sand p-4">
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-tree text-3xl font-semibold text-tree-forest">{n}</span>
                    <span className="text-sm text-tree-mute">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-tree-mute">Demo figures for a fictional business.</p>
          </div>
        </section>

        {/* ---------- Process ---------- */}
        <section className="bg-tree-forest py-20 text-tree-cream sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="max-w-2xl font-tree text-4xl font-semibold tracking-tight sm:text-5xl">Simple from first call to final clean-up.</h2>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                ["Tell us about it", "Call, or send the form with a few photos. We reply within 2 business hours."],
                ["Free on-site estimate", "An arborist inspects the trees and gives you a written, fixed price."],
                ["We do the work", "Our insured crew completes the job safely and leaves your property spotless."],
              ].map(([t, d], i) => (
                <li key={t} className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
                  <span className="font-tree text-5xl font-semibold text-tree-orange">0{i + 1}</span>
                  <h3 className="mt-4 font-tree text-2xl font-semibold">{t}</h3>
                  <p className="mt-2 text-tree-cream/75">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Gallery ---------- */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-tree text-4xl font-semibold tracking-tight text-tree-forest sm:text-5xl">Recent jobs</h2>
            <a href="#estimate" className="font-semibold text-tree-moss underline underline-offset-4">Book yours →</a>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {(["demo-tree-gallery-1", "demo-tree-gallery-2", "demo-tree-gallery-3"] as const).map((g) => (
              <li key={g} className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-tree-ink/10">
                <SiteImage name={g} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] transition duration-700 hover:scale-105" />
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Reviews ---------- */}
        <section id="reviews" className="bg-tree-sand py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="font-semibold uppercase tracking-[0.16em] text-tree-moss">Reviews</p>
                <h2 className="mt-3 font-tree text-4xl font-semibold tracking-tight text-tree-forest sm:text-5xl">Neighbours trust us with their trees.</h2>
              </div>
              <p className="text-sm text-tree-mute">Sample reviews for a fictional business (demo content).</p>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {reviews.map((r) => (
                <li key={r.name} className="flex flex-col rounded-3xl bg-white p-7 shadow-sm">
                  <Stars />
                  <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-tree-ink/85">&ldquo;{r.text}&rdquo;</blockquote>
                  <p className="mt-6 font-semibold text-tree-forest">
                    {r.name} <span className="font-normal text-tree-mute">· {r.area}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Areas + FAQ ---------- */}
        <section className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2">
          <div id="areas">
            <p className="font-semibold uppercase tracking-[0.16em] text-tree-moss">Service areas</p>
            <h2 className="mt-3 font-tree text-4xl font-semibold tracking-tight text-tree-forest">Proudly local.</h2>
            <p className="mt-4 text-tree-mute">Serving homes and businesses across the Greater Metro Area, including:</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {areas.map((a) => (
                <li key={a} className="rounded-full border border-tree-ink/15 bg-white px-4 py-2 text-sm font-medium">📍 {a}</li>
              ))}
            </ul>
          </div>
          <div id="faq">
            <p className="font-semibold uppercase tracking-[0.16em] text-tree-moss">FAQ</p>
            <h2 className="mt-3 font-tree text-4xl font-semibold tracking-tight text-tree-forest">Good questions.</h2>
            <div className="mt-6 divide-y divide-tree-ink/10 border-y border-tree-ink/10">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-tree text-xl font-semibold text-tree-forest [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tree-sand transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-tree-mute">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Estimate ---------- */}
        <section id="estimate" className="bg-tree-forest py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div className="text-tree-cream">
              <h2 className="font-tree text-4xl font-semibold tracking-tight sm:text-5xl">Let&apos;s look after your trees.</h2>
              <p className="mt-5 max-w-md text-lg text-tree-cream/75">
                Free, no-obligation estimates. Prefer to talk? Call us any time, day or night, for emergencies.
              </p>
              <a href={`tel:${brand.phoneHref}`} className="mt-8 inline-flex items-center gap-3 font-tree text-3xl font-semibold text-tree-orange">
                <PhoneIcon className="h-7 w-7" /> {brand.phone}
              </a>
              <ul className="mt-8 space-y-2 text-tree-cream/80">
                <li>✓ Fixed prices, no surprises</li>
                <li>✓ Certified arborists on every job</li>
                <li>✓ Full clean-up included</li>
              </ul>
            </div>
            <EstimateForm />
          </div>
        </section>
      </main>

      <footer className="bg-tree-ink py-12 text-sm text-tree-cream/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
          <div>
            <TreeLogo light />
            <p className="mt-4 max-w-xs">Certified, insured tree care for the Greater Metro Area since {brand.since}.</p>
          </div>
          <div>
            <p className="font-semibold text-tree-cream">Contact</p>
            <p className="mt-2">{brand.phone}<br />{brand.email}<br />Mon–Sat 7am–6pm · Emergencies 24/7</p>
          </div>
          <div>
            <p className="font-semibold text-tree-cream">This is a demo</p>
            <p className="mt-2">
              {brand.name} is a fictional business. This site was designed and built by{" "}
              <Link href="/" target="_top" className="font-semibold text-[#12d6f8] underline underline-offset-4">OG WebWorks</Link> to show what your
              website could look like.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile sticky action bar: the #1 conversion pattern for local services */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-tree-ink/10 bg-tree-cream/95 p-3 backdrop-blur lg:hidden">
        <a href={`tel:${brand.phoneHref}`} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-tree-forest py-3 font-semibold text-tree-forest">
          <PhoneIcon /> Call now
        </a>
        <a href="#estimate" className="rounded-full bg-tree-orange py-3 text-center font-semibold text-tree-ink">
          Free estimate
        </a>
      </div>
    </>
  );
}
