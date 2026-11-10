import Link from "next/link";
import { BASE, money, type Product } from "./data";
import { ProductImage } from "./ProductArt";

/** Product tile: works in server and client components (no hooks). */
export default function ProductCard({ p, src, eager = false }: { p: Product; src?: string | null; eager?: boolean }) {
  return (
    <Link href={`${BASE}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-mv-sand">
        <div className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
          <ProductImage src={src} art={p.art} hex={p.colors[0].hex} alt={`${p.name} in ${p.colors[0].name}`} eager={eager} />
        </div>
        {p.badge && (
          <span className={`absolute left-3 top-3 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${p.badge === "Sale" ? "bg-mv-clay text-white" : "bg-mv-ivory text-mv-ink"}`}>
            {p.badge}
          </span>
        )}
        <span className="absolute inset-x-3 bottom-3 translate-y-2 bg-mv-ivory/95 py-2.5 text-center text-xs font-medium uppercase tracking-[0.16em] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View product
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-medium">{p.name}</h3>
          <div className="mt-1.5 flex gap-1.5" aria-label={`${p.colors.length} colours`}>
            {p.colors.map((c) => (
              <span key={c.name} title={c.name} className="h-3 w-3 rounded-full ring-1 ring-mv-ink/15" style={{ background: c.hex }} />
            ))}
          </div>
        </div>
        <p className="shrink-0 text-[15px]">
          {p.compareAt && <span className="mr-1.5 text-mv-mute line-through">{money(p.compareAt)}</span>}
          <span className={p.compareAt ? "text-mv-clay" : ""}>{money(p.price)}</span>
        </p>
      </div>
    </Link>
  );
}
