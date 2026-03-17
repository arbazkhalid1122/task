"use client";

import { useEffect, useState } from "react";
import { trendingApi } from "@/features/trending/api/client";
import { truncateWithEllipsis } from "@/shared/utils/text";
import type { SidebarTopRatedCard } from "@/features/layout/hooks/useTopRatedCards";

export function useRightSidebarCards() {
  const [cards, setCards] = useState<SidebarTopRatedCard[]>([]);

  useEffect(() => {
    let active = true;
    let timerId: number | ReturnType<typeof setTimeout> | null = null;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const load = async () => {
      const response = await trendingApi.get({ period: "week", limit: 3 });
      if (!active || response.error || !response.data) return;

      const { trendingNow, topRatedThisWeek } = response.data;
      const trending = trendingNow?.[0];
      const topRated = topRatedThisWeek?.[0];
      const newcomer = topRatedThisWeek?.[1] ?? trendingNow?.[1];

      const out: SidebarTopRatedCard[] = [];

      if (trending) {
        out.push({
          title: "Trending this week",
          product: {
            name: truncateWithEllipsis(trending.name, 26),
            score: `${trending.averageScore.toFixed(1)}/10`,
            reviews: `${trending.reviewCount} Reviews`,
            companies: "1",
            badge: { text: "Trending", color: "bg-primary" },
            description: truncateWithEllipsis(trending.description || trending.name, 92),
            bgColor: "bg-dark-card",
            textColor: "text-white",
            scoreColor: "text-emerald",
            separatorColor: "bg-border-gray",
            hasVerify: false,
          },
        });
      }

      if (topRated) {
        out.push({
          title: "Top rated this week",
          product: {
            name: truncateWithEllipsis(topRated.name, 26),
            score: `${topRated.averageScore.toFixed(1)}/10`,
            reviews: `${topRated.reviewCount} Reviews`,
            companies: "1",
            badge: { text: "Rising", color: "bg-accent-blue" },
            description: truncateWithEllipsis(topRated.description || topRated.name, 92),
            bgColor: "bg-dark-card",
            textColor: "text-white",
            scoreColor: "text-emerald",
            separatorColor: "bg-card-purple-light-border",
            hasVerify: true,
          },
        });
      }

      if (newcomer) {
        out.push({
          title: "Best newcomer",
          product: {
            name: truncateWithEllipsis(newcomer.name, 26),
            score: `${newcomer.averageScore.toFixed(1)}/10`,
            reviews: `${newcomer.reviewCount} Reviews`,
            companies: "1",
            badge: { text: "New", color: "bg-alert-orange-light" },
            description: truncateWithEllipsis(newcomer.description || newcomer.name, 92),
            bgColor: "bg-card-purple-light-bg",
            textColor: "text-text-dark",
            scoreColor: "text-primary-light",
            separatorColor: "bg-card-purple-light-border",
            hasVerify: false,
          },
        });
      }

      setCards(out.slice(0, 3));
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      timerId = idleWindow.requestIdleCallback(() => {
        void load();
      }, { timeout: 1500 });
    } else {
      timerId = globalThis.setTimeout(() => {
        void load();
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

