"use client";

import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getTrendingOverviewQueryOptions } from "@/features/trending/hooks/useTrendingOverviewQuery";
import { usePathname, useRouter } from "@/i18n/routing";

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

type NetworkInfo = {
  saveData?: boolean;
  effectiveType?: string;
};

const WARM_ROUTES = ["/", "/complaints", "/notifications", "/privacy"] as const;

function normalizeRoute(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export default function RouteWarmup() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = normalizeRoute(usePathname() || "/");

  const prefetchRoute = useCallback(
    (route: string) => {
      router.prefetch(route);
    },
    [router]
  );

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const shouldSkipWarmup =
      connection?.saveData === true ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    if (shouldSkipWarmup) return;

    const routes = WARM_ROUTES.filter((route) => normalizeRoute(route) !== pathname);
    let cancelled = false;
    const timeoutIds: number[] = [];

    const warmup = () => {
      void queryClient.prefetchQuery(getTrendingOverviewQueryOptions());

      routes.forEach((route, index) => {
        const timeoutId = window.setTimeout(() => {
          if (!cancelled) {
            prefetchRoute(route);
          }
        }, index < 2 ? index * 70 : 140 + (index - 2) * 110);

        timeoutIds.push(timeoutId);
      });
    };

    const idleWindow = window as IdleWindow;
    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(warmup, { timeout: 1400 });
      return () => {
        cancelled = true;
        timeoutIds.forEach((id) => window.clearTimeout(id));
        if (typeof idleWindow.cancelIdleCallback === "function") {
          idleWindow.cancelIdleCallback(idleId);
        }
      };
    }

    const fallbackId = window.setTimeout(warmup, 700);
    return () => {
      cancelled = true;
      window.clearTimeout(fallbackId);
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [pathname, prefetchRoute, queryClient]);

  useEffect(() => {
    const handleWarmIntent = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      const href = link?.getAttribute("href");

      if (!href || !isInternalHref(href) || href.startsWith("#")) return;

      prefetchRoute(href);
    };

    document.addEventListener("pointerenter", handleWarmIntent, true);
    document.addEventListener("focusin", handleWarmIntent, true);

    return () => {
      document.removeEventListener("pointerenter", handleWarmIntent, true);
      document.removeEventListener("focusin", handleWarmIntent, true);
    };
  }, [prefetchRoute]);

  return null;
}
