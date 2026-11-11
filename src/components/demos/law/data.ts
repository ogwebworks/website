// FICTIONAL law firm, attorneys and case results, used as a demo only. 555-01xx numbers are reserved for fiction.
export const firm = { name: "Ashford Lane", suffix: "Law", phone: "(312) 555-0164", phoneHref: "+13125550164", address: "400 Wacker Plaza, Suite 2100, Chicago, IL" };

export type AreaId = "injury" | "employment" | "family" | "business" | "estate" | "criminal";
export const areas: { id: AreaId; title: string; short: string; long: string; points: string[] }[] = [
  { id: "injury", title: "Personal injury", short: "Car accidents, slips and falls, medical negligence.", long: "When an injury upends your life, we handle the insurers so you can focus on recovery. We investigate, build the evidence and fight for full compensation.", points: ["Car & truck accidents", "Workplace injuries", "Medical negligence", "No win, no fee"] },
  { id: "employment", title: "Employment", short: "Wrongful termination, discrimination, unpaid wages.", long: "We stand up for employees against unfair dismissal, harassment, discrimination and wage theft, and advise employers on getting it right.", points: ["Wrongful termination", "Discrimination & harassment", "Unpaid wages & overtime", "Severance negotiation"] },
  { id: "family", title: "Family law", short: "Divorce, custody, support and mediation.", long: "Calm, discreet guidance through divorce, custody and support, with mediation first and courtroom strength when it's needed.", points: ["Divorce & separation", "Child custody", "Support & alimony", "Prenuptial agreements"] },
  { id: "business", title: "Business law", short: "Contracts, disputes, formation and M&A.", long: "From formation to exit, we draft the contracts, resolve disputes and protect the company you've built.", points: ["Contracts & agreements", "Partnership disputes", "Company formation", "Mergers & acquisitions"] },
  { id: "estate", title: "Estate planning", short: "Wills, trusts, probate and guardianship.", long: "Protect your family and your legacy with clear wills and trusts, and get compassionate help through probate.", points: ["Wills & trusts", "Probate administration", "Powers of attorney", "Guardianship"] },
  { id: "criminal", title: "Criminal defense", short: "DUI, misdemeanors and felony defense.", long: "Your rights matter from the first call. We act fast, scrutinise the evidence and defend you at every stage.", points: ["DUI & traffic", "Misdemeanors", "Felony defense", "Expungement"] },
];

export const results: { area: AreaId; amount: number; label: string; detail: string }[] = [
  { area: "injury", amount: 4200000, label: "Verdict", detail: "Truck collision, spinal injury" },
  { area: "injury", amount: 1850000, label: "Settlement", detail: "Medical misdiagnosis" },
  { area: "employment", amount: 980000, label: "Settlement", detail: "Wrongful termination & retaliation" },
  { area: "business", amount: 2600000, label: "Recovery", detail: "Breach of contract, supply dispute" },
  { area: "injury", amount: 725000, label: "Settlement", detail: "Commercial premises fall" },
  { area: "employment", amount: 415000, label: "Settlement", detail: "Unpaid overtime class action" },
  { area: "estate", amount: 1300000, label: "Recovery", detail: "Contested estate, undue influence" },
  { area: "family", amount: 0, label: "Full custody", detail: "Relocation case, custody secured" },
  { area: "criminal", amount: 0, label: "Charges dismissed", detail: "Felony charge dismissed pre-trial" },
];

export const attorneys = [
  { name: "Eleanor Ashford", role: "Founding partner", areas: ["injury", "business"] as AreaId[], years: 24, school: "Northwestern Law", initials: "EA", bio: "Trial lawyer with more than 60 jury verdicts. Named a top litigator for twelve consecutive years." },
  { name: "Marcus Lane", role: "Managing partner", areas: ["employment", "business"] as AreaId[], years: 19, school: "University of Chicago Law", initials: "ML", bio: "Represents employees and growing companies in disputes, negotiations and complex settlements." },
  { name: "Priya Raman", role: "Partner", areas: ["family", "estate"] as AreaId[], years: 15, school: "Georgetown Law", initials: "PR", bio: "Certified mediator known for resolving sensitive family matters with discretion and care." },
  { name: "Daniel Brooks", role: "Senior associate", areas: ["criminal", "injury"] as AreaId[], years: 9, school: "Loyola Chicago Law", initials: "DB", bio: "Former public defender. Fast, thorough and relentless about protecting clients' rights." },
];

export const testimonials = [
  { q: "After my accident I didn't know where to turn. They took every call off my plate and secured a settlement far beyond what the insurer offered.", who: "Client · Personal injury" },
  { q: "Clear advice, honest expectations and constant updates. I never once felt in the dark.", who: "Client · Employment" },
  { q: "Priya made the hardest year of my life manageable. Calm, kind and incredibly sharp.", who: "Client · Family law" },
  { q: "They negotiated our partnership exit in weeks, not months, and protected everything we built.", who: "Client · Business law" },
];

export const faqs = [
  { q: "How much does a consultation cost?", a: "Your first consultation is free and confidential. We'll review your situation and explain your options with no obligation." },
  { q: "What does 'no win, no fee' mean?", a: "For injury cases we work on contingency: our fee is a percentage of what we recover for you. If we don't win, you don't pay legal fees." },
  { q: "How long will my case take?", a: "Every matter is different. Many settle in months; cases that go to trial can take longer. We give you a realistic timeline at the start." },
  { q: "Will I speak to an actual attorney?", a: "Yes. An attorney reviews every inquiry and you'll have a named lawyer and a direct line throughout your case." },
];

export const fmtMoney = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 2).replace(/\.?0+$/, "")}M` : `$${Math.round(n / 1000)}K`);
