import path from "node:path";
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

function toOrigin(value?: string): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function toSocketOrigin(origin: string): string {
  if (origin.startsWith("https://")) {
    return `wss://${origin.slice("https://".length)}`;
  }
  if (origin.startsWith("http://")) {
    return `ws://${origin.slice("http://".length)}`;
  }
  return origin;
}

function isLocalHostUrl(value: string): boolean {
  try {
    const { hostname } = new URL(value);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function assertSecurePublicUrl(varName: "NEXT_PUBLIC_API_URL" | "NEXT_PUBLIC_SOCKET_URL"): void {
  const value = process.env[varName];
  if (!value) return;

  const isHttp = value.startsWith("http://");
  const isWs = value.startsWith("ws://");
  if (!isHttp && !isWs) return;

  if (isLocalHostUrl(value)) return;

  if (!isDevelopment) {
    throw new Error(`${varName} must use https:// or wss:// in production. Received: ${value}`);
  }
}

function validatePublicRuntimeUrls(): void {
  assertSecurePublicUrl("NEXT_PUBLIC_API_URL");
  assertSecurePublicUrl("NEXT_PUBLIC_SOCKET_URL");
}

function buildCsp() {
  const origins = [
    toOrigin(process.env.NEXT_PUBLIC_APP_URL),
    toOrigin(process.env.NEXT_PUBLIC_API_URL),
    toOrigin(process.env.NEXT_PUBLIC_SOCKET_URL),
  ].filter((value): value is string => Boolean(value));
  const connectSources = new Set(["'self'", ...origins, ...origins.map(toSocketOrigin)]);
  const scriptSources = ["'self'"];
  if (isDevelopment) {
    // Next.js dev tooling relies on eval/inline scripts; keep this only in development.
    scriptSources.push("'unsafe-inline'");
    scriptSources.push("'unsafe-eval'");
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    `connect-src ${Array.from(connectSources).join(" ")}`,
    "worker-src 'self' blob:",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "manifest-src 'self'",
  ];

  if (!isDevelopment) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

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
    const csp = buildCsp();
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
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
