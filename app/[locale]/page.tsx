"use client";

import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import CompanyProfile from "../components/CompanyProfile";
import ReviewCard from "../components/ReviewCard";
import RightSidebar from "../components/RightSidebar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { authApi } from "../../lib/api";
import { useReviewsFeed } from "../../lib/hooks/useReviewsFeed";
import { useToast } from "../contexts/ToastContext";
import type { Review } from "../../lib/types";

function isAuthFailureMessage(message: string): boolean {
  return /unauthorized|authentication required/i.test(message);
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { reviews, setReviews, loading, fetchReviews, updateReviewVote } = useReviewsFeed();
  const { showToast } = useToast();

  useEffect(() => {
    authApi.me().then((response) => {
      setIsLoggedIn(!!response.data?.user);
      if (response.error && !isAuthFailureMessage(response.error)) {
        showToast(response.error, "error");
      }
    });
  }, [showToast]);

  return (
    <div className="bg-bg-white text-foreground">
      <Header isLoggedIn={isLoggedIn} />
      <div className="page-container">
        <div className="page-main-wrap">
          <main className="main-grid">
            <LeftSidebar />

            <section className="content-section">
              <CompanyProfile
                onReviewSubmitted={(newReview) => {
                  if (newReview && typeof newReview === "object" && "id" in newReview) {
                    const typedReview = newReview as Review;
                    setReviews((prevReviews) =>
                      prevReviews.some((review) => review.id === typedReview.id)
                        ? prevReviews
                        : [typedReview, ...prevReviews]
                    );
                    return;
                  }
                  void fetchReviews();
                }}
              />

              {loading ? (
                <div className="text-center py-8 text-text-primary">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ReviewCard 
                    key={review.id || index} 
                    review={review} 
                    index={index}
                    onVoteUpdate={updateReviewVote}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-text-primary">No reviews yet. Be the first to review!</div>
              )}
            </section>

            <RightSidebar isLoggedIn={isLoggedIn} />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}



