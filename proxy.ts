import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { applyAnonymousDocumentCache, applyPublicApiCache } from "@/lib/edgeCache";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  if (request.nextUrl.pathname.startsWith("/backend/api/")) {
    const response = NextResponse.next();
    return applyPublicApiCache(request, response);
  }

  const response = intlMiddleware(request);
  return applyAnonymousDocumentCache(request, response);
}

export default proxy;

export const config = {
  matcher: [
    "/",
    "/backend/api/:path*",
    {
      source: "/(de|en|nl)/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
