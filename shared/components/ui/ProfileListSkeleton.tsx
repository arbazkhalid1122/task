import Skeleton from "@/shared/components/ui/Skeleton";

interface ProfileListSkeletonProps {
  count?: number;
  variant?: "review" | "complaint";
}

function ReviewCardSkeleton({ index }: { index: number }) {
  return (
    <article className="card" aria-hidden>
      <div className="card-inner">
        <div className="flex w-12 flex-col items-center gap-2 self-stretch pt-1">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="card-body">
          <div className="card-meta">
            <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
            <div className="card-meta-text flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-2 rounded-full" />
                <Skeleton className={index % 2 === 0 ? "h-3 w-28" : "h-3 w-32"} />
              </div>
            </div>
          </div>

          <div className="my-4 h-px w-full bg-[#E5E5E5]" />

          <div className="mb-4 flex items-end gap-3">
            <Skeleton className="h-11 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Skeleton key={starIndex} className="h-4 w-4" />
                ))}
              </div>
            </div>
          </div>

          <Skeleton className={index % 2 === 0 ? "h-5 w-3/5" : "h-5 w-2/3"} />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[95%]" />
            <Skeleton className="h-3 w-[82%]" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-2 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-2 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-sm" />
      </div>
    </article>
  );
}

function ComplaintCardSkeleton({ index }: { index: number }) {
  return (
    <article className="card" aria-hidden>
      <div className="card-inner">
        <div className="card-body min-w-0 flex-1">
          <div className="card-meta mb-2">
            <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
            <div className="card-meta-text flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-2 rounded-full" />
                <Skeleton className={index % 2 === 0 ? "h-5 w-24 rounded-full" : "h-5 w-28 rounded-full"} />
              </div>
            </div>
          </div>

          <div className="my-4 h-px w-full bg-[#E5E5E5]" />

          <Skeleton className={index % 2 === 0 ? "h-5 w-1/2" : "h-5 w-3/5"} />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[92%]" />
            <Skeleton className="h-3 w-[78%]" />
          </div>
        </div>

        <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-sm" />
      </div>
    </article>
  );
}

export default function ProfileListSkeleton({
  count = 4,
  variant = "review",
}: ProfileListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) =>
        variant === "review" ? (
          <ReviewCardSkeleton key={index} index={index} />
        ) : (
          <ComplaintCardSkeleton key={index} index={index} />
        )
      )}
    </div>
  );
}
