import type { Metadata } from "next";
import { jakarta } from "@/components/demos/fonts";
import DemoBar from "@/components/demos/DemoBar";
import Shell from "@/components/demos/fashion/Shell";
import FashionFooter from "@/components/demos/fashion/Footer";


export const metadata: Metadata = {
  title: { default: "Demo: Fashion E-commerce Store", template: "%s · Fashion store demo" },
  description: "A demo online store built by OG WebWorks for a fictional fashion label. See what your e-commerce site could look like.",
  robots: { index: false, follow: true },
};

export default function FashionDemoLayout({ children }: LayoutProps<"/demos/fashion">) {
  return (
    <div className={`${jakarta.variable} min-h-dvh bg-mv-ivory text-mv-ink [color-scheme:light]`}>
      <DemoBar label="E-commerce demo" />
      <Shell />
      <main id="main">{children}</main>
      <FashionFooter />
    </div>
  );
}
