import { NextResponse, type NextRequest } from "next/server";
import { hasLikelyAuthCookie } from "@/lib/authCookies";

const STATIC_ASSET_PATHS = [
  "/_next/",
  "/api/",
  "/monitoring",
  "/favicon.ico",
  "/sw.js",
  "/robots.txt",
  "/sitemap.xml",
];
const STATIC_ASSET_EXTENSION = /\.[a-z0-9]+$/i;

export const PUBLIC_DOCUMENT_CACHE_CONTROL =
  "public, max-age=0, s-maxage=180, stale-while-revalidate=900";
export const PUBLIC_API_CACHE_CONTROL =
  "public, max-age=0, s-maxage=120, stale-while-revalidate=600";

const PUBLIC_CACHEABLE_API_PREFIXES = [
  "/backend/api/reviews",
  "/backend/api/complaints",
  "/backend/api/users/",
];

function appendHeaderValue(headers: Headers, key: string, value: string): void {
  const existing = headers.get(key);
  if (!existing) {
    headers.set(key, value);
    return;
  }

  const values = new Set(
    existing
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  );
  values.add(value);
  headers.set(key, Array.from(values).join(", "));
}

function isStaticAssetPath(pathname: string): boolean {
  return STATIC_ASSET_PATHS.some((prefix) => pathname.startsWith(prefix)) || STATIC_ASSET_EXTENSION.test(pathname);
}

function isDocumentRequest(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  const destination = request.headers.get("sec-fetch-dest") ?? "";
  return accept.includes("text/html") || destination === "document";
}

function isPrefetchRequest(request: NextRequest): boolean {
  return request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch";
}

export function applyAnonymousDocumentCache(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  if (!["GET", "HEAD"].includes(request.method)) return response;
  if (!isDocumentRequest(request) || isPrefetchRequest(request)) return response;
  if (isStaticAssetPath(request.nextUrl.pathname)) return response;

  appendHeaderValue(response.headers, "Vary", "Accept-Encoding");
  appendHeaderValue(response.headers, "Vary", "Authorization");
  appendHeaderValue(response.headers, "Vary", "Cookie");

  if (hasLikelyAuthCookie(request.headers.get("cookie") ?? "")) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  }

  response.headers.set("Cache-Control", PUBLIC_DOCUMENT_CACHE_CONTROL);
  return response;
}

function isPublicCacheableApiPath(pathname: string): boolean {
  return PUBLIC_CACHEABLE_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function applyPublicApiCache(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  if (!request.nextUrl.pathname.startsWith("/backend/api/")) return response;
  if (!["GET", "HEAD"].includes(request.method)) return response;
  if (!isPublicCacheableApiPath(request.nextUrl.pathname)) return response;

  appendHeaderValue(response.headers, "Vary", "Accept-Encoding");
  appendHeaderValue(response.headers, "Vary", "Authorization");
  appendHeaderValue(response.headers, "Vary", "Cookie");

  if (hasLikelyAuthCookie(request.headers.get("cookie") ?? "")) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  }

  response.headers.set("Cache-Control", PUBLIC_API_CACHE_CONTROL);
  return response;
}
