import type { Comment, VoteResponse } from "@/lib/types";
import { fetchApi } from "@/lib/api/core";

export interface CommentsListPagination {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

export const commentsApi = {
  list: async (params: {
    reviewId?: string;
    postId?: string;
    complaintId?: string;
    parentId?: string;
    limit?: number;
    cursor?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.reviewId) query.set("reviewId", params.reviewId);
    if (params.postId) query.set("postId", params.postId);
    if (params.complaintId) query.set("complaintId", params.complaintId);
    if (params.parentId) query.set("parentId", params.parentId);
    if (typeof params.limit === "number") query.set("limit", String(params.limit));
    if (params.cursor) query.set("cursor", params.cursor);

    return fetchApi<{ comments: Comment[]; totalCount?: number; pagination?: CommentsListPagination }>(
      `/comments/list?${query.toString()}`
    );
  },

  create: async (data: { content: string; reviewId?: string; postId?: string; complaintId?: string; parentId?: string }) =>
    fetchApi<Comment>("/comments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  vote: async (id: string, voteType: "UP" | "DOWN") =>
    fetchApi<VoteResponse>(`/comments/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ voteType }),
    }),
};
