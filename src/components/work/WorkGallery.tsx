import SiteImage from "../SiteImage";
import Reveal from "../Reveal";
import WorkRing from "./WorkRing";
import { demos } from "@/lib/demos";

/** Portfolio: the demo builds on a 3D carousel ring. Server part renders the posters. */
export default function WorkGallery() {
  const items = demos.map((d) => ({
    src: d.src,
    host: d.host,
    title: d.title,
    kind: d.kind,
    heading: d.heading,
    poster: <SiteImage name={d.thumb} sizes="(min-width: 1024px) 34rem, 80vw" className="object-top" />,
  }));
  return (
    <section id="work" aria-labelledby="work-h" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-x mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Selected work</p>
          <h2 id="work-h" className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {demos.length} live sites. <span className="text-gradient">Zero templates.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-paper/65">
            Drag the ring, then open any project to use the live site full screen. Each one has its own concept, palette and type.
          </p>
        </Reveal>
      </div>
      <WorkRing items={items} />
    </section>
  );
}
