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

export function validatePublicRuntimeUrls(): void {
  assertSecurePublicUrl("NEXT_PUBLIC_API_URL");
  assertSecurePublicUrl("NEXT_PUBLIC_SOCKET_URL");
}

export function buildCsp(): string {
  const origins = [
    toOrigin(process.env.NEXT_PUBLIC_APP_URL),
    toOrigin(process.env.NEXT_PUBLIC_API_URL),
    toOrigin(process.env.NEXT_PUBLIC_SOCKET_URL),
  ].filter((value): value is string => Boolean(value));

  const connectSources = new Set(["'self'", ...origins, ...origins.map(toSocketOrigin)]);
  const scriptSources = ["'self'"];
  const styleSources = ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"];

  if (isDevelopment) {
    scriptSources.push("'unsafe-inline'", "'unsafe-eval'");
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    `style-src ${styleSources.join(" ")}`,
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
