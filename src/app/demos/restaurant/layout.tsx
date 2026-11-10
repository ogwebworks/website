import type { Metadata } from "next";
import { jakarta } from "@/components/demos/fonts";
import DemoBar from "@/components/demos/DemoBar";


export const metadata: Metadata = {
  title: { absolute: "Ember & Salt: Restaurant website demo | OG WebWorks" },
  description: "A demo restaurant website built by OG WebWorks for a fictional wood-fired kitchen: animated menu, online reservations and more.",
  robots: { index: false, follow: true },
};

export default function RestaurantDemoLayout({ children }: LayoutProps<"/demos/restaurant">) {
  return (
    <div className={`${jakarta.variable} min-h-dvh bg-es-char text-es-cream [color-scheme:dark]`} style={{ "--p1": "#bff4ff", "--p2": "#12d6f8" } as React.CSSProperties}>
      <DemoBar label="Restaurant demo" />
      {children}
    </div>
  );
}
