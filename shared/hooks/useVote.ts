"use client";

import { useEffect, useRef, useState } from "react";
import type { ApiResponse } from "@/lib/api/core";
import type { VoteResponse, VoteType } from "@/lib/types";

type VoteRequest = (id: string, voteType: VoteType) => Promise<ApiResponse<VoteResponse>>;

interface UseVoteOptions {
  entityId: string;
  initialHelpfulCount?: number;
  initialDownVoteCount?: number;
  initialUserVote?: VoteType | null;
  voteRequest: VoteRequest;
  onSuccess?: (helpfulCount: number, downVoteCount: number, voteType: VoteType | null) => void;
}

/** Applies initial counts only when entityId changes (new entity). After that, state updates only from server response to avoid flicker when parent re-renders. */
export function useVote({
  entityId,
  initialHelpfulCount = 0,
  initialDownVoteCount = 0,
  initialUserVote = null,
  voteRequest,
  onSuccess,
}: UseVoteOptions) {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
  const [downVoteCount, setDownVoteCount] = useState(initialDownVoteCount);
  const [userVote, setUserVote] = useState<VoteType | null>(initialUserVote);
  const prevEntityIdRef = useRef<string | null>(null);
  const isVotingRef = useRef(false);

  // Apply initial values only when entityId changes (new entity). Avoids flicker from parent re-renders.
  useEffect(() => {
    if (prevEntityIdRef.current !== entityId) {
      prevEntityIdRef.current = entityId;
      setHelpfulCount(initialHelpfulCount);
      setDownVoteCount(initialDownVoteCount);
      setUserVote(initialUserVote);
    }
  }, [entityId, initialHelpfulCount, initialDownVoteCount, initialUserVote]);

  const handleVote = async (voteType: VoteType) => {
    if (isVotingRef.current) return;

    isVotingRef.current = true;
    try {
      const response = await voteRequest(entityId, voteType);
      if (response.error || !response.data) return;

      const nextState = response.data;
      setHelpfulCount(nextState.helpfulCount);
      setDownVoteCount(nextState.downVoteCount);
      setUserVote(nextState.voteType);
      onSuccess?.(nextState.helpfulCount, nextState.downVoteCount, nextState.voteType);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      isVotingRef.current = false;
    }
  };

  return {
    helpfulCount,
    downVoteCount,
    userVote,
    isUpVoted: userVote === "UP",
    isDownVoted: userVote === "DOWN",
    handleVote,
  };
}
