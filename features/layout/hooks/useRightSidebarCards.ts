"use client";

import { useTrendingOverviewQuery } from "@/features/trending/hooks/useTrendingOverviewQuery";
import { truncateWithEllipsis } from "@/shared/utils/text";
import type { SidebarTopRatedCard } from "@/features/layout/hooks/useTopRatedCards";

export function useRightSidebarCards() {
  const trendingQuery = useTrendingOverviewQuery();
  const { trendingNow, topRatedThisWeek } = trendingQuery.data ?? {};
  const trending = trendingNow?.[0];
  const topRated = topRatedThisWeek?.[0];
  const newcomer = topRatedThisWeek?.[1] ?? trendingNow?.[1];
  const cards: SidebarTopRatedCard[] = [];

  if (trending) {
    cards.push({
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
    cards.push({
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
    cards.push({
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

  return {
    cards: cards.slice(0, 3),
    loading: trendingQuery.isLoading && !trendingQuery.data,
  };
}
