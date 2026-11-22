// @next/mdx is CommonJS (`export =`) with no named exports.
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Proxy PostHog through our own origin so ad blockers / tracking protection
// don't drop requests to *.posthog.com.
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const posthogAssetsHost = posthogHost.replace(
  /^https:\/\/(\w+)\.i\.posthog\.com/,
  "https://$1-assets.i.posthog.com",
);

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    agentUpgrade: "security",
  },
  // PostHog API paths rely on trailing slashes (e.g. /e/, /flags/).
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${posthogAssetsHost}/static/:path*`,
      },
      {
        source: "/ingest/array/:path*",
        destination: `${posthogAssetsHost}/array/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `${posthogHost}/:path*`,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
