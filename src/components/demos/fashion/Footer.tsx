import Link from "next/link";
import { BASE, categories } from "./data";
import { Wordmark } from "./Shell";

export default function FashionFooter() {
  return (
    <footer className="mt-24 bg-mv-ink text-sm text-mv-ivory/75">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Wordmark className="text-mv-ivory" />
          <p className="mt-4 max-w-xs">Considered clothing in natural fibres, made in small runs by workshops we know by name.</p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-mv-ivory">Shop</p>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.id}><Link href={`${BASE}/shop?c=${c.id}`} className="hover:text-white">{c.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-mv-ivory">Help</p>
          <ul className="space-y-2">
            <li>Shipping &amp; returns</li>
            <li>Size guide</li>
            <li>Care instructions</li>
            <li>Contact us</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-mv-ivory">This is a demo</p>
          <p>
            Maison Vale is a fictional brand. This store was designed and built by{" "}
            <Link href="/" target="_top" className="font-semibold text-[#12d6f8] underline underline-offset-4">OG WebWorks</Link>. No real orders or payments.
          </p>
        </div>
      </div>
    </footer>
  );
}
