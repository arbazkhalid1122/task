"use client";

import { useState } from "react";
import { commentsApi } from "@/lib/api";
import type { Comment } from "@/lib/types";

type CommentTargetKey = "reviewId" | "complaintId" | "postId";

interface UseCommentsOptions {
  targetKey: CommentTargetKey;
  targetId: string;
  initialCount?: number;
}

export function useComments({ targetKey, targetId, initialCount = 0 }: UseCommentsOptions) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCount);

  const buildCommentFilter = () => ({ [targetKey]: targetId });

  const fetchComments = async ({ force = false }: { force?: boolean } = {}) => {
    if (!force && comments.length > 0) return;

    setLoadingComments(true);
    try {
      const response = await commentsApi.list(buildCommentFilter());
      if (response.data?.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      void fetchComments();
    }
    setShowComments((prev) => !prev);
  };

  const submitComment = async () => {
    if (!commentContent.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await commentsApi.create({
        content: commentContent,
        ...buildCommentFilter(),
      });

      if (response.error || !response.data) return;
      const createdComment = response.data;
      setComments((prev) => [createdComment, ...prev]);
      setCommentContent("");
      setCommentCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return {
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
  };
}
