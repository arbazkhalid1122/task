"use client";

import { useCallback, useEffect, useState } from "react";
import { reviewsApi } from "@/lib/api";
import { useSocket } from "@/lib/socket";
import { useToast } from "@/app/contexts/ToastContext";
import type { Review } from "@/lib/types";

interface VoteUpdatePayload {
  reviewId: string;
  helpfulCount: number;
  downVoteCount?: number;
}

export function useReviewsFeed(initialReviews?: Review[]) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews ?? []);
  const [loading, setLoading] = useState(initialReviews == null);
  const { socket } = useSocket();
  const { showToast } = useToast();

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await reviewsApi.list({ status: "APPROVED", limit: 20 });
      if (response.data?.reviews) {
        setReviews(response.data.reviews);
      } else if (response.error) {
        showToast(response.error, "error");
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const updateReviewVote = useCallback((reviewId: string, helpfulCount: number, downVoteCount: number) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpfulCount,
              downVoteCount,
              _count: {
                ...review._count,
                helpfulVotes: helpfulCount,
              },
            }
          : review
      )
    );
  }, []);

  useEffect(() => {
    if (initialReviews == null) {
      void fetchReviews();
    }
  }, [fetchReviews, initialReviews]);

  useEffect(() => {
    if (!socket) return;

    const handleReviewCreated = (newReview: Review) => {
      if (!newReview || !newReview.id) return;

      setReviews((prevReviews) => {
        if (prevReviews.some((review) => review.id === newReview.id)) return prevReviews;
        return [newReview, ...prevReviews];
      });
    };

    const handleVoteUpdated = (data: VoteUpdatePayload) => {
      if (!data?.reviewId) return;
      updateReviewVote(data.reviewId, data.helpfulCount, data.downVoteCount ?? 0);
    };

    const handleReviewUpdated = (updatedReview: Review) => {
      if (!updatedReview?.id) return;

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === updatedReview.id ? { ...review, ...updatedReview } : review
        )
      );
    };

    socket.on("review:created", handleReviewCreated);
    socket.on("review:vote:updated", handleVoteUpdated);
    socket.on("review:updated", handleReviewUpdated);

    return () => {
      socket.off("review:created", handleReviewCreated);
      socket.off("review:vote:updated", handleVoteUpdated);
      socket.off("review:updated", handleReviewUpdated);
    };
  }, [socket, updateReviewVote]);

  return {
    reviews,
    setReviews,
    loading,
    fetchReviews,
    updateReviewVote,
  };
}
