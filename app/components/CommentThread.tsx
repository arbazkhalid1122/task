"use client";

import Image from "next/image";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { commentsApi } from "../../lib/api";
import { createCommentSchema } from "../../lib/validations";
import { useToast } from "@/app/contexts/ToastContext";
import { safeApiMessage } from "../../lib/apiErrors";

const getVoteButtonClass = (isActive: boolean, isVoting: boolean) =>
  `vote-btn ${isActive ? "vote-btn-active" : "vote-btn-idle"} ${isVoting ? "vote-btn-waiting" : "vote-btn-ready"}`;

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  helpfulCount: number;
  downVoteCount: number;
  userVote?: 'UP' | 'DOWN' | null;
  author: {
    id: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  replies?: Comment[];
  _count?: {
    replies?: number;
  };
}

interface CommentThreadProps {
  comments: Comment[];
  reviewId?: string;
  postId?: string;
  complaintId?: string;
  onCommentAdded?: () => void;
  onVoteUpdate?: (commentId: string, helpfulCount: number, downVoteCount: number) => void;
  maxDepth?: number;
}

export default function CommentThread({ 
  comments, 
  reviewId, 
  postId, 
  complaintId,
  onCommentAdded,
  onVoteUpdate,
  maxDepth = 5 
}: CommentThreadProps) {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          reviewId={reviewId}
          postId={postId}
          complaintId={complaintId}
          onCommentAdded={onCommentAdded}
          onVoteUpdate={onVoteUpdate}
          depth={0}
          maxDepth={maxDepth}
        />
      ))}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  reviewId?: string;
  postId?: string;
  complaintId?: string;
  onCommentAdded?: () => void;
  onVoteUpdate?: (commentId: string, helpfulCount: number, downVoteCount: number) => void;
  depth: number;
  maxDepth: number;
}

function CommentItem({ 
  comment, 
  reviewId, 
  postId, 
  complaintId,
  onCommentAdded,
  onVoteUpdate,
  depth,
  maxDepth 
}: CommentItemProps) {
  const t = useTranslations();
  const { showToast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localHelpfulCount, setLocalHelpfulCount] = useState(comment.helpfulCount || 0);
  const [localDownVoteCount, setLocalDownVoteCount] = useState(comment.downVoteCount || 0);
  const [localUserVote, setLocalUserVote] = useState<'UP' | 'DOWN' | null>(comment.userVote ?? null);
  const [localReplies, setLocalReplies] = useState<Comment[]>(comment.replies || []);

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return t('common.time.hoursAgo');
    }
  };

  const handleVote = async (voteType: 'UP' | 'DOWN') => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      const result = await commentsApi.vote(comment.id, voteType);
      if (result.error) {
        showToast(safeApiMessage(result.error), "error");
        return;
      }
      if (result.data) {
        setLocalHelpfulCount(result.data.helpfulCount);
        setLocalDownVoteCount(result.data.downVoteCount);
        setLocalUserVote(result.data.voteType ?? null);
        if (onVoteUpdate) {
          onVoteUpdate(comment.id, result.data.helpfulCount, result.data.downVoteCount);
        }
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleReply = async () => {
    setReplyError("");
    const parsed = createCommentSchema.safeParse({
      content: replyContent,
      reviewId,
      postId,
      complaintId,
      parentId: comment.id,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setReplyError(first?.message ?? "Validation failed");
      return;
    }
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await commentsApi.create({
        content: parsed.data.content,
        reviewId: parsed.data.reviewId,
        postId: parsed.data.postId,
        complaintId: parsed.data.complaintId,
        parentId: parsed.data.parentId,
      });
      if (result.error) {
        setReplyError(safeApiMessage(result.error));
        showToast(safeApiMessage(result.error), "error");
        return;
      }
      if (result.data) {
        setLocalReplies([...localReplies, result.data]);
        setReplyContent("");
        setReplyError("");
        setShowReplyForm(false);
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setReplyError(safeApiMessage(msg));
      showToast(safeApiMessage(msg), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUpVoted = localUserVote === "UP";
  const isDownVoted = localUserVote === "DOWN";
  const marginLeft = depth * 24;

  return (
    <div className="flex gap-3" style={{ marginLeft: `${marginLeft}px` }}>
      {depth > 0 && <div className="w-[2px] bg-border-light flex-shrink-0" />}

      <div className="flex-1">
        <div className="flex items-start gap-3">
          <div className="comment-item-vote-rail">
            <button
              onClick={() => handleVote("UP")}
              disabled={isVoting}
              className={getVoteButtonClass(isUpVoted, isVoting)}
              aria-label="Vote up"
            >
              <IoMdArrowUp color="#00885E" size={16} className={isUpVoted ? "drop-shadow-md" : ""} />
            </button>
            <span className="comment-item-vote-count">{localHelpfulCount}</span>
            <button
              onClick={() => handleVote("DOWN")}
              disabled={isVoting}
              className={getVoteButtonClass(isDownVoted, isVoting)}
              aria-label="Vote down"
            >
              <IoMdArrowDown color="#EA580C" size={16} className={isDownVoted ? "drop-shadow-md" : ""} />
            </button>
            <span className="comment-item-vote-count-down">{localDownVoteCount}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="avatar avatar-sm">
                {comment.author?.avatar ? (
                  <Image
                    src={comment.author.avatar}
                    alt={comment.author.username}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <span className="text-xs font-semibold text-green-text">
                {comment.author?.username || "Anonymous"}
                {comment.author?.verified && <span className="ml-1">✓</span>}
              </span>
              <span className="text-[10px] text-text-quaternary">{formatTimeAgo(comment.createdAt)}</span>
            </div>
            <p className="comment-body-text">{comment.content}</p>
            <div className="flex items-center gap-3 mt-2">
              <button type="button" onClick={() => setShowReplyForm(!showReplyForm)} className="action-btn">
                {t("common.comment.reply")}
              </button>
              <span className="text-xs text-text-quaternary">
                {localReplies.length} {localReplies.length === 1 ? t("common.comment.reply") : t("common.comment.replies")}
              </span>
            </div>

            {showReplyForm && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={t("common.comment.writeReply")}
                  className="reply-textarea"
                  rows={3}
                />
                {replyError && <p className="text-xs text-red-500">{replyError}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReply}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="reply-btn"
                  >
                    {isSubmitting ? t("common.auth.processing") || "Processing..." : t("common.comment.post")}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowReplyForm(false); setReplyContent(""); }}
                    className="reply-cancel-btn"
                  >
                    {t("common.comment.cancel") || "Cancel"}
                  </button>
                </div>
              </div>
            )}

            {localReplies.length > 0 && depth < maxDepth && (
              <div className="mt-4 space-y-3">
                {localReplies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    reviewId={reviewId}
                    postId={postId}
                    complaintId={complaintId}
                    onCommentAdded={onCommentAdded}
                    onVoteUpdate={onVoteUpdate}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

