import type { Metadata } from "next";
import { jakarta } from "@/components/demos/fonts";
import DemoBar from "@/components/demos/DemoBar";

export const metadata: Metadata = {
  title: { absolute: "Pulse Athletic: Gym website demo | OG WebWorks" },
  description: "A demo gym website built by OG WebWorks for a fictional fitness club: class timetable with booking, memberships, live busy meter and free trial pass.",
  robots: { index: false, follow: true },
};

export default function GymDemoLayout({ children }: LayoutProps<"/demos/gym">) {
  return (
    <div className={`${jakarta.variable} min-h-dvh bg-gm-black text-white [color-scheme:dark]`} style={{ "--p1": "#bff4ff", "--p2": "#12d6f8" } as React.CSSProperties}>
      <DemoBar label="Gym demo" />
      {children}
    </div>
  );
}
