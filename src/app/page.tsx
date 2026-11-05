import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Pillars from "@/components/Pillars";
import Stats from "@/components/Stats";
import Statement from "@/components/Statement";
import Process from "@/components/Process";
import AiCallout from "@/components/AiCallout";
import Comparison from "@/components/Comparison";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import ProposalForm from "@/components/ProposalForm";
import Footer from "@/components/Footer";
import { faqs, services, site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      slogan: site.tagline,
      description: site.description,
      email: site.email,
      areaServed: "Worldwide",
      knowsAbout: ["Web development", "Website maintenance", "Brand development", "SEO", "Answer Engine Optimization", "Generative Engine Optimization", "PPC advertising"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Digital services",
        itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.short } })),
      },
    },
    { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, publisher: { "@id": `${site.url}/#organization` } },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Pillars />
        <Stats />
        <Statement />
        <Process />
        <AiCallout />
        <Comparison />
        <Pricing />
        <Faq />
        <ProposalForm />
      </main>
      <Footer />
    </>
  );
}
