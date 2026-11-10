import Link from "next/link";
import RestoNav, { RestoLogo } from "@/components/demos/restaurant/RestoNav";
import MenuTabs from "@/components/demos/restaurant/MenuTabs";
import Reservation, { OpenStatus } from "@/components/demos/restaurant/Reservation";
import PlateArt from "@/components/demos/restaurant/PlateArt";
import { CountUp, InView, Marquee, Parallax, Particles, Tilt, Words } from "@/components/demos/motion";
import { hours, resto, reviews, signatures } from "@/components/demos/restaurant/data";
import SiteImage from "@/components/SiteImage";
import { getImage } from "@/lib/images";

const fmt = (h: number) => (h === 24 ? "midnight" : `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`);

export default function RestaurantDemo() {
  const chef = getImage("demo-resto-chef");

  return (
    <>
      <RestoNav />
      <main id="main" className="pb-20 md:pb-0">
        {/* ---------- Hero ---------- */}
        <section id="top" className="relative isolate -mt-[73px] flex min-h-[100svh] items-center overflow-hidden pt-[73px]">
          <div className="absolute left-1/2 top-[60%] -z-10 h-[70vmax] w-[70vmax] -translate-x-1/2" aria-hidden="true">
            <div className="dm-pulse-glow h-full w-full rounded-full bg-[radial-gradient(closest-side,rgba(255,106,43,0.38),rgba(246,183,60,0.12)_45%,transparent_70%)]" />
          </div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(110,31,43,0.35),transparent_55%)]" aria-hidden="true" />
          <Particles count={28} className="-z-10" />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="dm-fade-up inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-es-saffron">
                <span className="h-px w-10 bg-es-saffron" aria-hidden="true" /> Wood-fired kitchen · Est. {resto.since}
              </p>
              <h1 className="mt-6 font-es text-[clamp(3.4rem,9vw,8.5rem)] leading-[0.9] tracking-tight">
                <Words text="Fire, flavour" delay={150} />
                <br />
                <Words text="& a table" delay={350} wordClasses={["italic text-es-ember"]} />
                <br />
                <Words text="for you." delay={520} wordClass="italic text-es-saffron" />
              </h1>
              <p className="dm-fade-up mt-8 max-w-md text-lg text-es-cream/75" style={{ "--d": "800ms" } as React.CSSProperties}>
                Seasonal plates cooked over open flame, natural wine and a room that glows. In the heart of Fulton Market.
              </p>
              <div className="dm-fade-up mt-10 flex flex-wrap gap-3" style={{ "--d": "950ms" } as React.CSSProperties}>
                <a href="#book" className="dm-shine rounded-full bg-es-ember px-8 py-4 font-semibold text-es-char shadow-[0_10px_40px_-10px_#ff6a2b] transition hover:brightness-110">Reserve a table</a>
                <a href="#menu" className="rounded-full px-8 py-4 font-semibold ring-1 ring-white/25 transition hover:bg-white/5 hover:ring-white/60">See the menu</a>
              </div>
              <div className="dm-fade-up mt-10" style={{ "--d": "1100ms" } as React.CSSProperties}>
                <OpenStatus />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="dm-spin" style={{ "--dur": "80s" } as React.CSSProperties}>
                <PlateArt tint={["#6b2b1f", "#a1442c", "#4f7a3a"]} seed={11} steam />
              </div>
              {/* rotating text badge */}
              <div className="absolute -left-2 top-4 h-28 w-28 sm:h-32 sm:w-32" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="dm-spin h-full w-full" style={{ "--dur": "18s" } as React.CSSProperties}>
                  <defs><path id="es-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
                  <text fontSize="9.5" fill="#f6b73c"><textPath href="#es-circle" textLength="236" lengthAdjust="spacing">SEASONAL · LOCAL · OPEN FIRE ·</textPath></text>
                </svg>
                <span className="absolute inset-0 grid place-items-center text-3xl">🔥</span>
              </div>
              <div className="dm-float absolute -right-2 bottom-8 rounded-2xl border border-white/10 bg-es-card/90 px-4 py-3 shadow-xl backdrop-blur" style={{ "--dur": "6s", "--rot": "-2deg" } as React.CSSProperties}>
                <p className="text-xs uppercase tracking-[0.16em] text-es-mute">Tonight&apos;s signature</p>
                <p className="font-es text-xl">45-day dry-aged ribeye</p>
              </div>
            </div>
          </div>
          <a href="#menu" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-es-mute md:flex" aria-label="Scroll to menu">
            Scroll
            <span className="relative h-10 w-px overflow-hidden bg-white/15"><span className="scroll-cue absolute left-0 top-0 h-4 w-px bg-es-ember" /></span>
          </a>
        </section>

        {/* ---------- Marquee ---------- */}
        <div className="border-y border-white/10 bg-es-ember py-5 text-es-char">
          <Marquee duration={32}>
            {["Open-fire kitchen", "Dry-aged in house", "Natural wine", "Seasonal produce", "Sourdough every morning", "Chef's table"].map((t) => (
              <span key={t} className="flex items-center gap-8 pr-8 font-es text-3xl italic sm:text-4xl">
                {t} <span aria-hidden="true" className="not-italic">✦</span>
              </span>
            ))}
          </Marquee>
        </div>

        {/* ---------- Signatures ---------- */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <InView className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-es-saffron">Signatures</p>
              <h2 className="mt-4 font-es text-5xl leading-none sm:text-7xl">Plates people <em className="text-es-ember">cross town</em> for.</h2>
            </div>
            <p className="max-w-sm text-es-mute">Cooked over Michigan oak and cherry wood at 450°C. Simple ingredients, a lot of fire.</p>
          </InView>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {signatures.map((d, i) => (
              <li key={d.id}>
                <InView i={i}>
                  <Tilt className="group rounded-[2rem] border border-white/10 bg-gradient-to-b from-es-card to-es-char p-6 transition-shadow duration-500 hover:shadow-[0_30px_80px_-30px_rgba(255,106,43,0.5)]">
                    <div className="transition-transform duration-700 ease-out-expo group-hover:rotate-12 group-hover:scale-105">
                      <PlateArt tint={d.tint} seed={i + 3} />
                    </div>
                    <div className="mt-5 flex items-baseline justify-between gap-3">
                      <h3 className="font-es text-2xl leading-tight">{d.name}</h3>
                      <span className="font-es text-2xl text-es-saffron">${d.price}</span>
                    </div>
                    <p className="mt-2 text-sm text-es-mute">{d.desc}</p>
                  </Tilt>
                </InView>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Menu ---------- */}
        <section id="menu" className="relative border-t border-white/10 bg-gradient-to-b from-es-card/60 to-es-char py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <InView>
              <p className="text-xs uppercase tracking-[0.28em] text-es-saffron">The menu</p>
              <h2 className="mt-4 font-es text-5xl leading-none sm:text-7xl">Tonight, from the fire.</h2>
            </InView>
            <div className="mt-12">
              <MenuTabs />
            </div>
          </div>
        </section>

        {/* ---------- Story ---------- */}
        <section id="story" className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2">
          <Parallax amount={50} className="aspect-[4/5] rounded-[2rem]">
            {chef ? (
              <SiteImage name="demo-resto-chef" sizes="(min-width: 1024px) 45vw, 100vw" className="h-full" />
            ) : (
              <div className="relative grid h-full place-items-center bg-[radial-gradient(circle_at_50%_70%,#ff6a2b_0%,#6e1f2b_35%,#110c0a_70%)]">
                <Particles count={18} />
                <p className="font-es text-[9rem] italic leading-none text-es-cream/90 drop-shadow-[0_0_40px_rgba(255,106,43,0.8)]">450°</p>
              </div>
            )}
          </Parallax>
          <div>
            <InView>
              <p className="text-xs uppercase tracking-[0.28em] text-es-saffron">Our story</p>
              <h2 className="mt-4 font-es text-5xl leading-none sm:text-6xl">One fire. No shortcuts.</h2>
              <p className="mt-6 text-lg leading-relaxed text-es-cream/75">
                Chef Rosa Delgado opened Ember &amp; Salt with a single wood-fired hearth and a promise: cook what&apos;s in season, from farmers she knows, over real flame. Ten years on, the fire has never gone out.
              </p>
            </InView>
            <dl className="mt-10 grid grid-cols-3 gap-4">
              {[
                { n: 10, s: "+", l: "years of fire" },
                { n: 180, s: "", l: "natural wines" },
                { n: 32, s: "", l: "local farms" },
              ].map((x, i) => (
                <InView key={x.l} i={i} className="rounded-2xl border border-white/10 bg-es-card p-5">
                  <dt className="sr-only">{x.l}</dt>
                  <dd>
                    <CountUp to={x.n} suffix={x.s} className="block font-es text-5xl text-es-saffron" />
                    <span className="text-sm text-es-mute">{x.l}</span>
                  </dd>
                </InView>
              ))}
            </dl>
            <p className="mt-3 text-xs text-es-mute">Fictional restaurant and chef (demo content).</p>
          </div>
        </section>

        {/* ---------- Experiences ---------- */}
        <section id="experiences" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
          <InView>
            <h2 className="font-es text-5xl leading-none sm:text-7xl">More than dinner.</h2>
          </InView>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { t: "Chef's table", d: "Eight seats at the pass. A 9-course tasting cooked in front of you.", p: "$145 pp", e: "🔥" },
              { t: "Private dining", d: "The Cellar Room seats up to 24 for birthdays, launches and long lunches.", p: "From $1,800", e: "🍷" },
              { t: "Sunday fire feast", d: "Family-style whole animals, sides and dessert passed around the table.", p: "$65 pp", e: "🌿" },
            ].map((x, i) => (
              <li key={x.t}>
                <InView i={i}>
                  <a href="#book" className="dm-shine group relative block h-full overflow-hidden rounded-[2rem] border border-white/10 bg-es-card p-8 transition duration-500 hover:-translate-y-1 hover:border-es-ember/50">
                    <span className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-es-ember/0 blur-3xl transition duration-700 group-hover:bg-es-ember/30" aria-hidden="true" />
                    <span className="text-4xl" aria-hidden="true">{x.e}</span>
                    <h3 className="mt-6 font-es text-3xl">{x.t}</h3>
                    <p className="mt-3 text-es-mute">{x.d}</p>
                    <p className="mt-6 flex items-center justify-between font-semibold text-es-saffron">
                      {x.p} <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span>
                    </p>
                  </a>
                </InView>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Reviews ---------- */}
        <section aria-label="Guest reviews" className="border-y border-white/10 py-16">
          <Marquee duration={55}>
            {reviews.map((r) => (
              <figure key={r.who} className="mr-5 w-[340px] shrink-0 rounded-3xl border border-white/10 bg-es-card p-7 sm:w-[420px]">
                <p className="text-es-saffron" aria-label="5 out of 5 stars">★★★★★</p>
                <blockquote className="mt-3 font-es text-2xl leading-snug">&ldquo;{r.q}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-es-mute">{r.who} · sample review</figcaption>
              </figure>
            ))}
          </Marquee>
        </section>

        {/* ---------- Book + Visit ---------- */}
        <section id="book" className="relative overflow-hidden py-24 sm:py-32">
          <div className="dm-pulse-glow absolute -left-40 top-20 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(255,106,43,0.25),transparent)]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
            <div id="visit">
              <InView>
                <p className="text-xs uppercase tracking-[0.28em] text-es-saffron">Visit us</p>
                <h2 className="mt-4 font-es text-5xl leading-none sm:text-7xl">Pull up a chair.</h2>
                <p className="mt-6 text-lg text-es-cream/75">Walk-ins welcome at the bar. Tables fill fast on weekends, so book ahead.</p>
              </InView>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-es-mute">Hours</p>
                  <table className="mt-3 w-full text-sm">
                    <tbody>
                      {hours.map((h) => (
                        <tr key={h.day} className="border-b border-white/5">
                          <th scope="row" className="py-1.5 text-left font-normal text-es-cream/80">{h.day}</th>
                          <td className="py-1.5 text-right">{h.open ? `${fmt(h.open[0])} – ${fmt(h.open[1])}` : "Closed"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4"><OpenStatus /></div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-es-mute">Find us</p>
                  <p className="mt-3">{resto.address}</p>
                  <a href={`tel:${resto.phoneHref}`} className="mt-2 block font-es text-2xl text-es-saffron">{resto.phone}</a>
                  {/* stylised map */}
                  <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-es-card" aria-hidden="true">
                    <svg viewBox="0 0 200 150" className="h-full w-full">
                      <g stroke="rgba(244,234,217,0.12)" strokeWidth="6">
                        <path d="M0 40 H200 M0 100 H200 M50 0 V150 M130 0 V150" />
                      </g>
                      <g stroke="rgba(244,234,217,0.06)" strokeWidth="2">
                        <path d="M0 20 H200 M0 70 H200 M0 125 H200 M20 0 V150 M90 0 V150 M170 0 V150" />
                      </g>
                      <path d="M0 140 Q60 110 120 135 T200 120" stroke="rgba(120,170,220,0.25)" strokeWidth="10" fill="none" />
                    </svg>
                    <span className="absolute left-[64%] top-[66%] -translate-x-1/2 -translate-y-1/2">
                      <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-es-ember/40" />
                      <span className="relative block h-4 w-4 rounded-full border-2 border-es-cream bg-es-ember" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <InView>
              <Reservation />
            </InView>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 text-sm text-es-mute">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <RestoLogo className="text-es-cream" />
          <p>
            {resto.name} is a fictional restaurant. Website designed &amp; built by{" "}
            <Link href="/" target="_top" className="font-semibold text-[#12d6f8] underline underline-offset-4">OG WebWorks</Link>.
          </p>
        </div>
      </footer>

      {/* Mobile sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-es-char/90 p-3 backdrop-blur md:hidden">
        <a href={`tel:${resto.phoneHref}`} className="rounded-full py-3 text-center font-semibold ring-1 ring-white/25">Call</a>
        <a href="#book" className="rounded-full bg-es-ember py-3 text-center font-semibold text-es-char">Book a table</a>
      </div>
    </>
  );
}
