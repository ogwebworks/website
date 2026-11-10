import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { getImage } from "@/lib/images";

const ogImage = getImage("og");
import SmoothScroll from "@/components/SmoothScroll";
import MotionProvider from "@/components/MotionProvider";

// Body font is not preloaded, so it stays off the critical path for the hero headline (LCP).
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "web development agency",
    "website maintenance",
    "brand development",
    "SEO agency",
    "AEO",
    "GEO",
    "generative engine optimization",
    "ads management",
    "website error fix",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    ...(ogImage && { images: [{ url: ogImage.src, width: ogImage.w, height: ogImage.h, alt: ogImage.alt }] }),
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    ...(ogImage && { images: [ogImage.src] }),
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030820",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
