"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import CompanyProfileSection from "@/features/reviews/components/CompanyProfileSection";
import ReviewCard from "@/features/reviews/components/ReviewCard";
import { useReviewsFeed } from "@/features/reviews/hooks/useReviewsFeed";
import { useReviewAuthorsFollowStatus } from "@/features/reviews/hooks/useReviewAuthorsFollowStatus";
import { FeedEmpty, FeedEnd, FeedLoading, FeedLoadMore } from "@/shared/components/feed";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import type { Review } from "@/lib/types";

interface HomeReviewsSectionProps {
  initialReviews: Review[];
}

export default function HomeReviewsSection({ initialReviews }: HomeReviewsSectionProps) {
  const t = useTranslations("feed");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { reviews, setReviews, loading, loadingMore, hasMore, loadMore, fetchReviews, updateReviewVote } =
    useReviewsFeed(initialReviews);
  const followStatusByUsername = useReviewAuthorsFollowStatus(reviews);

  useInfiniteScroll(sentinelRef, { hasMore, loading, loadingMore, loadMore });

  return (
    <>
      <CompanyProfileSection
        onReviewSubmitted={(newReview) => {
          if (newReview && typeof newReview === "object" && "id" in newReview) {
            const typedReview = newReview as Review;
            setReviews((prevReviews) =>
              prevReviews.some((review) => review.id === typedReview.id) ? prevReviews : [typedReview, ...prevReviews],
            );
            return;
          }
          void fetchReviews();
        }}
      />

      {loading ? (
        <FeedLoading />
      ) : reviews.length > 0 ? (
        <>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onVoteUpdate={updateReviewVote}
              skipFollowStatusFetch
              isFollowingAuthor={
                review.author?.username !== undefined
                  ? followStatusByUsername[review.author.username]
                  : false
              }
            />
          ))}
          <div ref={sentinelRef} className="min-h-4" aria-hidden />
          {loadingMore && <FeedLoadMore />}
          {!hasMore && <FeedEnd />}
        </>
      ) : (
        <FeedEmpty message={t("emptyReviews")} />
      )}
    </>
  );
}
