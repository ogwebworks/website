"use client";

import { useMemo, useState } from "react";
import { areas, fmtPrice, listings, type Area, type Listing } from "./data";
import HouseArt from "./HouseArt";
import { useRe } from "./store";

type Sort = "new" | "low" | "high" | "size";
const chip = (active: boolean) => `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-re-navy text-white" : "bg-white text-re-navy ring-1 ring-re-navy/10 hover:ring-re-navy/40"}`;

export function Heart({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={on ? "#1a52c4" : "none"} stroke={on ? "#1a52c4" : "currentColor"} strokeWidth="1.8" aria-hidden="true">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

export function ListingCard({ l, i = 0 }: { l: Listing; i?: number }) {
  const re = useRe();
  const saved = re.saved.includes(l.id);
  return (
    <article className="dm-fade-up group relative overflow-hidden rounded-3xl bg-white shadow-[0_10px_40px_-20px_rgba(7,17,52,0.35)] ring-1 ring-re-navy/5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(7,17,52,0.45)]" style={{ "--i": i } as React.CSSProperties}>
      <button type="button" onClick={() => re.openListing(l.id)} className="block w-full text-left" aria-label={`View ${l.title}, ${fmtPrice(l.price)}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="h-full w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]">
            <HouseArt style={l.style} seed={l.seed} dusk={l.dusk} />
          </div>
          {l.status && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-re-navy backdrop-blur">{l.status}</span>}
          <span className="absolute bottom-4 left-4 rounded-full bg-re-navy/80 px-3 py-1 font-re text-lg text-white backdrop-blur">{fmtPrice(l.price)}</span>
        </div>
        <div className="p-5">
          <h3 className="font-re text-xl tracking-tight text-re-navy">{l.title}</h3>
          <p className="mt-0.5 text-sm text-re-mute">{l.address} · {l.area}</p>
          <p className="mt-4 flex gap-4 text-sm text-re-navy/80">
            <span><strong className="text-re-navy">{l.beds}</strong> bd</span>
            <span><strong className="text-re-navy">{l.baths}</strong> ba</span>
            <span><strong className="text-re-navy">{l.sqft.toLocaleString("en-US")}</strong> sqft</span>
            <span className="ml-auto text-re-blue">{l.type}</span>
          </p>
        </div>
      </button>
      <button type="button" onClick={() => re.toggleSave(l.id)} aria-pressed={saved} aria-label={saved ? `Remove ${l.title} from saved homes` : `Save ${l.title}`} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-re-navy backdrop-blur transition hover:scale-110">
        <Heart on={saved} />
      </button>
    </article>
  );
}

/** Listings explorer: quick filters + sort + animated results grid. */
export default function Listings() {
  const re = useRe();
  const f = re.filters;
  const [sort, setSort] = useState<Sort>("new");
  const [savedOnly, setSavedOnly] = useState(false);

  const list = useMemo(() => {
    let l = listings.filter((x) => (f.area === "Any" || x.area === f.area) && (f.type === "Any" || x.type === f.type) && x.beds >= f.beds && x.price <= f.maxPrice && (!savedOnly || re.saved.includes(x.id)));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "size") l = [...l].sort((a, b) => b.sqft - a.sqft);
    if (sort === "new") l = [...l].sort((a, b) => Number(b.status === "New") - Number(a.status === "New"));
    return l;
  }, [f, sort, savedOnly, re.saved]);

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Neighbourhood">
          {(["Any", ...areas] as (Area | "Any")[]).map((a) => (
            <button key={a} type="button" aria-pressed={f.area === a} onClick={() => re.setFilters({ area: a })} className={chip(f.area === a)}>
              {a === "Any" ? "All areas" : a}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" aria-pressed={savedOnly} onClick={() => setSavedOnly((v) => !v)} className={`${chip(savedOnly)} inline-flex items-center gap-2`}>
            <Heart on={savedOnly} /> Saved ({re.saved.length})
          </button>
          <label className="sr-only" htmlFor="re-sort">Sort listings</label>
          <select id="re-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-re-navy ring-1 ring-re-navy/10">
            <option value="new">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="size">Largest</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-re-mute" aria-live="polite">
        <span><strong className="text-re-navy">{list.length}</strong> {list.length === 1 ? "home" : "homes"}</span>
        {f.type !== "Any" && <span className="rounded-full bg-re-sand px-3 py-1">{f.type}</span>}
        {f.beds > 0 && <span className="rounded-full bg-re-sand px-3 py-1">{f.beds}+ beds</span>}
        {f.maxPrice < 3500000 && <span className="rounded-full bg-re-sand px-3 py-1">Under {fmtPrice(f.maxPrice)}</span>}
        {(f.type !== "Any" || f.beds > 0 || f.maxPrice < 3500000 || f.area !== "Any") && (
          <button type="button" onClick={re.resetFilters} className="font-semibold text-re-blue underline underline-offset-4">Clear filters</button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center ring-1 ring-re-navy/5">
          <p className="font-re text-2xl text-re-navy">No homes match yet</p>
          <p className="mt-2 text-re-mute">New listings arrive weekly. Save this search and we&apos;ll email you first (demo).</p>
          <button type="button" onClick={re.resetFilters} className="mt-5 rounded-full bg-re-navy px-6 py-3 font-semibold text-white">Show all homes</button>
        </div>
      ) : (
        <div key={`${f.area}-${f.type}-${f.beds}-${f.maxPrice}-${sort}-${savedOnly}`} className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((l, i) => <ListingCard key={l.id} l={l} i={i} />)}
        </div>
      )}
    </div>
  );
}
