import Link from "next/link";
import { BusyMeter, GymLogo, GymNav, Plans, Timetable, TrialPass } from "@/components/demos/gym/Interactive";
import { coaches, gym, reviews } from "@/components/demos/gym/data";
import { CountUp, InView, Marquee, Particles, Tilt, Words } from "@/components/demos/motion";

const eyebrow = "text-xs font-extrabold uppercase tracking-[0.28em] text-gm-cyan";
const h2 = "mt-4 font-gm text-4xl sm:text-6xl";

const zones = [
  { t: "Strength floor", d: "12 racks, 3 platforms, dumbbells to 150 lbs.", n: "01" },
  { t: "Cycle studio", d: "28 smart bikes, immersive light and sound.", n: "02" },
  { t: "Boxing ring", d: "Full-size ring, heavy bags, pad work.", n: "03" },
  { t: "Recovery zone", d: "Sauna, cold plunge, compression, stretch.", n: "04" },
];

export default function GymDemo() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <div className="relative isolate overflow-hidden [clip-path:polygon(0_0,100%_0,100%_calc(100%-56px),0_100%)]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(70%_60%_at_80%_20%,rgba(29,109,255,0.35),transparent_70%),radial-gradient(50%_50%_at_10%_90%,rgba(18,214,248,0.18),transparent_70%)]" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 opacity-[0.07] [background:repeating-linear-gradient(115deg,#fff_0_2px,transparent_2px_26px)]" aria-hidden="true" />
        <Particles count={14} className="-z-10 opacity-50" />
        <GymNav />
        <section id="top" className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 pb-28 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:pb-36 lg:pt-16">
          <div className="min-w-0">
            <p className="dm-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-white">
              <span className="h-2 w-2 rounded-full bg-gm-cyan" aria-hidden="true" /> Open 24/7 · Austin
            </p>
            <h1 className="mt-6 font-gm text-[clamp(3rem,8vw,7rem)] leading-[0.92]">
              <Words text="Train hard." delay={80} />
              <br />
              <Words text="Recover smart." delay={300} wordClass="text-gm-cyan" />
              <br />
              <Words text="Repeat." delay={520} wordClass="text-transparent [-webkit-text-stroke:2px_#fff]" />
            </h1>
            <p className="dm-fade-up mt-7 max-w-lg text-lg text-gm-mute" style={{ "--d": "800ms" } as React.CSSProperties}>
              Coach-led classes, a serious strength floor and a recovery zone that actually helps you recover. Your first week is on us.
            </p>
            <div className="dm-fade-up mt-9 flex flex-wrap gap-3" style={{ "--d": "950ms" } as React.CSSProperties}>
              <a href="#trial" className="dm-shine rounded-full bg-gm-cyan px-8 py-4 font-extrabold uppercase tracking-wide text-gm-black shadow-[0_15px_45px_-12px_rgba(18,214,248,0.8)]">Get a free week</a>
              <a href="#classes" className="rounded-full px-8 py-4 font-extrabold uppercase tracking-wide ring-2 ring-white/25 transition hover:bg-white/5 hover:ring-white/60">View classes</a>
            </div>
          </div>
          <div className="dm-fade-up min-w-0" style={{ "--d": "600ms" } as React.CSSProperties}>
            <BusyMeter />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[{ n: 4200, s: "+", l: "members" }, { n: 85, s: "", l: "classes / week" }, { n: 24, s: "/7", l: "access" }].map((x) => (
                <div key={x.l} className="rounded-2xl border border-white/10 bg-gm-panel/60 p-4 text-center">
                  <CountUp to={x.n} suffix={x.s} className="block font-gm text-2xl" />
                  <span className="text-xs text-gm-mute">{x.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ---------- Kinetic band ---------- */}
      <div className="-mt-10 -rotate-2 bg-gm-cyan py-4 text-gm-black">
        <Marquee duration={26}>
          {["Strength", "HIIT", "Cycle", "Yoga", "Boxing", "Recovery", "Personal training"].map((t) => (
            <span key={t} className="flex items-center gap-8 pr-8 font-gm text-3xl sm:text-5xl">
              {t} <span aria-hidden="true">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <main id="main" className="pb-24 md:pb-0">
        {/* ---------- Classes ---------- */}
        <section id="classes" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
          <InView className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className={eyebrow}>Class timetable</p>
              <h2 className={h2}>Book your spot.</h2>
            </div>
            <p className="max-w-sm text-gm-mute">85 coach-led classes a week. Pick a day, filter by type and grab a spot before it fills.</p>
          </InView>
          <Timetable />
        </section>

        {/* ---------- Zones ---------- */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
          <InView className="mb-10">
            <p className={eyebrow}>The club</p>
            <h2 className={h2}>Built for every kind of training.</h2>
          </InView>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {zones.map((z, i) => (
              <InView as="li" key={z.t} i={i}>
                <Tilt className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-gm-panel to-gm-navy p-7" max={7}>
                  <span className="absolute -right-3 -top-6 font-gm text-[7rem] leading-none text-white/[0.05] transition duration-700 group-hover:text-gm-cyan/15" aria-hidden="true">{z.n}</span>
                  <span className="block h-1 w-10 rounded-full bg-gm-cyan transition-all duration-500 group-hover:w-20" aria-hidden="true" />
                  <h3 className="mt-8 font-gm text-2xl">{z.t}</h3>
                  <p className="mt-3 text-gm-mute">{z.d}</p>
                </Tilt>
              </InView>
            ))}
          </ul>
        </section>

        {/* ---------- Plans ---------- */}
        <section id="plans" className="scroll-mt-20 bg-gm-navy/60 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <InView className="mb-10 text-center">
              <p className={eyebrow}>Memberships</p>
              <h2 className={h2}>Pick your pace.</h2>
            </InView>
            <Plans />
          </div>
        </section>

        {/* ---------- Coaches ---------- */}
        <section id="coaches" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32">
          <InView className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className={eyebrow}>Coaches</p>
              <h2 className={h2}>In your corner.</h2>
            </div>
            <p className="text-xs text-gm-mute">Fictional coaches (demo content).</p>
          </InView>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coaches.map((c, i) => (
              <InView as="li" key={c.name} i={i}>
                <div className="group overflow-hidden rounded-[2rem] border border-white/10 bg-gm-panel/50">
                  <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-[linear-gradient(160deg,#0c1a4a,#030713)]">
                    <span className="absolute inset-0 opacity-[0.08] [background:repeating-linear-gradient(115deg,#fff_0_2px,transparent_2px_18px)]" aria-hidden="true" />
                    <span className="relative font-gm text-7xl transition duration-700 group-hover:scale-110 group-hover:text-gm-cyan">{c.initials}</span>
                    <span className="absolute bottom-4 left-4 rounded-full bg-gm-cyan px-3 py-1 text-xs font-extrabold uppercase text-gm-black">{c.years} yrs</span>
                  </div>
                  <div className="p-6">
                    <p className="font-gm text-xl">{c.name}</p>
                    <p className="text-sm font-bold text-gm-cyan">{c.role}</p>
                    <p className="mt-1 text-sm text-gm-mute">{c.spec}</p>
                  </div>
                </div>
              </InView>
            ))}
          </ul>
        </section>

        {/* ---------- Reviews ---------- */}
        <section aria-label="Member reviews" className="border-y border-white/10 py-14">
          <Marquee duration={50} reverse>
            {reviews.map((r) => (
              <figure key={r.who} className="mr-5 w-[320px] shrink-0 rounded-3xl border border-white/10 bg-gm-panel/50 p-7 sm:w-[420px]">
                <p className="text-gm-cyan" aria-label="5 out of 5 stars">★★★★★</p>
                <blockquote className="mt-3 text-lg leading-relaxed">&ldquo;{r.q}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-gm-mute">{r.who} · sample review</figcaption>
              </figure>
            ))}
          </Marquee>
        </section>

        {/* ---------- Trial ---------- */}
        <section id="trial" className="relative isolate scroll-mt-20 overflow-hidden py-24 sm:py-32">
          <div className="dm-pulse-glow absolute -right-40 top-0 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(18,214,248,0.22),transparent)]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <InView className="min-w-0">
              <p className={eyebrow}>Free 7-day pass</p>
              <h2 className="mt-4 font-gm text-5xl sm:text-7xl">Your first week is on us.</h2>
              <p className="mt-6 max-w-md text-lg text-gm-mute">Unlimited classes, full gym access and a free intro session with a coach. No card, no catch.</p>
            </InView>
            <InView i={1} className="min-w-0"><TrialPass /></InView>
          </div>
        </section>

        {/* ---------- Visit ---------- */}
        <section id="visit" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-24 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden rounded-[2rem] bg-white/10 md:grid-cols-3">
            {[
              ["Address", gym.address],
              ["Hours", "Members 24/7 · Staffed 6am–10pm"],
              ["Parking", "Free garage parking · EV chargers"],
            ].map(([k, v]) => (
              <div key={k} className="bg-gm-black p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gm-cyan">{k}</p>
                <p className="mt-3 text-lg">{v}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 text-sm text-gm-mute">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <GymLogo />
          <p>
            {gym.name} is a fictional gym. Website designed &amp; built by{" "}
            <Link href="/" target="_top" className="font-semibold text-gm-cyan underline underline-offset-4">OG WebWorks</Link>.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-gm-black/90 p-3 backdrop-blur md:hidden">
        <a href="#classes" className="rounded-full py-3 text-center font-extrabold uppercase tracking-wide ring-2 ring-white/25">Classes</a>
        <a href="#trial" className="rounded-full bg-gm-cyan py-3 text-center font-extrabold uppercase tracking-wide text-gm-black">Free week</a>
      </div>
    </>
  );
}
