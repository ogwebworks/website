/** Brand lockup: logo mark (bars + arrow) + "OGWebWorks" wordmark, as in the official logo. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny pre-sized asset (static export) */}
      <img src="/logo-mark-80.png" alt="" width={65} height={40} className="h-9 w-auto" />
      <span className="font-display text-[1.3rem] font-bold tracking-tight">
        <span className="bg-gradient-to-r from-brand to-[#0688f5] bg-clip-text text-transparent">OG</span>
        WebWorks
      </span>
    </span>
  );
}
