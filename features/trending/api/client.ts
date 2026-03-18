import { fetchApi } from "@/lib/api/core";

export interface TrendingItem {
  id: string;
  name: string;
  description: string;
  likes: number;
  averageScore: number;
  reviewCount: number;
}

export interface TrendingResponse {
  trendingNow: TrendingItem[];
  topRatedThisWeek: TrendingItem[];
}

export const trendingApi = {
  get: async (params?: { period?: "week" | "month"; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.period) query.set("period", params.period);
    if (params?.limit) query.set("limit", params.limit.toString());

    return fetchApi<TrendingResponse>(`/trending?${query.toString()}`);
  },
};
