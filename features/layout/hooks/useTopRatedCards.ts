"use client";

import { useTrendingOverviewQuery } from "@/features/trending/hooks/useTrendingOverviewQuery";
import { truncateWithEllipsis } from "@/shared/utils/text";

export interface SidebarTopRatedCard {
  title: string;
  product: {
    name: string;
    score: string;
    reviews: string;
    companies: string;
    badge: { text: string; color: string };
    description: string;
    bgColor: string;
    textColor: string;
    scoreColor: string;
    separatorColor: string;
    hasVerify?: boolean;
  };
}

export function useTopRatedCards() {
  const { data } = useTrendingOverviewQuery();
  const source =
    data?.topRatedThisWeek?.length
      ? data.topRatedThisWeek
      : data?.trendingNow?.length
        ? data.trendingNow
        : [];

  return source.slice(0, 2).map((item, index) => ({
    title: "Top rated this week",
    product: {
      name: truncateWithEllipsis(item.name, 26),
      score: `${item.averageScore.toFixed(1)}/10`,
      reviews: `${item.reviewCount} Reviews`,
      companies: "1",
      badge:
        index === 0
          ? { text: "Rising", color: "bg-accent-blue" }
          : { text: "New", color: "bg-alert-orange-light" },
      description: truncateWithEllipsis(item.description || item.name, 92),
      bgColor: index === 0 ? "bg-dark-card" : "bg-card-purple-light-bg",
      textColor: index === 0 ? "text-white" : "text-text-dark",
      scoreColor: index === 0 ? "text-emerald" : "text-primary-light",
      separatorColor: index === 0 ? "bg-border-gray" : "bg-card-purple-light-border",
      hasVerify: index === 1,
    },
  }));
}
