"use client";

import Skeleton from "@/shared/components/ui/Skeleton";
import ProfileListSkeleton from "@/shared/components/ui/ProfileListSkeleton";

const PROFILE_HEADER_LINE_WIDTHS = ["w-36", "w-56", "w-28"] as const;
const STATS_ITEM_WIDTHS = ["w-20", "w-16", "w-14", "w-20", "w-24"] as const;
const TAB_COUNT = 4;
const REVIEW_CARD_COUNT = 5;

/** Inner content only; parent should use same wrapper as real profile for stable CLS. */
export default function UserProfileSkeleton() {
  return (
    <div className="min-h-[70vh] w-full animate-pulse" aria-hidden>
      {/* Profile card skeleton */}
      <div className="card-base">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="h-14 w-14 flex-shrink-0" />
              <div className="space-y-2">
                {PROFILE_HEADER_LINE_WIDTHS.map((widthClass, i) => (
                  <Skeleton
                    key={i}
                    className={i === 0 ? `h-5 ${widthClass}` : i === 1 ? `h-4 ${widthClass}` : `h-3 ${widthClass}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-[#E5E5E5] pt-4">
            {STATS_ITEM_WIDTHS.map((widthClass, i) => (
              <Skeleton key={i} className={`h-4 ${widthClass}`} />
            ))}
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mt-6">
          <div className="mb-4 flex gap-1 rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] p-1">
            {Array.from({ length: TAB_COUNT }).map((_, i) => (
              <Skeleton key={i} className="h-9 flex-1 rounded-lg" />
            ))}
          </div>

          <ProfileListSkeleton count={REVIEW_CARD_COUNT} variant="review" />
        </div>
    </div>
  );
}
