import Logo from "./Logo";
import { services, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20">
      <div className="container-x grid gap-12 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-paper/60">{site.description}</p>
          <a href={`mailto:${site.email}`} className="mt-6 inline-block font-display text-xl font-semibold underline decoration-lime decoration-2 underline-offset-8 hover:text-lime">
            {site.email}
          </a>
        </div>
        <nav aria-label="Services">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-mute">Services</p>
          <ul className="space-y-2.5 text-paper/80">
            {services.map((s) => (
              <li key={s.slug}>
                <a href="#services" className="hover:text-lime">{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-mute">Company</p>
          <ul className="space-y-2.5 text-paper/80">
            <li><a href="#why" className="hover:text-lime">Why OG</a></li>
            <li><a href="#process" className="hover:text-lime">Process</a></li>
            <li><a href="#pricing" className="hover:text-lime">Pricing</a></li>
            <li><a href="#faq" className="hover:text-lime">FAQ</a></li>
            <li><a href="#contact" className="hover:text-lime">Get a proposal</a></li>
          </ul>
        </nav>
      </div>

      {/* Giant tagline wordmark */}
      <div className="container-x select-none" aria-hidden="true">
        <p className="bg-gradient-to-b from-white/15 to-transparent bg-clip-text font-display text-[clamp(3rem,13.5vw,13rem)] font-bold leading-[0.8] tracking-[-0.05em] text-transparent">
          Original.
        </p>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col justify-between gap-3 py-6 text-sm text-mute sm:flex-row">
          <p>© 2026 {site.legalName}. {site.tagline}</p>
          <p>Built with Next.js, Three.js & a lot of coffee.</p>
        </div>
      </div>
    </footer>
  );
}
