"use client";

import Image from "next/image";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import Separator from "./Separator";
import { commentsApi } from "../../lib/api";

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
  const [isVoting, setIsVoting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
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
        console.error('Vote error:', result.error);
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
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await commentsApi.create({
        content: replyContent,
        reviewId,
        postId,
        complaintId,
        parentId: comment.id,
      });
      if (result.error) {
        console.error('Reply error:', result.error);
        return;
      }
      if (result.data) {
        setLocalReplies([...localReplies, result.data]);
        setReplyContent("");
        setShowReplyForm(false);
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (error) {
      console.error('Error replying:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUpVoted = localUserVote === 'UP';
  const isDownVoted = localUserVote === 'DOWN';
  const marginLeft = depth * 24; // 24px per depth level

  return (
    <div className="flex gap-3" style={{ marginLeft: `${marginLeft}px` }}>
      {/* Vertical line for nested comments */}
      {depth > 0 && (
        <div className="w-[2px] bg-border-light flex-shrink-0" />
      )}
      
      <div className="flex-1">
        <div className="flex items-start gap-3">
          {/* Vote buttons */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
            <button
              onClick={() => handleVote('UP')}
              disabled={isVoting}
              className={`transition-all duration-200 ${
                isUpVoted 
                  ? 'opacity-100 scale-110' 
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              } ${isVoting ? 'cursor-wait' : 'cursor-pointer'}`}
              aria-label="Vote up"
            >
              <IoMdArrowUp 
                color={isUpVoted ? "#00885E" : "#00885E"} 
                size={16} 
                className={isUpVoted ? 'drop-shadow-md' : ''}
              />
            </button>
            <span className="text-xs font-semibold text-text-primary min-w-[16px] text-center">
              {localHelpfulCount}
            </span>
            <button
              onClick={() => handleVote('DOWN')}
              disabled={isVoting}
              className={`transition-all duration-200 ${
                isDownVoted 
                  ? 'opacity-100 scale-110' 
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              } ${isVoting ? 'cursor-wait' : 'cursor-pointer'}`}
              aria-label="Vote down"
            >
              <IoMdArrowDown 
                color={isDownVoted ? "#EA580C" : "#EA580C"} 
                size={16}
                className={isDownVoted ? 'drop-shadow-md' : ''}
              />
            </button>
            <span className="text-[10px] text-text-quaternary text-center">
              {localDownVoteCount}
            </span>
          </div>

          {/* Comment content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-md border border-primary-border bg-bg-white flex-shrink-0 overflow-hidden">
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
              <span className="text-[10px] text-text-quaternary">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-text-primary break-words leading-relaxed">
              {comment.content}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-xs text-text-primary hover:text-primary transition-colors"
              >
                {t('common.comment.reply')}
              </button>
              <span className="text-xs text-text-quaternary">
                {localReplies.length} {localReplies.length === 1 ? t('common.comment.reply') : t('common.comment.replies')}
              </span>
            </div>

            {/* Reply form */}
            {showReplyForm && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={t('common.comment.writeReply')}
                  className="w-full p-2 text-sm border border-border-light rounded-md bg-bg-white text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleReply}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="px-3 py-1 text-xs btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (t('common.processing') || t('common.auth.processing') || 'Processing...') : t('common.comment.post')}
                  </button>
                  <button
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent("");
                    }}
                    className="px-3 py-1 text-xs border border-border-light rounded-md text-text-primary hover:bg-bg-light"
                  >
                    {t('common.cancel') || t('common.comment.cancel') || 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            {/* Nested replies */}
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

