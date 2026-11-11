import type { Metadata } from "next";
import { jakarta } from "@/components/demos/fonts";
import DemoBar from "@/components/demos/DemoBar";

export const metadata: Metadata = {
  title: { absolute: "Ashford Lane Law: Law firm website demo | OG WebWorks" },
  description: "A demo law firm website built by OG WebWorks for a fictional practice: case intake quiz, results, attorney profiles, fee explainer and consultation booking.",
  robots: { index: false, follow: true },
};

export default function LawDemoLayout({ children }: LayoutProps<"/demos/law-firm">) {
  return (
    <div className={`${jakarta.variable} min-h-dvh bg-lw-paper text-lw-navy [color-scheme:light]`} style={{ "--p1": "#ffffff", "--p2": "#12d6f8" } as React.CSSProperties}>
      <DemoBar label="Law firm demo" />
      {children}
    </div>
  );
}
