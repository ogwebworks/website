import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono } from "next/font/google";
import DemoBar from "@/components/demos/DemoBar";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["500", "700", "800"], display: "swap" });
const dmMono = DM_Mono({ variable: "--font-dmmono", subsets: ["latin"], weight: ["400", "500"], display: "swap", preload: false });

export const metadata: Metadata = {
  title: { absolute: "Ember & Salt: Restaurant website demo | OG WebWorks" },
  description: "A demo restaurant website built by OG WebWorks for a fictional wood-fired kitchen: printed-menu design, cursor dish previews and ticket-style reservations.",
  robots: { index: false, follow: true },
};

export default function RestaurantDemoLayout({ children }: LayoutProps<"/demos/restaurant">) {
  return (
    <div className={`${bricolage.variable} ${dmMono.variable} min-h-dvh bg-rs-paper2 text-rs-ink [color-scheme:light]`}>
      <DemoBar label="Restaurant demo" />
      {children}
    </div>
  );
}
