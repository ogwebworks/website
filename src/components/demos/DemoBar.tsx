import Link from "next/link";
/** Persistent disclosure + conversion bar shown on every demo site. */
export default function DemoBar({ label }: { label: string }) {
  return (
    <div className="relative z-[60] bg-[#030820] text-[13px] text-[#f2f6ff]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <p className="truncate">
          <span className="mr-2 rounded-full bg-[#12d6f8] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#030820]">Demo</span>
          <span className="hidden sm:inline">{label}: a fictional business, designed &amp; built by </span>
          <span className="sm:hidden">Fictional business · by </span>
          <Link href="/" target="_top" className="font-semibold underline decoration-[#12d6f8] underline-offset-4">OG WebWorks</Link>
        </p>
        <Link href="/#contact" target="_top" className="shrink-0 rounded-full border border-white/20 px-3 py-1 font-semibold transition hover:bg-white/10">
          Get a site like this →
        </Link>
      </div>
    </div>
  );
}
