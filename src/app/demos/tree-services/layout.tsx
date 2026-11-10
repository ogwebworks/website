import type { Metadata } from "next";
import { jakarta } from "@/components/demos/fonts";


export const metadata: Metadata = {
  title: "Demo: Tree Services Website",
  description: "A demo website built by OG WebWorks for a fictional tree care company. See what your local service business could look like.",
  // Demo of a fictional business: keep it out of search results.
  robots: { index: false, follow: true },
  alternates: { canonical: "/demos/tree-services" },
};

export default function TreeDemoLayout({ children }: LayoutProps<"/demos/tree-services">) {
  return <div className={`${jakarta.variable} min-h-dvh bg-tree-cream text-tree-ink [color-scheme:light]`}>{children}</div>;
}
