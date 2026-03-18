import Skeleton from "@/shared/components/ui/Skeleton";

function SidebarAuthCardSkeleton() {
  return (
    <div className="mt-4">
      <div className="card-base z-10 mt-4 border border-[#E5E5E5] p-5">
        <Skeleton className="mx-auto h-5 w-40" />
        <div className="mt-2 flex flex-col items-center gap-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="mt-5">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
        <div className="my-8">
          <Skeleton className="h-px w-full rounded-none" />
        </div>
        <div className="space-y-4">
          <div>
            <Skeleton className="mb-2 ml-2 h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
          <div>
            <Skeleton className="mb-2 ml-2 h-3 w-20" />
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
      <div className="sidebar-right-panel flex items-center justify-center gap-1">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

function SidebarTopRatedCardSkeleton({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`mb-2 overflow-hidden rounded-t-md rounded-b-md border border-border-light min-h-[248px] ${
        light ? "bg-white" : "bg-dark-bg"
      }`}
      aria-hidden
    >
      <div className="bg-dark-bg px-4 py-5">
        <Skeleton className="h-4 w-36 bg-white/15" />
      </div>
      <div className={`space-y-2 p-3 ${light ? "bg-card-purple-light-bg" : "bg-dark-card"}`}>
        <div className="flex w-full items-start gap-4 sm:items-center">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-md border border-primary-border bg-bg-white" />
            <Skeleton className={`h-5 ${light ? "w-12" : "w-14"} rounded-md`} />
          </div>
          <div className="min-w-0 flex-1">
            <Skeleton className={`h-4 ${light ? "w-28" : "w-32"}`} />
            <Skeleton className={`mt-2 h-6 ${light ? "w-18" : "w-20"}`} />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-2 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
        <div className={`mb-4 mt-4 h-px w-full ${light ? "bg-card-purple-light-border" : "bg-border-gray"}`} />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[92%]" />
          <Skeleton className="h-3 w-[78%]" />
        </div>
        <Skeleton className="mt-3 h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

interface RightSidebarLoadingProps {
  withAuthCard?: boolean;
}

export default function RightSidebarLoading({
  withAuthCard = true,
}: RightSidebarLoadingProps) {
  return (
    <>
      {withAuthCard ? <SidebarAuthCardSkeleton /> : null}
      <SidebarTopRatedCardSkeleton />
      <SidebarTopRatedCardSkeleton />
      <SidebarTopRatedCardSkeleton light />
    </>
  );
}
