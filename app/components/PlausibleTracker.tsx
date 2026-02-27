"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function PlausibleTracker() {
  const initialized = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initialized.current) return;
    if (!PLAUSIBLE_DOMAIN) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("PlausibleTracker: NEXT_PUBLIC_PLAUSIBLE_DOMAIN is not set; tracker not initialized.");
      }
      return;
    }

    void import("@plausible-analytics/tracker").then(({ init }) => {
      init({
        domain: PLAUSIBLE_DOMAIN,
        hashBasedRouting: false,
      });
      initialized.current = true;
    });
  }, []);

  // Re-run effect on route changes so Plausible can auto-capture SPA pageviews.
  useEffect(() => {
    if (!initialized.current) return;
    // No manual track call needed: the Plausible tracker auto-captures pageviews in SPAs.
  }, [pathname, searchParams]);

  return null;
}

