"use client";

import { useTrendingOverviewQuery } from "@/features/trending/hooks/useTrendingOverviewQuery";
import { truncateWithEllipsis } from "@/shared/utils/text";

/**
 * Right-sidebar "Trending" cards, rendered with the same `TopRatedCard` component
 * to avoid any design changes.
 */
export function useTrendingCards() {
  const { data } = useTrendingOverviewQuery();

  return (data?.trendingNow ?? []).slice(0, 2).map((item, index) => ({
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
}
