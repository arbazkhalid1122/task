"use client";

import Image from "next/image";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useTranslations } from 'next-intl';
import { renderTextWithFirstWordColored } from "../utils/textUtils";
import Separator from "./Separator";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { complaintsApi, commentsApi } from "../../lib/api";
import CommentThread from "./CommentThread";

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    content: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    createdAt: string;
    helpfulCount?: number;
    downVoteCount?: number;
    userVote?: 'UP' | 'DOWN' | null;
    author?: {
      username: string;
      avatar?: string;
      verified?: boolean;
    };
    company?: {
      name: string;
      logo?: string;
    };
    product?: {
      name: string;
    };
    replies?: Array<{
      id: string;
      content: string;
      createdAt: string;
      company: {
        name: string;
        logo?: string;
      };
    }>;
    _count?: {
      comments?: number;
    };
  };
  index: number;
  onVoteUpdate?: (complaintId: string, helpfulCount: number, downVoteCount: number) => void;
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

export default function ComplaintCard({ complaint, index, onVoteUpdate }: ComplaintCardProps) {
  const t = useTranslations();
  const [isVoting, setIsVoting] = useState(false);
  const [localHelpfulCount, setLocalHelpfulCount] = useState(complaint.helpfulCount ?? 0);
  const [localDownVoteCount, setLocalDownVoteCount] = useState(complaint.downVoteCount ?? 0);
  const [localUserVote, setLocalUserVote] = useState<'UP' | 'DOWN' | null>(complaint.userVote ?? null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return t('common.time.hoursAgo');
    }
  };

  const authorName = complaint.author?.username || "Anonymous";
  const [commentCount, setCommentCount] = useState(complaint._count?.comments || 0);

  const handleVote = async (voteType: 'UP' | 'DOWN') => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      const response = await complaintsApi.vote(complaint.id, voteType);
      if (response.error) {
        console.error('Vote error:', response.error);
        return;
      }

      if (response.data) {
        setLocalHelpfulCount(response.data.helpfulCount);
        setLocalDownVoteCount(response.data.downVoteCount);
        setLocalUserVote(response.data.voteType);
        
        if (onVoteUpdate) {
          onVoteUpdate(complaint.id, response.data.helpfulCount, response.data.downVoteCount);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const isUpVoted = localUserVote === 'UP';
  const isDownVoted = localUserVote === 'DOWN';

  const fetchComments = async () => {
    if (comments.length > 0) return; // Don't refetch if already loaded
    
    setLoadingComments(true);
    try {
      const response = await commentsApi.list({ complaintId: complaint.id });
      if (response.data?.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await commentsApi.create({
        content: commentContent,
        complaintId: complaint.id,
      });

      if (response.error) {
        console.error('Comment error:', response.error);
        return;
      }

      if (response.data) {
        setComments([response.data, ...comments]);
        setCommentContent("");
        setCommentCount(commentCount + 1);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <article
      key={complaint.id}
      className="rounded-md border border-border-light bg-bg-light p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-2 mt-6 flex-shrink-0">
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
              size={20} 
              className={isUpVoted ? 'drop-shadow-md' : ''}
            />
          </button>
          <span className="text-sm font-semibold text-text-primary min-w-[20px] text-center">
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
              size={20}
              className={isDownVoted ? 'drop-shadow-md' : ''}
            />
          </button>
          <span className="text-xs text-text-quaternary text-center mt-1">
            {localDownVoteCount}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-md border border-primary-border bg-bg-white flex-shrink-0 overflow-hidden">
              {complaint.author?.avatar ? (
                <Image src={complaint.author.avatar} alt={authorName} width={40} height={40} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-green-text">
                {authorName}
                {complaint.author?.verified && <span className="ml-1">✓</span>}
              </p>
              <p className="text-xs text-text-primary break-words mt-0.5 flex gap-1 items-center">
                <span className="text-[#333333] opacity-80">{formatTimeAgo(complaint.createdAt)}</span>
                <span className="text-[#333333] opacity-80">•</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusColors[complaint.status] || statusColors.OPEN}`}>
                  {complaint.status}
                </span>
              </p>
            </div>
          </div>
          <Separator />
          <h3 className="mt-2 text-base font-semibold break-words">{renderTextWithFirstWordColored(complaint.title)}</h3>
          <p className="mt-1 text-[13px] font-normal leading-[22px] text-text-primary tracking-[0.1%] break-words">{complaint.content}</p>
          
          {/* Company replies */}
          {complaint.replies && complaint.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {complaint.replies.map((reply) => (
                <div key={reply.id} className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {reply.company.logo && (
                      <Image 
                        src={reply.company.logo} 
                        alt={reply.company.name} 
                        width={24} 
                        height={24} 
                        className="rounded"
                      />
                    )}
                    <span className="text-xs font-semibold text-primary">{reply.company.name}</span>
                    <span className="text-[10px] text-text-quaternary">
                      {formatTimeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary">{reply.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleToggleComments}
              className="text-xs text-text-primary hover:text-primary transition-colors font-semibold"
            >
              {commentCount} {t('common.review.comments')}
            </button>
            <LuDot className="inline-block text-sm font-bold text-text-dark" />
            <button className="text-xs text-text-primary hover:text-primary transition-colors">
              {t('common.review.share')}
            </button>
            <LuDot className="inline-block text-sm font-bold text-text-dark" />
            <button className="text-xs text-text-primary hover:text-primary transition-colors">
              {t('common.review.report')}
            </button>
          </div>

          {/* Comment Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-border-light">
              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-4">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={t('common.comment.writeComment') || 'Write a comment...'}
                  className="w-full p-3 text-sm border border-border-light rounded-md bg-bg-white text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim() || isSubmittingComment}
                  className="mt-2 px-4 py-2 text-xs btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingComment ? t('common.auth.processing') : (t('common.comment.post') || 'Post Comment')}
                </button>
              </form>

              {/* Comments Thread */}
              {loadingComments ? (
                <div className="text-center py-4 text-text-quaternary text-sm">Loading comments...</div>
              ) : comments.length > 0 ? (
                <CommentThread
                  comments={comments}
                  complaintId={complaint.id}
                  onCommentAdded={() => {
                    fetchComments();
                  }}
                  onVoteUpdate={(commentId, helpfulCount, downVoteCount) => {
                    setComments(prev => prev.map(c => 
                      c.id === commentId 
                        ? { ...c, helpfulCount, downVoteCount }
                        : c
                    ));
                  }}
                />
              ) : (
                <div className="text-center py-4 text-text-quaternary text-sm">No comments yet. Be the first to comment!</div>
              )}
            </div>
          )}
        </div>
        <Image src="/verify.svg" alt="arrow-right" width={16} height={16} className="flex-shrink-0" />
      </div>
    </article>
  );
}

