import Link from "next/link";
import ReNav, { ReLogo } from "@/components/demos/realestate/ReNav";
import HeroSearch from "@/components/demos/realestate/HeroSearch";
import Listings from "@/components/demos/realestate/Listings";
import ListingModal from "@/components/demos/realestate/ListingModal";
import HouseArt from "@/components/demos/realestate/HouseArt";
import { ListingMap, Mortgage, TourForm, Valuation } from "@/components/demos/realestate/Tools";
import { agency, agents, testimonials } from "@/components/demos/realestate/data";
import { CountUp, InView, Marquee, Particles, Tilt, Words } from "@/components/demos/motion";

const eyebrow = "text-xs font-semibold uppercase tracking-[0.24em] text-re-blue";
const h2 = "mt-3 font-re text-4xl tracking-tight text-re-navy sm:text-5xl";

export default function RealEstateDemo() {
  return (
    <>
      {/* ---------- Hero (dusk & glass) ---------- */}
      <div className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#071134_0%,#0a1f5c_45%,#16307a_75%,#1d6dff_120%)] text-white">
        <div className="dm-pulse-glow absolute -right-40 top-10 -z-10 h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.28),transparent)]" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" aria-hidden="true" />
        <Particles count={16} className="-z-10 opacity-60" />
        <ReNav />
        <section id="top" className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:pb-28 lg:pt-16">
          <div className="min-w-0">
            <p className="dm-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-re-cyan" aria-hidden="true" /> Bayview&apos;s modern brokerage
            </p>
            <h1 className="mt-6 font-re text-[clamp(2.6rem,6vw,5.2rem)] leading-[1.02] tracking-[-0.035em]">
              <Words text="Find a home that" delay={100} /> <Words text="feels like you." delay={380} wordClass="text-re-cyan" />
            </h1>
            <p className="dm-fade-up mt-6 max-w-xl text-lg text-white/80" style={{ "--d": "700ms" } as React.CSSProperties}>
              Hand-picked homes, honest advice and agents who answer the phone. Search, tour and make an offer with a team that knows every street.
            </p>
            <div className="dm-fade-up mt-8" style={{ "--d": "850ms" } as React.CSSProperties}>
              <HeroSearch />
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[460px] lg:block">
            <Tilt className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <div className="aspect-[4/3] overflow-hidden">
                <div className="dm-kenburns h-full w-full"><HouseArt style="modern" seed={3} dusk /></div>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-re-cyan">Just listed</p>
                <p className="mt-1 font-re text-2xl">The Glasshouse</p>
                <p className="text-sm text-white/75">Oak Hills · 4 bd · 3.5 ba · 3,420 sqft</p>
                <p className="mt-3 font-re text-2xl">$2,450,000</p>
              </div>
            </Tilt>
            <div className="dm-float absolute -left-10 top-10 rounded-2xl border border-white/15 bg-white/90 px-4 py-3 text-re-navy shadow-xl backdrop-blur" style={{ "--rot": "-2deg" } as React.CSSProperties}>
              <p className="text-xs text-re-mute">Open house</p>
              <p className="font-semibold">Sat 11am – 2pm</p>
            </div>
            <div className="dm-float absolute -right-6 bottom-24 rounded-2xl border border-white/15 bg-re-cyan px-4 py-3 text-re-navy shadow-xl" style={{ "--rot": "2deg", "--d": "-3s" } as React.CSSProperties}>
              <p className="font-re text-2xl leading-none">9 days</p>
              <p className="text-xs">avg. to sell</p>
            </div>
          </div>
        </section>
      </div>

      <main id="main" className="pb-24 md:pb-0">
        {/* ---------- Stats ---------- */}
        <section aria-label="Track record" className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-re-navy/10 shadow-[0_30px_60px_-30px_rgba(7,17,52,0.45)] lg:grid-cols-4">
            {[
              { n: 1240, s: "+", l: "homes sold" },
              { n: 2.1, s: "B", p: "$", d: 1, l: "in sales volume" },
              { n: 9, s: "", l: "avg. days on market" },
              { n: 4.9, s: "★", d: 1, l: "client rating" },
            ].map((x) => (
              <div key={x.l} className="bg-white p-6 text-center">
                <dt className="sr-only">{x.l}</dt>
                <dd>
                  <CountUp to={x.n} prefix={x.p ?? ""} suffix={x.s} decimals={x.d ?? 0} className="block font-re text-3xl text-re-navy sm:text-4xl" />
                  <span className="text-sm text-re-mute">{x.l}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-center text-xs text-re-mute">Demo figures for a fictional brokerage.</p>
        </section>

        {/* ---------- Listings ---------- */}
        <section id="listings" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
          <InView className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className={eyebrow}>Featured homes</p>
              <h2 className={h2}>Homes worth moving for.</h2>
            </div>
            <p className="max-w-sm text-re-mute">Filter by neighbourhood, save favourites and open any home for photos, payments and tour times.</p>
          </InView>
          <Listings />
        </section>

        {/* ---------- Map ---------- */}
        <section id="map" className="mx-auto grid max-w-7xl scroll-mt-24 grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pb-20 sm:px-6 sm:pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <InView>
            <p className={eyebrow}>Explore the map</p>
            <h2 className={h2}>Every listing, every street.</h2>
            <p className="mt-4 text-re-mute">Hover a pin for a preview, click to open the home. Your real site can connect to live MLS/IDX listings.</p>
          </InView>
          <InView i={1} className="min-w-0">
            <ListingMap />
          </InView>
        </section>

        {/* ---------- Neighbourhood marquee ---------- */}
        <div className="border-y border-re-navy/10 bg-white py-6">
          <Marquee duration={40}>
            {[["Harbour District", "$1.24M"], ["Oak Hills", "$2.10M"], ["Riverside", "$910K"], ["Downtown", "$1.38M"], ["Bayview Heights", "$1.05M"], ["Linden Park", "$1.62M"]].map(([n, p]) => (
              <span key={n} className="flex items-center gap-4 pr-12 font-re text-2xl text-re-navy sm:text-3xl">
                {n} <span className="rounded-full bg-re-sand px-3 py-1 font-sans text-sm font-semibold text-re-blue">median {p}</span>
              </span>
            ))}
          </Marquee>
        </div>

        {/* ---------- Mortgage ---------- */}
        <section id="mortgage" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
          <InView className="mb-10">
            <p className={eyebrow}>Mortgage calculator</p>
            <h2 className={h2}>Know your number before you fall in love.</h2>
          </InView>
          <InView i={1}><Mortgage /></InView>
        </section>

        {/* ---------- Valuation ---------- */}
        <section id="value" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 sm:pb-28">
          <InView className="mb-10">
            <p className={eyebrow}>Selling</p>
            <h2 className={h2}>What&apos;s your home worth today?</h2>
          </InView>
          <InView i={1}><Valuation /></InView>
        </section>

        {/* ---------- Agents ---------- */}
        <section id="agents" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <InView className="mb-12 max-w-2xl">
              <p className={eyebrow}>Our agents</p>
              <h2 className={h2}>Local experts. Real humans.</h2>
            </InView>
            <ul className="grid gap-6 md:grid-cols-3">
              {agents.map((a, i) => (
                <InView as="li" key={a.name} i={i}>
                  <Tilt className="rounded-[2rem] bg-re-ice p-7 ring-1 ring-re-navy/5" max={6}>
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-re-cyan to-[#1d6dff] font-re text-xl text-re-navy">{a.initials}</span>
                    <p className="mt-5 font-re text-2xl text-re-navy">{a.name}</p>
                    <p className="text-re-mute">{a.role}</p>
                    <p className="mt-5 text-sm text-re-mute"><CountUp to={a.sold} className="font-re text-2xl text-re-blue" /> homes sold</p>
                  </Tilt>
                </InView>
              ))}
            </ul>
            <p className="mt-4 text-xs text-re-mute">Fictional agents (demo content).</p>
          </div>
        </section>

        {/* ---------- Testimonials ---------- */}
        <section aria-label="Client stories" className="py-16">
          <Marquee duration={50}>
            {testimonials.map((t) => (
              <figure key={t.who} className="mr-5 w-[320px] shrink-0 rounded-3xl bg-white p-7 shadow-[0_10px_40px_-20px_rgba(7,17,52,0.3)] ring-1 ring-re-navy/5 sm:w-[420px]">
                <p className="text-re-blue" aria-label="5 out of 5 stars">★★★★★</p>
                <blockquote className="mt-3 text-lg leading-relaxed text-re-navy">&ldquo;{t.q}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-re-mute">{t.who} · sample review</figcaption>
              </figure>
            ))}
          </Marquee>
        </section>

        {/* ---------- Tour CTA ---------- */}
        <section id="tour" className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#071134,#0a1f5c_60%,#16307a)] py-20 text-white sm:py-28">
          <div className="dm-pulse-glow absolute -left-40 bottom-0 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.22),transparent)]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <InView>
              <h2 className="font-re text-4xl tracking-tight sm:text-5xl">See it in person this week.</h2>
              <p className="mt-5 max-w-md text-lg text-white/80">Book a private or video tour and get a same-day call from an agent. No pressure, ever.</p>
              <a href={`tel:${agency.phoneHref}`} className="mt-8 inline-block font-re text-3xl text-re-cyan">{agency.phone}</a>
            </InView>
            <InView i={1} className="min-w-0"><TourForm /></InView>
          </div>
        </section>
      </main>

      <footer className="bg-re-navy py-12 text-sm text-white/70">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <span className="text-white"><ReLogo /></span>
          <p>
            {agency.name} is a fictional brokerage. Website designed &amp; built by{" "}
            <Link href="/" target="_top" className="font-semibold text-re-cyan underline underline-offset-4">OG WebWorks</Link>.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-re-navy/10 bg-white/95 p-3 backdrop-blur md:hidden">
        <a href={`tel:${agency.phoneHref}`} className="rounded-full py-3 text-center font-semibold text-re-navy ring-2 ring-re-navy">Call</a>
        <a href="#tour" className="rounded-full bg-re-cyan py-3 text-center font-semibold text-re-navy">Book a tour</a>
      </div>

      <ListingModal />
    </>
  );
}
