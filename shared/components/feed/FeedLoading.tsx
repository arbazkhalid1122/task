"use client";

import ProfileListSkeleton from "@/shared/components/ui/ProfileListSkeleton";

export default function FeedLoading() {
  return <ProfileListSkeleton count={3} variant="review" />;
}
