"use client";

import { useEffect, useRef } from "react";
import FileComplaintForm from "../../components/FileComplaintForm";
import ComplaintListCard from "../../components/ComplaintListCard";
import AppShell from "@/features/layout/components/AppShell";
import { useComplaintsFeed } from "../../../lib/hooks/useComplaintsFeed";
import type { Complaint } from "../../../lib/types";

interface ComplaintsClientProps {
  initialComplaints: Complaint[];
}

export default function ComplaintsClient({ initialComplaints }: ComplaintsClientProps) {
  const { complaints, setComplaints, loading, loadingMore, hasMore, loadMore } = useComplaintsFeed(initialComplaints);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loadingMore, loading]);

  return (
    <AppShell>
      <FileComplaintForm
        onComplaintSubmitted={(complaint) => {
          setComplaints((prev) => (prev.some((c) => c.id === complaint.id) ? prev : [complaint, ...prev]));
        }}
      />

      {loading ? (
        <div className="text-center py-8 text-text-primary">Loading complaints...</div>
      ) : complaints.length > 0 ? (
        <>
          {complaints.map((complaint, index) => (
            <ComplaintListCard key={complaint.id || index} complaint={complaint} index={index} />
          ))}
          <div ref={sentinelRef} className="min-h-4" aria-hidden />
          {loadingMore && <div className="text-center py-6 text-sm text-text-tertiary">Loading more...</div>}
          {!hasMore && complaints.length > 0 && (
            <div className="text-center py-4 text-sm text-text-tertiary">No more complaints</div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-text-primary">No complaints yet. Be the first to file one.</div>
      )}
    </AppShell>
  );
}
