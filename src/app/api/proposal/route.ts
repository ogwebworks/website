import { NextResponse } from "next/server";

type Payload = {
  services?: unknown;
  url?: unknown;
  business?: unknown;
  budget?: unknown;
  timeline?: unknown;
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown; // honeypot
};

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success.
  if (str(body.company)) return NextResponse.json({ ok: true });

  const lead = {
    services: Array.isArray(body.services) ? body.services.filter((s): s is string => typeof s === "string").slice(0, 10) : [],
    url: str(body.url, 300),
    business: str(body.business, 200),
    budget: str(body.budget, 50),
    timeline: str(body.timeline, 50),
    name: str(body.name, 120),
    email: str(body.email, 200),
    message: str(body.message, 3000),
  };

  if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email) || lead.services.length === 0) {
    return NextResponse.json({ error: "Please add your name, a valid email and at least one service." }, { status: 422 });
  }

  // TODO(launch): forward to email (Resend) and CRM (HubSpot/Zoho) using env vars.
  console.info("[proposal] new lead", { ...lead, receivedAt: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
