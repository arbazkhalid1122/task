"use client";

import { useQuery } from "@tanstack/react-query";
import { trendingApi, type TrendingResponse } from "@/features/trending/api/client";
import { queryKeys } from "@/lib/queryKeys";

export const TRENDING_OVERVIEW_LIMIT = 3;
export const TRENDING_OVERVIEW_STALE_TIME = 5 * 60 * 1000;

export function getTrendingOverviewQueryOptions() {
  return {
    queryKey: queryKeys.trendingOverview("week"),
    queryFn: async (): Promise<TrendingResponse> => {
      const response = await trendingApi.get({
        period: "week",
        limit: TRENDING_OVERVIEW_LIMIT,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("Trending data not found");
      }

      return response.data;
    },
    staleTime: TRENDING_OVERVIEW_STALE_TIME,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  } as const;
}

export function useTrendingOverviewQuery() {
  return useQuery(getTrendingOverviewQueryOptions());
}
