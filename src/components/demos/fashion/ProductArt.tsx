import type { Art } from "./data";

/** Shape, fold lines and details for each garment type (viewBox 0 0 400 500). */
const shapes: Record<Art, { body: string; lines: string[]; extra?: React.ReactNode }> = {
  dress: {
    body: "M168 78 Q200 98 232 78 L246 88 L252 150 Q244 172 240 196 L304 438 Q200 458 96 438 L160 196 Q156 172 148 150 L154 88 Z",
    lines: ["M160 196 Q200 206 240 196", "M188 210 L160 430", "M214 210 L244 432", "M200 208 L202 444"],
  },
  top: {
    body: "M140 92 L176 78 Q200 96 224 78 L260 92 L322 142 L296 188 L266 166 L266 404 L134 404 L134 166 L104 188 L78 142 Z",
    lines: ["M200 96 L200 404", "M176 78 L200 112 L224 78", "M134 166 L150 140", "M266 166 L250 140"],
  },
  knit: {
    body: "M146 90 Q200 112 254 90 L300 108 L338 332 L302 342 L270 182 L270 402 L130 402 L130 182 L98 342 L62 332 L100 108 Z",
    lines: ["M130 380 L270 380", "M130 390 L270 390", "M146 90 Q200 128 254 90", "M64 320 L98 330", "M302 330 L336 320"],
  },
  coat: {
    body: "M150 80 L200 124 L250 80 L300 100 L332 302 L300 308 L286 172 L292 462 L108 462 L114 172 L100 308 L68 302 L100 100 Z",
    lines: ["M200 124 L200 462", "M150 80 L178 210 L200 124", "M250 80 L222 210 L200 124", "M120 300 L170 300", "M230 300 L280 300"],
    extra: (
      <>
        <circle cx="212" cy="240" r="5" />
        <circle cx="212" cy="290" r="5" />
        <circle cx="212" cy="340" r="5" />
      </>
    ),
  },
  trousers: {
    body: "M134 82 L266 82 L288 452 L214 452 L200 176 L186 452 L112 452 Z",
    lines: ["M134 104 L266 104", "M166 104 L160 300", "M234 104 L240 300", "M200 104 L200 176"],
  },
  bag: {
    body: "M108 200 L292 200 L314 432 L86 432 Z",
    lines: ["M108 236 L292 236", "M200 236 L200 280"],
    extra: <path d="M150 202 Q150 108 200 108 Q250 108 250 202" fill="none" strokeWidth="14" stroke="currentColor" strokeLinecap="round" />,
  },
};

/** Stylised product illustration in the selected colour: the stand-in until a product photo exists. */
export default function ProductArt({ art, hex, className = "" }: { art: Art; hex: string; className?: string }) {
  const s = shapes[art];
  return (
    <div
      className={`relative grid h-full w-full place-items-center overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 90% at 50% 30%, color-mix(in oklab, ${hex} 18%, #f8faff), color-mix(in oklab, ${hex} 32%, #dfe7f5))` }}
    >
      <svg viewBox="0 0 400 500" className="h-[82%] w-auto drop-shadow-[0_18px_22px_rgba(3,8,32,0.18)]" style={{ color: hex }} aria-hidden="true">
        <path d={s.body} fill={hex} />
        <g fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="2.5" strokeLinecap="round">
          {s.lines.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path d={s.body} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
        {s.extra && <g fill="rgba(0,0,0,0.28)" stroke={hex}>{s.extra}</g>}
      </svg>
    </div>
  );
}

/** Real photo when available (public/images/demo-fashion-<slug>.webp), otherwise the illustration. */
export function ProductImage({ src, art, hex, alt, className = "", eager = false }: { src?: string | null; art: Art; hex: string; alt: string; className?: string; eager?: boolean }) {
  if (src)
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimised
      <img src={src} alt={alt} width={1200} height={1500} loading={eager ? "eager" : "lazy"} decoding="async" className={`h-full w-full object-cover ${className}`} />
    );
  return (
    <div role="img" aria-label={alt} className={`h-full w-full ${className}`}>
      <ProductArt art={art} hex={hex} />
    </div>
  );
}
