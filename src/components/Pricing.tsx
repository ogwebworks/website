import Reveal from "./Reveal";

// DRAFT prices from ROADMAP.md §5.4. Confirm before launch.
const plans = [
  {
    name: "Essential",
    price: "$79",
    period: "/mo",
    blurb: "Peace of mind for small sites.",
    features: ["Core, plugin & theme updates", "Weekly off-site backups", "Uptime & security monitoring", "Monthly health report"],
    sla: "2 business-day response",
  },
  {
    name: "Growth",
    price: "$199",
    period: "/mo",
    blurb: "For businesses that rely on their site.",
    features: ["Everything in Essential", "Daily backups", "1 hr/mo of dev or content edits", "SEO & speed snapshot", "Malware cleanup included"],
    sla: "1 business-day response",
    featured: true,
  },
  {
    name: "Priority",
    price: "$399",
    period: "/mo",
    blurb: "Mission-critical, revenue sites.",
    features: ["Everything in Growth", "On-demand backups", "3 hrs/mo of dev time", "Monthly strategy call"],
    sla: "4 business-hour response",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="container-x py-24 sm:py-32">
      <Reveal className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-azure">Care plans</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">Honest pricing. No surprises.</h2>
        <p className="mt-5 text-paper/65">
          Websites, branding, SEO and ads are quoted per project after a free strategy call. Maintenance is simple:
        </p>
      </Reveal>
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div
              className={`relative flex h-full flex-col rounded-3xl border p-8 transition duration-500 hover:-translate-y-1 ${
                p.featured ? "border-brand/50 bg-gradient-to-b from-brand/[0.09] to-ink-2 shadow-[0_0_80px_-30px_var(--color-brand)]" : "border-line bg-ink-2"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">Most popular</span>
              )}
              <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-mute">{p.blurb}</p>
              <p className="mt-6 font-display text-6xl font-bold tracking-tight">
                {p.price}
                <span className="text-lg font-medium text-mute">{p.period}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="text-brand" aria-hidden="true">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-line pt-5 text-sm text-mute">{p.sla}</p>
              <a
                href="#contact"
                className={`mt-6 block rounded-full px-6 py-3.5 text-center font-semibold transition ${
                  p.featured ? "bg-brand text-ink hover:brightness-110" : "border border-line hover:bg-white/5"
                }`}
              >
                Choose {p.name}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
