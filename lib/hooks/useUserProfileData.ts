"use client";

import { useCallback, useEffect, useState } from "react";
import { authApi, complaintsApi, reviewsApi } from "@/lib/api";
import type { Complaint, Review, UserProfile } from "@/lib/types";

export function useUserProfileData(username: string) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!username) return;

    setLoading(true);
    try {
      const reviewsResponse = await reviewsApi.list({ limit: 50 });
      const complaintsResponse = await complaintsApi.list({ username, limit: 50 });

      const allReviews = reviewsResponse.data?.reviews ?? [];
      const userReviews = allReviews.filter((review) => review.author?.username === username);
      const userComplaints = complaintsResponse.data?.complaints ?? [];

      setReviews(userReviews);
      setComplaints(userComplaints);

      const nextUser = userReviews[0]?.author ?? userComplaints[0]?.author ?? null;
      setUser(nextUser ?? null);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    void authApi.me().then((response) => {
      setIsLoggedIn(Boolean(response.data?.user));
    });
  }, []);

  useEffect(() => {
    void fetchUserProfile();
  }, [fetchUserProfile]);

  const updateReviewVote = (reviewId: string, helpfulCount: number, downVoteCount: number) => {
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
  };

  const updateComplaintVote = (complaintId: string, helpfulCount: number, downVoteCount: number) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, helpfulCount, downVoteCount }
          : complaint
      )
    );
  };

  return {
    isLoggedIn,
    user,
    reviews,
    complaints,
    loading,
    fetchUserProfile,
    updateReviewVote,
    updateComplaintVote,
  };
}
