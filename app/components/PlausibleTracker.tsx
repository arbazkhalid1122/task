"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SCRIPT_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC ?? "https://plausible.io/js/script.js";

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string>; u?: string }) => void;
  }
}

export default function PlausibleTracker() {
  const hasSeenFirstRoute = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!PLAUSIBLE_DOMAIN) {
      if (process.env.NODE_ENV === "development") {
        console.warn("PlausibleTracker: NEXT_PUBLIC_PLAUSIBLE_DOMAIN is not set; tracker not initialized.");
      }
      return;
    }

    // The Plausible script tracks the initial page load. For SPA route transitions,
    // trigger additional pageview events after the first route has rendered.
    if (!hasSeenFirstRoute.current) {
      hasSeenFirstRoute.current = true;
      return;
    }

    const query = searchParams.toString();
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;
    window.plausible?.("pageview", { u: url });
  }, [pathname, searchParams]);

  if (!PLAUSIBLE_DOMAIN) return null;

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src={PLAUSIBLE_SCRIPT_SRC}
      strategy="afterInteractive"
    />
  );
}
