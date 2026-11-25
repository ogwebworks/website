import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { jakarta } from "@/components/demos/fonts";
import DemoBar from "@/components/demos/DemoBar";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: { absolute: "Halcyon Bay Residences: new-development website demo | OG WebWorks" },
  description: "A demo new-development website built by OG WebWorks for a fictional waterfront tower: scroll-driven floor selection, 3D residence cutaways, interiors and live availability.",
  robots: { index: false, follow: true },
};

export default function HalcyonLayout({ children }: LayoutProps<"/demos/halcyon-bay">) {
  return (
    <div className={`${jakarta.variable} ${playfair.variable} min-h-dvh bg-hb-ivory font-hb text-hb-ink [color-scheme:light]`}>
      <DemoBar label="New-development demo" />
      {children}
    </div>
  );
}
