"use client";

import { useEffect, useState } from "react";
import { trendingApi } from "@/features/trending/api/client";
import { truncateWithEllipsis } from "@/shared/utils/text";
import type { SidebarTopRatedCard } from "@/features/layout/hooks/useTopRatedCards";

/**
 * Right-sidebar "Trending" cards, rendered with the same `TopRatedCard` component
 * to avoid any design changes.
 */
export function useTrendingCards() {
  const [cards, setCards] = useState<SidebarTopRatedCard[]>([]);

  useEffect(() => {
    let active = true;
    let timerId: number | ReturnType<typeof setTimeout> | null = null;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const loadTrending = async () => {
      const response = await trendingApi.get({ period: "week", limit: 2 });
      if (!active || response.error || !response.data?.trendingNow?.length) return;

      const nextCards = response.data.trendingNow.slice(0, 2).map((item, index) => ({
        title: "Trending now",
        product: {
          name: truncateWithEllipsis(item.name, 26),
          score: `${item.averageScore.toFixed(1)}/10`,
          reviews: `${item.reviewCount} Reviews`,
          companies: "1",
          badge:
            index === 0
              ? { text: "Trending", color: "bg-primary" }
              : { text: "Hot", color: "bg-alert-orange" },
          description: truncateWithEllipsis(item.description || item.name, 92),
          bgColor: index === 0 ? "bg-dark-card" : "bg-card-purple-light-bg",
          textColor: index === 0 ? "text-white" : "text-text-dark",
          scoreColor: index === 0 ? "text-emerald" : "text-primary-light",
          separatorColor: index === 0 ? "bg-border-gray" : "bg-card-purple-light-border",
          hasVerify: index === 1,
        },
      }));

      setCards(nextCards);
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      timerId = idleWindow.requestIdleCallback(() => {
        void loadTrending();
      }, { timeout: 1500 });
    } else {
      timerId = globalThis.setTimeout(() => {
        void loadTrending();
      }, 500);
    }

    return () => {
      active = false;
      if (timerId != null) {
        if (typeof timerId === "number" && typeof idleWindow.cancelIdleCallback === "function") {
          idleWindow.cancelIdleCallback(timerId);
        } else {
          globalThis.clearTimeout(timerId);
        }
      }
    };
  }, []);

  return cards;
}

