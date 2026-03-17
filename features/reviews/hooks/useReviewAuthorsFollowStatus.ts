"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useFollowStatusBulkQuery } from "@/features/users/hooks/useProfileQueries";
import type { Review } from "@/lib/types";

/**
 * Fetches follow status for all review authors in one bulk request.
 * Use with ReviewCard via skipFollowStatusFetch + isFollowingAuthor to avoid N API calls.
 */
export function useReviewAuthorsFollowStatus(reviews: Review[]) {
  const { user: currentUser } = useAuth();
  const authorUsernames = useMemo(
    () => [...new Set(reviews.map((r) => r.author?.username).filter(Boolean))] as string[],
    [reviews]
  );
  const { data } = useFollowStatusBulkQuery(
    authorUsernames,
    authorUsernames.length > 0,
    currentUser?.id ?? null
  );
  return data?.following ?? {};
}
