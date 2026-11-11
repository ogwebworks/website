// FICTIONAL gym, coaches and classes, used as a demo only. 555-01xx numbers are reserved for fiction.
export const gym = { name: "Pulse Athletic", phone: "(512) 555-0127", phoneHref: "+15125550127", address: "1200 Riverside Drive, Austin, TX" };

export type ClassType = "Strength" | "HIIT" | "Cycle" | "Yoga" | "Boxing";
export const types: ClassType[] = ["Strength", "HIIT", "Cycle", "Yoga", "Boxing"];
export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type GymClass = { id: string; day: (typeof days)[number]; time: string; name: string; type: ClassType; coach: string; mins: number; spots: number; cap: number; level: "All levels" | "Intermediate" | "Advanced" };

const base: Omit<GymClass, "id" | "day" | "spots">[] = [
  { time: "6:00 am", name: "Sunrise Strength", type: "Strength", coach: "Jade", mins: 50, cap: 16, level: "All levels" },
  { time: "7:15 am", name: "Power HIIT", type: "HIIT", coach: "Marco", mins: 45, cap: 20, level: "Intermediate" },
  { time: "9:30 am", name: "Flow Yoga", type: "Yoga", coach: "Aiyana", mins: 60, cap: 24, level: "All levels" },
  { time: "12:15 pm", name: "Lunch Ride", type: "Cycle", coach: "Theo", mins: 30, cap: 28, level: "All levels" },
  { time: "5:30 pm", name: "Box & Burn", type: "Boxing", coach: "Dee", mins: 50, cap: 18, level: "Intermediate" },
  { time: "6:45 pm", name: "Heavy Lifts", type: "Strength", coach: "Jade", mins: 60, cap: 12, level: "Advanced" },
  { time: "8:00 pm", name: "Night Ride", type: "Cycle", coach: "Theo", mins: 45, cap: 28, level: "All levels" },
];

// Deterministic weekly timetable: each day gets a rotating subset of classes with varying availability.
export const timetable: GymClass[] = days.flatMap((day, d) =>
  base
    .filter((_, i) => (i + d) % 4 !== 3 && !(day === "Sun" && i > 4))
    .map((c, i) => ({ ...c, id: `${day}-${i}`, day, spots: (d * 5 + i * 7) % (c.cap + 1) })),
);

export const plans = [
  { id: "core", name: "Core", monthly: 39, blurb: "Everything you need to train on your own.", features: ["24/7 gym floor access", "Locker rooms & showers", "App with workout plans", "1 guest pass / month"] },
  { id: "unlimited", name: "Unlimited", monthly: 79, blurb: "Gym access plus every class, every day.", features: ["Everything in Core", "Unlimited classes", "Recovery zone & sauna", "Body scan every month", "4 guest passes / month"], featured: true },
  { id: "elite", name: "Elite", monthly: 149, blurb: "Coaching that gets serious results.", features: ["Everything in Unlimited", "4 personal training sessions", "Custom nutrition plan", "Priority class booking"] },
];

export const coaches = [
  { name: "Jade Morales", role: "Head of strength", spec: "Powerlifting · mobility", years: 11, initials: "JM" },
  { name: "Marco Silva", role: "HIIT & conditioning", spec: "Metcon · fat loss", years: 8, initials: "MS" },
  { name: "Aiyana Brooks", role: "Yoga & recovery", spec: "Vinyasa · breathwork", years: 9, initials: "AB" },
  { name: "Dee Carter", role: "Boxing coach", spec: "Pads · footwork", years: 12, initials: "DC" },
];

export const reviews = [
  { q: "Down 18 lbs and stronger than I've ever been. The coaches actually know your name and your goals.", who: "Kayla R. · member 1 yr" },
  { q: "Booking classes in the app takes five seconds. The 6am strength crew is the best part of my day.", who: "James T. · member 2 yrs" },
  { q: "Clean, never too crowded, and the live busy meter means I always pick a quiet time.", who: "Priya N. · member 8 mo" },
  { q: "Box & Burn with Dee is unreal. Hardest, most fun hour of the week.", who: "Luis G. · member 6 mo" },
];

/** Typical occupancy by hour (0–100), used for the live busy meter. */
export const busyByHour = [8, 5, 4, 4, 6, 22, 58, 72, 55, 38, 34, 40, 52, 46, 32, 30, 44, 78, 92, 80, 60, 42, 26, 14];
