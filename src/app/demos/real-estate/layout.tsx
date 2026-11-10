import type { Metadata } from "next";
import { jakarta } from "@/components/demos/fonts";
import DemoBar from "@/components/demos/DemoBar";

export const metadata: Metadata = {
  title: { absolute: "Meridian Homes: Real estate website demo | OG WebWorks" },
  description: "A demo real estate website built by OG WebWorks for a fictional brokerage: property search, listing details, mortgage calculator, tour booking and home valuation.",
  robots: { index: false, follow: true },
};

export default function RealEstateDemoLayout({ children }: LayoutProps<"/demos/real-estate">) {
  return (
    <div className={`${jakarta.variable} min-h-dvh bg-re-ice text-re-navy [color-scheme:light]`} style={{ "--p1": "#ffffff", "--p2": "#12d6f8" } as React.CSSProperties}>
      <DemoBar label="Real estate demo" />
      {children}
    </div>
  );
}
