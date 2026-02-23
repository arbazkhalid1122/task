"use client";

import Image from "next/image";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useTranslations } from 'next-intl';
import { renderTextWithFirstWordColored } from "../utils/textUtils";
import Separator from "./Separator";
import { formatDistanceToNow } from "date-fns";
import { reviewsApi } from "../../lib/api";
import CommentThread from "./CommentThread";
import { useVote } from "../../lib/hooks/useVote";
import { useComments } from "../../lib/hooks/useComments";
import type { Review } from "../../lib/types";

interface ReviewCardProps {
  review: Review;
  index: number;
  onVoteUpdate?: (reviewId: string, helpfulCount: number, downVoteCount: number) => void;
}

const getVoteButtonClass = (isActive: boolean, isVoting: boolean) =>
  `vote-btn ${isActive ? "vote-btn-active" : "vote-btn-idle"} ${isVoting ? "vote-btn-waiting" : "vote-btn-ready"}`;

export default function ReviewCard({ review, index: _index, onVoteUpdate }: ReviewCardProps) {
  const t = useTranslations();
  const {
    isVoting,
    helpfulCount,
    downVoteCount,
    isUpVoted,
    isDownVoted,
    handleVote,
  } = useVote({
    entityId: review.id,
    initialHelpfulCount: review.helpfulCount ?? review._count?.helpfulVotes ?? 0,
    initialDownVoteCount: review.downVoteCount ?? 0,
    initialUserVote: review.userVote ?? null,
    voteRequest: reviewsApi.vote,
    onSuccess: (nextHelpfulCount, nextDownVoteCount) => {
      onVoteUpdate?.(review.id, nextHelpfulCount, nextDownVoteCount);
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
    targetKey: "reviewId",
    targetId: review.id,
    initialCount: review._count?.comments ?? 0,
  });

  // Render stars based on score (0-10 scale)
  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 10 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="text-lg font-bold leading-[14px] tracking-normal text-primary-dark mr-4">
        <span className="text-primary-lighter">{'★'.repeat(fullStars)}</span>
        {hasHalfStar && <span className="text-primary-lighter">★</span>}
        <span className="text-gray-300">{'☆'.repeat(emptyStars)}</span>
        <span className="text-primary-lighter ml-1">{score.toFixed(1)}/10</span>
      </span>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return t('common.time.hoursAgo');
    }
  };

  const translate = (key: string, fallback: string) => {
    try {
      return t(key as never);
    } catch {
      return fallback;
    }
  };

  const authorName = review.author?.username || "Anonymous";
  void _index;

  return (
    <article className="card">
      <div className="card-inner">
        <div className="vote-rail">
          <button
            onClick={() => handleVote('UP')}
            disabled={isVoting}
            className={getVoteButtonClass(isUpVoted, isVoting)}
            aria-label="Vote up"
          >
            <IoMdArrowUp color="#00885E" size={20} className={isUpVoted ? "drop-shadow-md" : ""} />
          </button>
          <span className="vote-count">{helpfulCount}</span>
          <button
            onClick={() => handleVote('DOWN')}
            disabled={isVoting}
            className={getVoteButtonClass(isDownVoted, isVoting)}
            aria-label="Vote down"
          >
            <IoMdArrowDown color="#EA580C" size={20} className={isDownVoted ? "drop-shadow-md" : ""} />
          </button>
          <span className="vote-count-down">{downVoteCount}</span>
        </div>
        <div className="card-body">
          <div className="card-meta">
            <div className="avatar">
              {review.author?.avatar ? (
                <Image src={review.author.avatar} alt={authorName} width={40} height={40} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="card-meta-text">
              <p className="author-name">
                {authorName}
                {review.author?.verified && <span className="ml-1">✓</span>}
              </p>
              <p className="meta-line">
                <span className="meta-muted">{formatTimeAgo(review.createdAt)}</span>
                <span className="meta-muted">•</span>
                <span className="text-primary font-semibold">
                  {t("common.review.category")} • {t("common.review.productCategory")}
                </span>
              </p>
            </div>
          </div>
          <Separator />
          {renderStars(review.overallScore)}
          <h3 className="content-title">{renderTextWithFirstWordColored(review.title)}</h3>
          <p className="content-body">{review.content}</p>
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
                  placeholder={translate("common.comment.writeComment", "Write a comment...")}
                  className="comment-form-textarea"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim() || isSubmittingComment}
                  className="comment-submit-btn"
                >
                  {isSubmittingComment ? t("common.auth.processing") : translate("common.comment.post", "Post Comment")}
                </button>
              </form>

              {loadingComments ? (
                <div className="text-center py-4 text-text-quaternary text-sm">
                  {translate("common.comment.loadingComments", "Loading comments...")}
                </div>
              ) : comments.length > 0 ? (
                <CommentThread
                  comments={comments}
                  reviewId={review.id}
                  onCommentAdded={() => void fetchComments({ force: true })}
                  onVoteUpdate={(commentId, helpfulCount, downVoteCount) => {
                    setComments((prev) =>
                      prev.map((c) => (c.id === commentId ? { ...c, helpfulCount, downVoteCount } : c))
                    );
                  }}
                />
              ) : (
                <div className="text-center py-4 text-text-quaternary text-sm">
                  {translate("common.comment.noComments", "No comments yet. Be the first to comment!")}
                </div>
              )}
            </div>
          )}
        </div>
        <Image src="/verify.svg" alt="" width={16} height={16} className="flex-shrink-0" />
      </div>
    </article>
  );
}
