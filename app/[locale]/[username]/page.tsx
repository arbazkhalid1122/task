"use client";

import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import ReviewCard from "../../components/ReviewCard";
import ComplaintCard from "../../components/ComplaintCard";
import RightSidebar from "../../components/RightSidebar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authApi, reviewsApi, complaintsApi } from "../../../lib/api";
import Image from "next/image";

export default function UserProfile() {
  const params = useParams();
  const username = params?.username as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reviews' | 'complaints'>('reviews');

  useEffect(() => {
    // Check if user is logged in
    authApi.me().then((response) => {
      setIsLoggedIn(!!response.data?.user);
    });

    // Fetch user profile and their content
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Fetch user's reviews
      const reviewsResponse = await reviewsApi.list({ 
        limit: 50,
        // We'll need to add userId filter to the API
      });
      
      // Fetch user's complaints by username
      const complaintsResponse = await complaintsApi.list({ 
        username: username,
        limit: 50,
      });

      // Filter reviews by username (temporary until API supports username filter)
      if (reviewsResponse.data?.reviews) {
        const userReviews = reviewsResponse.data.reviews.filter(
          (r: any) => r.author?.username === username
        );
        setReviews(userReviews);
        
        // Set user from first review if available
        if (userReviews.length > 0) {
          setUser(userReviews[0].author);
        }
      }

      if (complaintsResponse.data?.complaints) {
        setComplaints(complaintsResponse.data.complaints);
      }

      // Set user info from first review or complaint
      if (reviews.length > 0) {
        setUser(reviews[0].author);
      } else if (complaints.length > 0) {
        setUser(complaints[0].author);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-white text-foreground">
      <Header isLoggedIn={isLoggedIn} />
      <div className="w-full px-4 sm:px-6 lg:px-8 min-h-screen mx-auto max-w-7xl">
        <div className="relative min-h-[calc(100vh-60px)] flex flex-col">
          <main className="mx-auto grid w-full max-w-none grid-cols-1 gap-5 px-0 sm:px-2 lg:px-4 lg:grid-cols-[auto_minmax(0,1fr)_340px] xl:px-0 flex-1">
            <LeftSidebar />

            <section className="space-y-3 mb-140 px-4 sm:px-0 font-inter">
              {/* User Profile Header */}
              <div className="rounded-md border border-border-light bg-bg-light p-6 mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md border border-primary-border bg-bg-white flex-shrink-0 overflow-hidden">
                    {user?.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.username} 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-lighter flex items-center justify-center text-2xl font-bold text-white">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {user?.username || username}
                      {user?.verified && <span className="ml-2 text-primary">✓</span>}
                    </h1>
                    {user?.bio && (
                      <p className="text-sm text-text-primary mt-2">{user.bio}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-text-quaternary">
                      <span>{reviews.length} Reviews</span>
                      <span>{complaints.length} Complaints</span>
                      {user?.reputation !== undefined && (
                        <span>Reputation: {user.reputation}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-border-light mb-4">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 px-4 text-sm font-semibold transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-quaternary hover:text-text-primary'
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className={`pb-2 px-4 text-sm font-semibold transition-colors ${
                    activeTab === 'complaints'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-quaternary hover:text-text-primary'
                  }`}
                >
                  Complaints ({complaints.length})
                </button>
              </div>

              {/* Content */}
              {loading ? (
                <div className="text-center py-8 text-text-primary">Loading...</div>
              ) : activeTab === 'reviews' ? (
                reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <ReviewCard 
                      key={review.id || index} 
                      review={review} 
                      index={index}
                      onVoteUpdate={(reviewId, helpfulCount, downVoteCount) => {
                        setReviews((prevReviews) =>
                          prevReviews.map((r) =>
                            r.id === reviewId
                              ? {
                                  ...r,
                                  helpfulCount,
                                  downVoteCount,
                                  _count: {
                                    ...r._count,
                                    helpfulVotes: helpfulCount,
                                  },
                                }
                              : r
                          )
                        );
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-text-primary">No reviews yet.</div>
                )
              ) : (
                complaints.length > 0 ? (
                  complaints.map((complaint, index) => (
                    <ComplaintCard 
                      key={complaint.id || index} 
                      complaint={complaint} 
                      index={index}
                      onVoteUpdate={(complaintId, helpfulCount, downVoteCount) => {
                        setComplaints((prevComplaints) =>
                          prevComplaints.map((c) =>
                            c.id === complaintId
                              ? {
                                  ...c,
                                  helpfulCount,
                                  downVoteCount,
                                }
                              : c
                          )
                        );
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-text-primary">No complaints yet.</div>
                )
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

