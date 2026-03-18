"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Footer from "@/features/layout/components/Footer";
import Header from "@/features/header/components/Header";
import RightSidebarLoading from "@/features/layout/components/RightSidebarLoading";
import { useAuth } from "@/lib/contexts/AuthContext";
import Skeleton from "@/shared/components/ui/Skeleton";

const LeftSidebar = dynamic(() => import("@/features/layout/components/LeftSidebar"), {
  loading: () => (
    <aside className="sidebar-left sidebar-border-right hidden lg:block lg:min-w-[250px]" aria-hidden />
  ),
});

const RightSidebar = dynamic(() => import("@/features/layout/components/RightSidebar"), {
  loading: () => (
    <aside className="sidebar-border-left hidden lg:block lg:min-w-[340px]" aria-hidden />
  ),
});

function LeftSidebarSkeleton() {
  return (
    <aside className="sidebar-left mt-16  sidebar-border-right" aria-hidden>
      <div className="space-y-1 text-xs font-semibold">
        <div className="h-14 rounded-md bg-primary px-3 py-2 text-white">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-3 w-24 bg-white/35" />
            <Skeleton className="h-3 w-3 rounded-sm bg-white/35" />
          </div>
          <Skeleton className="mt-2 h-3 w-40 bg-white/30" />
        </div>
      </div>
      <div className="rounded-md bg-alert-red px-3 py-2 pb-3 text-xs font-semibold text-white">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-3 w-28 bg-white/35" />
          <Skeleton className="h-3 w-3 rounded-sm bg-white/35" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-3 w-24 bg-white/30" />
          <Skeleton className="mt-2 h-3 w-20 bg-white/30" />
          <Skeleton className="mt-2 h-3 w-32 bg-white/25" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex h-10 items-center justify-between rounded-md border-border-lighter bg-bg-lightest px-3"
          >
            <Skeleton className={i % 2 === 0 ? "h-3 w-24" : "h-3 w-28"} />
            <Skeleton className="h-3 w-2 rounded-sm" />
          </div>
        ))}
      </div>
      <Skeleton className="mb-4 mt-4 h-px w-full rounded-none" />
      <div className="space-y-2">
        {Array.from({ length: 1 }).map((_, i) => (
          <div key={i} className="flex h-10 items-center justify-between rounded-md px-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-2 rounded-sm" />
          </div>
        ))}
      </div>
    </aside>
  );
}

function RightSidebarSkeleton() {
  return (
    <aside className="space-y-3 px-4 sm:px-0 lg:pl-5 sidebar-border-left" aria-hidden>
      <RightSidebarLoading />
    </aside>
  );
}

function ContentSkeleton() {
  return (
    <section className="content-section" aria-hidden>
      <div className="pt-8 sm:pt-12 lg:pt-16">
        <div className="card-base p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-0">
            <div className="flex gap-3">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div>
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-2 h-7 w-20" />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-2 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-4 sm:w-auto">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-10 w-full rounded-full sm:w-[162px]" />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[92%]" />
            <Skeleton className="h-3 w-[78%]" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-primary-bg px-4 py-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-3 w-full max-w-[280px]" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="mt-3 card-light p-4">
            <div className="flex h-auto flex-col items-start gap-2 border-b border-border-light px-3 py-2 sm:h-10 sm:flex-row sm:items-center sm:gap-0 sm:py-0">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4" />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="mt-3 h-6 w-2/3" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[96%]" />
              <Skeleton className="h-3 w-[88%]" />
              <Skeleton className="h-3 w-[82%]" />
            </div>
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <article key={i} className="card" aria-hidden>
            <div className="card-inner">
              <div className="flex w-12 flex-col items-center gap-2 self-stretch pt-1">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="card-body">
                <div className="card-meta">
                  <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
                  <div className="card-meta-text flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-2 rounded-full" />
                      <Skeleton className={i % 2 === 0 ? "h-3 w-28" : "h-3 w-32"} />
                    </div>
                  </div>
                </div>
                <div className="my-4 h-px w-full bg-[#E5E5E5]" />
                <Skeleton className={i % 2 === 0 ? "h-5 w-3/5" : "h-5 w-2/3"} />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-[95%]" />
                  <Skeleton className="h-3 w-[82%]" />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-2 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-2 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-sm" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AppShellClient({
  children,
  contentClassName,
}: {
  children: ReactNode;
  contentClassName?: string;
}) {
  const { isAuthLoading } = useAuth();
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-bg-white text-foreground">
      <Header />
      <div className="page-container">
        <div className="page-main-wrap">
          <main className="main-grid">
            <AnimatePresence mode="wait" initial={false}>
              {isAuthLoading ? (
                <motion.div
                  key="shell-skeleton"
                  className="contents"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
                >
                  <LeftSidebarSkeleton />
                  <ContentSkeleton />
                  <RightSidebarSkeleton />
                </motion.div>
              ) : (
                <motion.div
                  key="shell-content"
                  className="contents"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
                >
                  <LeftSidebar />
                  <section className={contentClassName ?? "content-section"}>{children}</section>
                  <RightSidebar />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

