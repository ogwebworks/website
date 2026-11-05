import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static build (./out) so the site can be hosted free on Cloudflare Pages.
  // The proposal form is handled by a Cloudflare Pages Function in /functions.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
