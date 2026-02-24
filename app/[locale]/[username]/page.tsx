"use client";

import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import ReviewCard from "../../components/ReviewCard";
import ComplaintCard from "../../components/ComplaintCard";
import RightSidebar from "../../components/RightSidebar";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useUserProfileData } from "../../../lib/hooks/useUserProfileData";

export default function UserProfile() {
  const params = useParams();
  const username = params?.username as string;
  const [activeTab, setActiveTab] = useState<'reviews' | 'complaints'>('reviews');
  const { user, reviews, complaints, loading, updateReviewVote, updateComplaintVote } =
    useUserProfileData(username);

  return (
    <div className="bg-bg-white text-foreground">
      <Header />
      <div className="page-container">
        <div className="page-main-wrap">
          <main className="main-grid">
            <LeftSidebar />

            <section className="content-section">
              <div className="profile-header-box">
                <div className="profile-avatar-wrap">
                  <div className="avatar-lg">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt={user.username} width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="avatar-placeholder">{user?.username?.[0]?.toUpperCase() ?? "U"}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {user?.username ?? username}
                      {user?.verified && <span className="ml-2 text-primary">✓</span>}
                    </h1>
                    {user?.bio && <p className="text-sm text-text-primary mt-2">{user.bio}</p>}
                    <div className="stats-line">
                      <span>{reviews.length} Reviews</span>
                      <span>{complaints.length} Complaints</span>
                      {user?.reputation !== undefined && <span>Reputation: {user.reputation}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`profile-tab ${activeTab === "reviews" ? "profile-tab-active" : "profile-tab-inactive"}`}
                >
                  Reviews ({reviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("complaints")}
                  className={`profile-tab ${activeTab === "complaints" ? "profile-tab-active" : "profile-tab-inactive"}`}
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
                      onVoteUpdate={updateReviewVote}
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
                      onVoteUpdate={updateComplaintVote}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-text-primary">No complaints yet.</div>
                )
              )}
            </section>

            <RightSidebar />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

