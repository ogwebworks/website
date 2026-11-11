import type { Metadata } from "next";
import { jakarta } from "@/components/demos/fonts";
import DemoBar from "@/components/demos/DemoBar";

export const metadata: Metadata = {
  title: { absolute: "Harbourside Health: Clinic website demo | OG WebWorks" },
  description: "A demo medical clinic website built by OG WebWorks for a fictional family practice: online booking, clinician directory, video visits and insurance checker.",
  robots: { index: false, follow: true },
};

export default function ClinicDemoLayout({ children }: LayoutProps<"/demos/clinic">) {
  return (
    <div className={`${jakarta.variable} min-h-dvh bg-cl-bg text-cl-navy [color-scheme:light]`}>
      <DemoBar label="Clinic demo" />
      {children}
    </div>
  );
}
