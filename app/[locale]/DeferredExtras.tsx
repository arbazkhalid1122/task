"use client";

import dynamic from "next/dynamic";

const CookieConsent = dynamic(
  () => import("@/shared/components/feedback/CookieConsent"),
  { ssr: false }
);

const AnalyticsTracker = dynamic(
  () => import("@/shared/components/analytics/AnalyticsTracker"),
  { ssr: false }
);

interface DeferredExtrasProps {
  initialAnalyticsConsent: boolean | null;
}

export default function DeferredExtras({ initialAnalyticsConsent }: DeferredExtrasProps) {
  return (
    <>
      <CookieConsent initialConsent={initialAnalyticsConsent} />
      <AnalyticsTracker />
    </>
  );
}
