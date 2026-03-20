import path from "node:path";
import type { NextConfig } from "next";
import { validatePublicRuntimeUrls } from "@/lib/securityHeaders";

validatePublicRuntimeUrls();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Next 16 uses top-level `turbopack`, not `experimental.turbo`.
  turbopack: {
    // Force Turbopack's workspace root to this app directory
    root: __dirname,
    resolveAlias: {
      "next-intl/config": "./i18n/request.ts",
    },
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "next-intl/config": path.resolve(process.cwd(), "./i18n/request.ts"),
    };
    return config;
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!apiBase) {
      return [];
    }

    return [
      {
        source: "/backend/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Origin-Agent-Cluster", value: "?1" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
