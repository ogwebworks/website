import { getImage, imageSlots, type ImageSlot } from "@/lib/images";

/**
 * Server component: renders the real image if `public/images/<name>.*` exists at build time,
 * otherwise a branded placeholder that names the slot (see docs/IMAGE_PROMPTS.md).
 */
export default function SiteImage({
  name,
  className = "",
  priority = false,
  sizes = "100vw",
  labelAtTop = false,
}: {
  name: ImageSlot;
  labelAtTop?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const img = getImage(name);
  const spec = imageSlots[name];

  if (img) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export: images are pre-optimised by `npm run images`
      <img
        src={img.src}
        alt={img.alt}
        width={img.w}
        height={img.h}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative grid h-full w-full justify-items-center overflow-hidden bg-ink-3 ${labelAtTop ? "content-start pt-[22%]" : "content-center"} ${className}`}
      style={{ aspectRatio: `${spec.w} / ${spec.h}` }}
      role="img"
      aria-label={spec.alt}
      data-image-slot={name}
    >
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgb(198_244_50/0.18),transparent_55%),radial-gradient(circle_at_75%_80%,rgb(123_97_255/0.3),transparent_60%)]" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-2 text-center" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-paper/40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path d="m21 16-5-5-9 9" />
        </svg>
        <span className="rounded-full border border-line bg-ink/60 px-3 py-1 font-mono text-[11px] text-paper/60">
          {name} · {spec.w}×{spec.h}
        </span>
      </div>
    </div>
  );
}
