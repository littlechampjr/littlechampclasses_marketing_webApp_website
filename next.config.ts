import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sponsor",
        destination: "/?bookDemo=1",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    /**
     * Next.js 16+ requires local `next/image` src values to match `localPatterns`.
     * Allow everything served from `public/` (root and subpaths). Omit `search` so
     * cache-busting query strings (e.g. `?v=2` on the logo) are allowed too.
     */
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
