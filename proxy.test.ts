import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

describe("proxy cache headers", () => {
  it("marks anonymous document requests as CDN-cacheable", () => {
    const request = new NextRequest("http://localhost:3000/en", {
      headers: {
        accept: "text/html",
      },
    });

    const response = proxy(request as never);

    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=0, s-maxage=180, stale-while-revalidate=900",
    );
    expect(response.headers.get("Vary")).toContain("Cookie");
  });

  it("keeps authenticated document requests private", () => {
    const request = new NextRequest("http://localhost:3000/en", {
      headers: {
        accept: "text/html",
        cookie: "next-auth.session-token=secret",
      },
    });

    const response = proxy(request as never);

    expect(response.headers.get("Cache-Control")).toBe("private, no-store, max-age=0");
  });

  it("does not apply document caching to static assets", () => {
    const request = new NextRequest("http://localhost:3000/_next/static/chunk.js");
    const response = proxy(request as never);

    expect(response.headers.get("Cache-Control")).toBeNull();
  });
});
