/**
 * Backend API URL helpers.
 * - Server-side code should prefer API_INTERNAL_URL and only fall back to NEXT_PUBLIC_API_URL.
 * - Client-side code must use NEXT_PUBLIC_API_URL.
 */

function isProduction(): boolean {
  return typeof process !== "undefined" && process.env.NODE_ENV === "production";
}

function normalizeUrl(value?: string): string {
  return typeof value === "string" ? value.replace(/\/$/, "") : "";
}

function isLocalHostUrl(value: string): boolean {
  try {
    const { hostname } = new URL(value);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function assertPublicUrlIsSecure(name: string, value: string): void {
  if (!isProduction() || !value) return;
  if (value.startsWith("https://")) return;
  if (isLocalHostUrl(value) && value.startsWith("http://")) return;
  throw new Error(`${name} must use https:// in production. Received: ${value}`);
}

function shouldUseDevApiProxy(url: string): boolean {
  if (typeof window === "undefined" || !url || process.env.NODE_ENV === "production") {
    return false;
  }

  try {
    return new URL(url).origin !== window.location.origin;
  } catch {
    return false;
  }
}

/** For server-side code (e.g. auth.ts). In production, throws if no URL is set. */
export function getBackendUrl(): string {
  const internal =
    typeof process !== "undefined" ? process.env.API_INTERNAL_URL : undefined;
  const publicUrl =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : undefined;
  const trimmed = normalizeUrl(internal) || normalizeUrl(publicUrl);
  if (isProduction() && !trimmed) {
    throw new Error(
      "API_INTERNAL_URL or NEXT_PUBLIC_API_URL must be set in production."
    );
  }
  return trimmed;
}

/** For client-side API calls. Set NEXT_PUBLIC_API_URL in .env for dev. */
export function getApiBaseUrl(): string {
  if (typeof process === "undefined") return "";
  const url = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
  assertPublicUrlIsSecure("NEXT_PUBLIC_API_URL", url);
  if (shouldUseDevApiProxy(url)) {
    return "/backend";
  }
  return url;
}

export function getPublicAppUrl(): string {
  if (typeof process === "undefined") return "";
  const url = normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);
  assertPublicUrlIsSecure("NEXT_PUBLIC_APP_URL", url);
  return url;
}
