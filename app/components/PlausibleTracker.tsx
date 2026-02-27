"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const PLAUSIBLE_SCRIPT_SRC =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC ?? "https://plausible.io/js/pa-EAVyHTsweqBrpuInh7zNJ.js";

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

  return (
    <>
      <Script async src={PLAUSIBLE_SCRIPT_SRC} strategy="afterInteractive" />
      <Script
        id="plausible-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();",
        }}
      />
    </>
  );
}
