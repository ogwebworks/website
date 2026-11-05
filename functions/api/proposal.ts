/**
 * Cloudflare Pages Function: POST /api/proposal
 * Free on the Cloudflare Pages plan (100k requests/day).
 */
type Payload = Record<string, unknown>;

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export const onRequestPost = async ({ request }: { request: Request }) => {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Bots fill the hidden field; pretend success.
  if (str(body.company)) return json({ ok: true });

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
    return json({ error: "Please add your name, a valid email and at least one service." }, 422);
  }

  // TODO(launch): forward to email (Resend) and CRM using Pages environment variables.
  console.log("[proposal] new lead", JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }));

  return json({ ok: true });
};
