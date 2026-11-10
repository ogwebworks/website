import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import DemoBar from "@/components/demos/DemoBar";

const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  title: { absolute: "Ember & Salt: Restaurant website demo | OG WebWorks" },
  description: "A demo restaurant website built by OG WebWorks for a fictional wood-fired kitchen: animated menu, online reservations and more.",
  robots: { index: false, follow: true },
};

export default function RestaurantDemoLayout({ children }: LayoutProps<"/demos/restaurant">) {
  return (
    <div className={`${instrument.variable} min-h-dvh bg-es-char text-es-cream [color-scheme:dark]`}>
      <DemoBar label="Restaurant demo" />
      {children}
    </div>
  );
}
