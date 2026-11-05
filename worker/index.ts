/**
 * Cloudflare Worker entry (free Workers plan, commercial use allowed).
 * - /api/proposal -> form handler
 * - everything else -> static Next.js export in ./out (served by the ASSETS binding)
 */
import { handleProposal } from "./proposal";

type Env = { ASSETS: { fetch: (req: Request) => Promise<Response> } };

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/proposal") {
      if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
      return handleProposal(request);
    }
    return env.ASSETS.fetch(request);
  },
};

export default worker;
