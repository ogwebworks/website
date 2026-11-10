import SiteImage from "./SiteImage";
import DemoPreview from "./DemoPreview";
import Reveal from "./Reveal";

const treeFeatures = ["Online estimates with photo upload", "Drag-to-compare before/after slider", "Sticky call & quote bar on mobile", "Reviews, service areas & FAQ"];
const shopFeatures = ["Product catalogue with filters", "Cart & checkout flow", "Product pages built to rank", "Fast on every phone"];

/** Homepage: live demo websites visitors can click through. */
export default function Demos() {
  return (
    <section id="demos" className="container-x py-24 sm:py-32">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Live demos</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">See what you&apos;ll get.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-paper/65">Click through complete demo websites we&apos;ve built for fictional businesses. Yours is designed from scratch for your brand.</p>
        </Reveal>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Reveal className="min-w-0">
          <div className="flex h-full min-w-0 flex-col gap-6 rounded-3xl border border-line bg-ink-2 p-3 sm:p-4">
            <DemoPreview
              src="/demos/tree-services"
              title="Canopy & Crown: tree services demo website"
              host="canopyandcrown.demo"
              poster={<SiteImage name="demo-tree-thumb" sizes="(min-width: 1024px) 60vw, 100vw" className="object-top" />}
            />
            <div className="px-3 pb-3 sm:px-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Local services</p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-tight">Tree care company</h3>
              <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-paper/70 sm:grid-cols-2">
                {treeFeatures.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-brand" aria-hidden="true">✓</span>{f}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-mute">Fully interactive: scroll, click and try the form. Switch between desktop and mobile, or expand it.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-dashed border-line bg-ink-2/50 p-6 sm:p-8">
            <div>
              <span className="inline-block rounded-full bg-azure/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#7fb0ff]">Coming soon</span>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">E-commerce store</h3>
              <ul className="mt-4 space-y-1.5 text-sm text-paper/70">
                {shopFeatures.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-azure" aria-hidden="true">✓</span>{f}</li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <p className="text-sm text-mute">More on the way: clinics, law firms, restaurants, SaaS.</p>
              <a href="#contact" className="mt-4 inline-flex items-center gap-2 font-semibold text-brand underline decoration-brand/40 underline-offset-4">
                Need one for your industry? Ask us →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
