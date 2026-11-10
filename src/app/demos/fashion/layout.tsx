import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import DemoBar from "@/components/demos/DemoBar";
import Shell from "@/components/demos/fashion/Shell";
import FashionFooter from "@/components/demos/fashion/Footer";

const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], display: "swap", preload: false, style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: { default: "Demo: Fashion E-commerce Store", template: "%s · Fashion store demo" },
  description: "A demo online store built by OG WebWorks for a fictional fashion label. See what your e-commerce site could look like.",
  robots: { index: false, follow: true },
};

export default function FashionDemoLayout({ children }: LayoutProps<"/demos/fashion">) {
  return (
    <div className={`${bodoni.variable} min-h-dvh bg-mv-ivory text-mv-ink [color-scheme:light]`}>
      <DemoBar label="E-commerce demo" />
      <Shell />
      <main id="main">{children}</main>
      <FashionFooter />
    </div>
  );
}
