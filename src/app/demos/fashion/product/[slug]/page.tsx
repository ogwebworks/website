import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBuy from "@/components/demos/fashion/ProductBuy";
import ProductCard from "@/components/demos/fashion/ProductCard";
import { BASE, categories, getProduct, products } from "@/components/demos/fashion/data";
import { productImages } from "@/components/demos/fashion/images";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/demos/fashion/product/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: p?.name ?? "Product" };
}

export default async function ProductPage({ params }: PageProps<"/demos/fashion/product/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const imgs = productImages();
  const cat = categories.find((c) => c.id === p.category)!;
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).concat(products.filter((x) => x.category !== p.category)).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-mv-mute">
        <Link href={BASE} className="hover:text-mv-ink">Home</Link> / <Link href={`${BASE}/shop?c=${cat.id}`} className="hover:text-mv-ink">{cat.label}</Link> / <span className="text-mv-ink">{p.name}</span>
      </nav>
      <ProductBuy p={p} src={imgs[p.slug]} />

      <section className="pt-24">
        <h2 className="font-mv text-4xl">You may also like</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((r) => (
            <ProductCard key={r.slug} p={r} src={imgs[r.slug]} />
          ))}
        </div>
      </section>
    </div>
  );
}
