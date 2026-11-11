// FICTIONAL clinic, clinicians and insurers, used as a demo only. 555-01xx numbers are reserved for fiction.
export const clinic = { name: "Harbourside Health", phone: "(206) 555-0193", phoneHref: "+12065550193", address: "88 Pier Avenue, Harbourside, WA" };

export type ServiceId = "family" | "pediatrics" | "dermatology" | "womens" | "physio" | "telehealth";
export const services: { id: ServiceId; title: string; text: string; icon: string; length: number }[] = [
  { id: "family", title: "Family medicine", text: "Check-ups, chronic conditions, vaccinations and same-day sick visits for every age.", icon: "heart", length: 20 },
  { id: "pediatrics", title: "Pediatrics", text: "Gentle care from newborns to teens: growth checks, immunisations and school forms.", icon: "child", length: 30 },
  { id: "dermatology", title: "Dermatology", text: "Skin checks, acne, eczema and mole mapping with a board-certified dermatologist.", icon: "skin", length: 20 },
  { id: "womens", title: "Women's health", text: "Annual exams, contraception, prenatal care and menopause support.", icon: "flower", length: 30 },
  { id: "physio", title: "Physiotherapy", text: "Injury rehab, back and neck pain, and sports recovery plans that work.", icon: "move", length: 45 },
  { id: "telehealth", title: "Video visits", text: "See a clinician from home, often within the hour. Prescriptions sent to your pharmacy.", icon: "video", length: 15 },
];

export type Doctor = { id: string; name: string; title: string; services: ServiceId[]; langs: string[]; years: number; initials: string; next: number; rating: number; hue: [string, string] };
export const doctors: Doctor[] = [
  { id: "chen", name: "Dr. Lena Chen", title: "Family physician", services: ["family", "telehealth"], langs: ["English", "Mandarin"], years: 14, initials: "LC", next: 0, rating: 4.9, hue: ["#12d6f8", "#1d6dff"] },
  { id: "osei", name: "Dr. Kwame Osei", title: "Pediatrician", services: ["pediatrics", "telehealth"], langs: ["English", "French"], years: 11, initials: "KO", next: 1, rating: 4.9, hue: ["#a1c1fa", "#1d6dff"] },
  { id: "garcia", name: "Dr. Sofia García", title: "Dermatologist", services: ["dermatology"], langs: ["English", "Spanish"], years: 9, initials: "SG", next: 2, rating: 4.8, hue: ["#12d6f8", "#0a1f5c"] },
  { id: "patel", name: "Dr. Anika Patel", title: "OB-GYN", services: ["womens", "telehealth"], langs: ["English", "Hindi"], years: 16, initials: "AP", next: 1, rating: 5.0, hue: ["#7fb3ff", "#16307a"] },
  { id: "brooks", name: "Sam Brooks, DPT", title: "Physiotherapist", services: ["physio"], langs: ["English"], years: 8, initials: "SB", next: 0, rating: 4.9, hue: ["#12d6f8", "#1a52c4"] },
  { id: "nguyen", name: "Dr. Minh Nguyen", title: "Family physician", services: ["family", "telehealth"], langs: ["English", "Vietnamese"], years: 6, initials: "MN", next: 0, rating: 4.8, hue: ["#a1c1fa", "#0a1f5c"] },
];

export const insurers = ["Northstar Health", "Bluepine Care", "Harbor Mutual", "Evergreen Plans", "Summit Benefits", "Cascade Shield", "Medicare", "Medicaid", "Self-pay"];

export const hours: { day: string; open?: [number, number] }[] = [
  { day: "Sunday" },
  { day: "Monday", open: [8, 19] },
  { day: "Tuesday", open: [8, 19] },
  { day: "Wednesday", open: [8, 19] },
  { day: "Thursday", open: [8, 19] },
  { day: "Friday", open: [8, 17] },
  { day: "Saturday", open: [9, 13] },
];

export const faqs = [
  { q: "Are you accepting new patients?", a: "Yes. All our clinicians are accepting new patients, and most new-patient visits are available within the week." },
  { q: "Do you take my insurance?", a: "We work with most major plans and offer clear self-pay prices. Use the insurance checker on this page or call us to confirm." },
  { q: "Can I get a same-day appointment?", a: "We hold same-day slots every morning for sick visits, and video visits are often available within the hour." },
  { q: "How do video visits work?", a: "Book online, get a secure link by text, and join from your phone or laptop. Prescriptions go straight to your pharmacy." },
  { q: "What should I bring to my first visit?", a: "Photo ID, your insurance card and a list of medications. Arrive 10 minutes early, or complete forms online beforehand." },
];

export const reviews = [
  { q: "Booked online at 7am, seen by 9:30. Dr. Chen actually listened. This is what healthcare should feel like.", who: "Rachel M." },
  { q: "Our kids love Dr. Osei. Reminders by text, no waiting room chaos, and the portal is so easy.", who: "The Alvarez family" },
  { q: "Video visit from my office in 15 minutes, prescription ready at the pharmacy by lunch.", who: "Tom H." },
  { q: "Physio with Sam fixed a shoulder problem I'd had for two years. Clear plan, real results.", who: "Grace L." },
];
