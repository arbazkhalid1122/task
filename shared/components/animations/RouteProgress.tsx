"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/routing";

type Phase = "idle" | "starting" | "finishing";

export default function RouteProgress() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const navigatingRef = useRef(false);
  const stepTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const routeCommitTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [width, setWidth] = useState(0);

  const clearTimers = useCallback(() => {
    if (stepTimerRef.current !== null) {
      window.clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    if (routeCommitTimerRef.current !== null) {
      window.clearTimeout(routeCommitTimerRef.current);
      routeCommitTimerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimers();
    navigatingRef.current = true;
    setPhase("starting");
    setWidth(8);
    stepTimerRef.current = window.setTimeout(() => setWidth(32), 90);
    finishTimerRef.current = window.setTimeout(() => setWidth(88), 260);
  }, [clearTimers]);

  const finish = useCallback(() => {
    clearTimers();
    setPhase("finishing");
    setWidth(100);
    finishTimerRef.current = window.setTimeout(() => {
      setPhase("idle");
      setWidth(0);
      navigatingRef.current = false;
      finishTimerRef.current = null;
    }, 180);
  }, [clearTimers]);

  // Start progress immediately on internal link clicks (feels much smoother).
  useEffect(() => {
    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) return;

      // If navigating to a different internal route, kick off progress.
      if (href !== pathname && !navigatingRef.current) {
        start();
      }
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [pathname, start]);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;
    if (prev === null || prev === pathname) return;

    // Route committed → finish the bar quickly.
    if (navigatingRef.current) {
      routeCommitTimerRef.current = window.setTimeout(() => finish(), 0);
    } else {
      // Back/forward or programmatic nav
      routeCommitTimerRef.current = window.setTimeout(() => {
        start();
        finishTimerRef.current = window.setTimeout(() => finish(), 180);
      }, 0);
    }
  }, [finish, pathname, start]);

  useEffect(() => clearTimers, [clearTimers]);

  const visible = phase !== "idle";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 150ms ease-out",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "var(--color-primary, #2563eb)",
          boxShadow: "0 0 12px rgba(37, 99, 235, 0.35)",
          transition:
            phase === "finishing"
              ? "width 160ms cubic-bezier(0.22, 1, 0.36, 1)"
              : "width 220ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "width",
        }}
      />
    </div>
  );
}
