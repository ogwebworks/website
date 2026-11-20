import type { ProductId } from "@/lib/store";

/** Line icons for each product (tabs, plan drawer, and the no-WebGL stage). */
export default function ProductIcon({ id, className = "h-6 w-6" }: { id: ProductId; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...p}>
      {id === "website" && (<><rect x="3" y="5" width="15" height="10" rx="1.5" /><path d="M6 18h12a2 2 0 0 0 2-2V8" /><path d="M3 8h15" /></>)}
      {id === "brand" && <path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5Z" />}
      {id === "seo" && (<><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5.5 5.5" /><path d="M8 12.5v-1.5M10.5 12.5v-3M13 12.5V8" /></>)}
      {id === "ai" && (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5c.3 2.4 1.6 3.7 4 4-2.4.3-3.7 1.6-4 4-.3-2.4-1.6-3.7-4-4 2.4-.3 3.7-1.6 4-4Z" /></>)}
      {id === "ads" && (<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /><path d="m13 11 7-7M17 4h3v3" /></>)}
      {id === "care" && (<><path d="M12 2.8 19.5 5.5v6c0 4.4-3.1 8-7.5 9.7C7.6 19.5 4.5 15.9 4.5 11.5v-6Z" /><path d="m8.8 12 2.2 2.2 4.4-4.6" /></>)}
    </svg>
  );
}
