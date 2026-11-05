import Reveal from "./Reveal";

const rows = [
  { label: "Custom design (no templates)", og: true, big: "Sometimes", free: "Rarely" },
  { label: "Talk directly to senior experts", og: true, big: "Account managers", free: true },
  { label: "SEO + AEO + GEO + Ads in one team", og: true, big: true, free: false },
  { label: "Emergency fixes for one-off issues", og: true, big: false, free: "Maybe" },
  { label: "Transparent, published pricing", og: true, big: "Some", free: "Varies" },
  { label: "You own every account & line of code", og: true, big: "Varies", free: "Varies" },
];

function Cell({ v, highlight = false }: { v: boolean | string; highlight?: boolean }) {
  if (v === true)
    return (
      <span className={`inline-grid h-7 w-7 place-items-center rounded-full ${highlight ? "bg-lime text-ink" : "bg-white/10 text-paper"}`}>
        <span className="sr-only">Yes</span>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
        </svg>
      </span>
    );
  if (v === false) return <span className="text-mute">No</span>;
  return <span className="text-sm text-mute">{v}</span>;
}

export default function Comparison() {
  return (
    <section className="container-x py-24 sm:py-32">
      <Reveal className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">The OG difference</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">Big-agency firepower. None of the bloat.</h2>
      </Reveal>
      <Reveal>
        <div className="relative max-w-full overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[40rem] text-left">
            <caption className="sr-only">OG WebWorks compared with large agencies and freelancers</caption>
            <thead>
              <tr className="border-b border-line text-sm">
                <th scope="col" className="p-5 font-medium text-mute sm:p-6">What you get</th>
                <th scope="col" className="bg-lime/[0.07] p-5 font-display text-base font-semibold text-lime sm:p-6">OG WebWorks</th>
                <th scope="col" className="p-5 font-medium text-mute sm:p-6">Big agency</th>
                <th scope="col" className="p-5 font-medium text-mute sm:p-6">Freelancer</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-5 font-medium sm:p-6">{r.label}</th>
                  <td className="bg-lime/[0.07] p-5 sm:p-6"><Cell v={r.og} highlight /></td>
                  <td className="p-5 sm:p-6"><Cell v={r.big} /></td>
                  <td className="p-5 sm:p-6"><Cell v={r.free} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
