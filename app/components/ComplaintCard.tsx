"use client";

import Image from "next/image";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useTranslations } from 'next-intl';
import { renderTextWithFirstWordColored } from "../utils/textUtils";
import Separator from "./Separator";
import { formatDistanceToNow } from "date-fns";
import { complaintsApi } from "../../lib/api";
import CommentThread from "./CommentThread";
import { useVote } from "../../lib/hooks/useVote";
import { useComments } from "../../lib/hooks/useComments";
import type { Complaint } from "../../lib/types";

interface ComplaintCardProps {
  complaint: Complaint;
  index: number;
  onVoteUpdate?: (complaintId: string, helpfulCount: number, downVoteCount: number) => void;
}

const statusClass: Record<string, string> = {
  OPEN: "status-badge status-open",
  IN_PROGRESS: "status-badge status-in-progress",
  RESOLVED: "status-badge status-resolved",
  CLOSED: "status-badge status-closed",
};

const getVoteButtonClass = (isActive: boolean, isVoting: boolean) =>
  `vote-btn ${isActive ? "vote-btn-active" : "vote-btn-idle"} ${isVoting ? "vote-btn-waiting" : "vote-btn-ready"}`;

export default function ComplaintCard({ complaint, index: _index, onVoteUpdate }: ComplaintCardProps) {
  const t = useTranslations();
  const {
    isVoting,
    helpfulCount,
    downVoteCount,
    isUpVoted,
    isDownVoted,
    handleVote,
  } = useVote({
    entityId: complaint.id,
    initialHelpfulCount: complaint.helpfulCount ?? 0,
    initialDownVoteCount: complaint.downVoteCount ?? 0,
    initialUserVote: complaint.userVote ?? null,
    voteRequest: complaintsApi.vote,
    onSuccess: (nextHelpfulCount, nextDownVoteCount) => {
      onVoteUpdate?.(complaint.id, nextHelpfulCount, nextDownVoteCount);
    },
  });

  const {
    showComments,
    comments,
    setComments,
    loadingComments,
    commentContent,
    setCommentContent,
    isSubmittingComment,
    commentCount,
    fetchComments,
    handleToggleComments,
    submitComment,
  } = useComments({
    targetKey: "complaintId",
    targetId: complaint.id,
    initialCount: complaint._count?.comments ?? 0,
  });

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return t('common.time.hoursAgo');
    }
  };

  const authorName = complaint.author?.username || "Anonymous";
  void _index;

  return (
    <article className="card">
      <div className="card-inner">
        <div className="vote-rail">
          <button
            onClick={() => handleVote("UP")}
            disabled={isVoting}
            className={getVoteButtonClass(isUpVoted, isVoting)}
            aria-label="Vote up"
          >
            <IoMdArrowUp color="#00885E" size={20} className={isUpVoted ? "drop-shadow-md" : ""} />
          </button>
          <span className="vote-count">{helpfulCount}</span>
          <button
            onClick={() => handleVote("DOWN")}
            disabled={isVoting}
            className={getVoteButtonClass(isDownVoted, isVoting)}
            aria-label="Vote down"
          >
            <IoMdArrowDown color="#EA580C" size={20} className={isDownVoted ? "drop-shadow-md" : ""} />
          </button>
          <span className="vote-count-down">{downVoteCount}</span>
        </div>
        <div className="card-body">
          <div className="card-meta mb-2">
            <div className="avatar">
              {complaint.author?.avatar ? (
                <Image src={complaint.author.avatar} alt={authorName} width={40} height={40} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="card-meta-text">
              <p className="author-name">
                {authorName}
                {complaint.author?.verified && <span className="ml-1">✓</span>}
              </p>
              <p className="meta-line">
                <span className="meta-muted">{formatTimeAgo(complaint.createdAt)}</span>
                <span className="meta-muted">•</span>
                <span className={statusClass[complaint.status] ?? statusClass.OPEN}>{complaint.status}</span>
              </p>
            </div>
          </div>
          <Separator />
          <h3 className="content-title">{renderTextWithFirstWordColored(complaint.title)}</h3>
          <p className="content-body">{complaint.content}</p>

          {complaint.replies && complaint.replies.length > 0 && (
            <div className="space-y-3">
              {complaint.replies.map((reply) => (
                <div key={reply.id} className="company-reply">
                  <div className="company-reply-header">
                    {reply.company.logo && (
                      <Image src={reply.company.logo} alt={reply.company.name} width={24} height={24} className="rounded" />
                    )}
                    <span className="text-xs font-semibold text-primary">{reply.company.name}</span>
                    <span className="company-reply-meta">{formatTimeAgo(reply.createdAt)}</span>
                  </div>
                  <p className="text-sm text-text-primary">{reply.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="action-row">
            <button type="button" onClick={handleToggleComments} className="action-btn-strong">
              {commentCount} {t("common.review.comments")}
            </button>
            <LuDot className="inline-block text-sm font-bold text-text-dark" />
            <button type="button" className="action-btn">{t("common.review.share")}</button>
            <LuDot className="inline-block text-sm font-bold text-text-dark" />
            <button type="button" className="action-btn">{t("common.review.report")}</button>
          </div>

          {showComments && (
            <div className="comment-section">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitComment();
                }}
                className="mb-4"
              >
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={t("common.comment.writeComment") || "Write a comment..."}
                  className="comment-form-textarea"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim() || isSubmittingComment}
                  className="comment-submit-btn"
                >
                  {isSubmittingComment ? t("common.auth.processing") : t("common.comment.post") || "Post Comment"}
                </button>
              </form>

              {loadingComments ? (
                <div className="text-center py-4 text-text-quaternary text-sm">Loading comments...</div>
              ) : comments.length > 0 ? (
                <CommentThread
                  comments={comments}
                  complaintId={complaint.id}
                  onCommentAdded={() => void fetchComments({ force: true })}
                  onVoteUpdate={(commentId, helpfulCount, downVoteCount) => {
                    setComments((prev) =>
                      prev.map((c) => (c.id === commentId ? { ...c, helpfulCount, downVoteCount } : c))
                    );
                  }}
                />
              ) : (
                <div className="text-center py-4 text-text-quaternary text-sm">No comments yet. Be the first to comment!</div>
              )}
            </div>
          )}
        </div>
        <Image src="/verify.svg" alt="" width={16} height={16} className="flex-shrink-0" />
      </div>
    </article>
  );
}

