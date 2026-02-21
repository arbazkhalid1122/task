"use client";

import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import CompanyProfile from "../components/CompanyProfile";
import ReviewCard from "../components/ReviewCard";
import RightSidebar from "../components/RightSidebar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { authApi, reviewsApi } from "../../lib/api";
import { useSocket } from "../../lib/socket";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const fetchReviews = async () => {
    setLoading(true);
    const response = await reviewsApi.list({ status: 'APPROVED', limit: 20 });
    if (response.data?.reviews) {
      setReviews(response.data.reviews);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check if user is logged in by checking session
    authApi.me().then((response) => {
      setIsLoggedIn(!!response.data?.user);
    });

    // Fetch reviews from backend
    fetchReviews();
  }, []);

  // Socket.IO real-time updates - set up listeners that persist across reconnects
  useEffect(() => {
    if (!socket) {
      console.log('⏳ Socket not available yet, will retry when socket is ready');
      return;
    }

    console.log('🔌 Setting up socket listeners, socket ID:', socket.id, 'connected:', socket.connected);

    // Listen for new reviews - set up immediately, even if not connected yet
    const handleReviewCreated = (newReview: any) => {
      console.log('✅ New review received via socket:', newReview?.id, newReview?.title);
      if (!newReview || !newReview.id) {
        console.warn('⚠️ Invalid review data received:', newReview);
        return;
      }
      setReviews((prevReviews) => {
        // Check if review already exists (avoid duplicates)
        if (prevReviews.some((r) => r.id === newReview.id)) {
          console.log('⚠️ Review already exists, skipping');
          return prevReviews;
        }
        console.log('✅ Adding new review to list - total reviews:', prevReviews.length + 1);
        // Add new review at the beginning
        return [newReview, ...prevReviews];
      });
    };

    // Listen for vote updates
    const handleVoteUpdated = (data: { reviewId: string; helpfulCount: number }) => {
      console.log('✅ Vote updated via socket:', data);
      if (!data || !data.reviewId) {
        console.warn('⚠️ Invalid vote data received:', data);
        return;
      }
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === data.reviewId
            ? {
                ...review,
                _count: {
                  ...review._count,
                  helpfulVotes: data.helpfulCount,
                },
              }
            : review
        )
      );
    };

    // Listen for review updates (if score/content/title changes)
    const handleReviewUpdated = (updatedReview: any) => {
      console.log('✅ Review updated via socket:', updatedReview?.id);
      if (!updatedReview || !updatedReview.id) {
        console.warn('⚠️ Invalid review update data received:', updatedReview);
        return;
      }
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === updatedReview.id ? { ...review, ...updatedReview } : review
        )
      );
    };

    // Set up event listeners - these will persist across reconnects
    socket.on('review:created', handleReviewCreated);
    socket.on('review:vote:updated', handleVoteUpdated);
    socket.on('review:updated', handleReviewUpdated);

    // When socket connects or reconnects, ensure we're in the reviews room
    const handleConnect = () => {
      console.log('✅ Socket connected/reconnected, ensuring room membership...');
      // Ensure we're in the reviews room (server auto-joins, but we verify)
      socket.emit('join:reviews', (response: any) => {
        console.log('✅ Join reviews room response:', response);
      });
      // Test connection with ping
      socket.emit('ping', (response: string) => {
        console.log('✅ Ping response:', response);
      });
      // On reconnect, optionally resync to catch any missed events
      // (commented out to avoid unnecessary API calls - socket events should be sufficient)
      // fetchReviews();
    };

    // Set up connection handler - use 'on' instead of 'once' so it runs on every reconnect
    socket.on('connect', handleConnect);

    // If already connected, set up immediately
    if (socket.connected) {
      handleConnect();
    }

    // Keepalive: periodically ping the server to keep connection alive
    const keepAliveInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping', (response: string) => {
          console.log('💓 Keepalive ping response:', response);
        });
      }
    }, 30000); // Ping every 30 seconds

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('review:created', handleReviewCreated);
      socket.off('review:vote:updated', handleVoteUpdated);
      socket.off('review:updated', handleReviewUpdated);
      socket.off('connect', handleConnect);
      clearInterval(keepAliveInterval);
    };
  }, [socket]);

  return (
    <div className="bg-bg-white text-foreground">
      <Header isLoggedIn={isLoggedIn} />
      <div className="w-full px-4 sm:px-6 lg:px-8 min-h-screen mx-auto max-w-7xl">

        <div className="relative min-h-[calc(100vh-60px)] flex flex-col">
          <main className="mx-auto grid w-full max-w-none grid-cols-1 gap-5 px-0 sm:px-2 lg:px-4 lg:grid-cols-[auto_minmax(0,1fr)_340px] xl:px-0 flex-1">
            <LeftSidebar />

            <section className="space-y-3 mb-140 px-4 sm:px-0 font-inter">
              <CompanyProfile
                onReviewSubmitted={(newReview) => {
                  if (newReview && typeof newReview === "object" && "id" in newReview) {
                    setReviews((prevReviews) =>
                      prevReviews.some((review) => review.id === (newReview as any).id)
                        ? prevReviews
                        : [newReview, ...prevReviews]
                    );
                    return;
                  }
                  fetchReviews();
                }}
              />

              {loading ? (
                <div className="text-center py-8 text-text-primary">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ReviewCard key={review.id || index} review={review} index={index} />
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



