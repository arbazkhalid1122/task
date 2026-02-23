export type VoteType = "UP" | "DOWN";

export interface Author {
  id: string;
  username: string;
  avatar?: string;
  verified?: boolean;
  bio?: string;
  reputation?: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  helpfulCount: number;
  downVoteCount: number;
  userVote?: VoteType | null;
  author: Author;
  replies?: Comment[];
  _count?: {
    replies?: number;
  };
}

export interface Review {
  id: string;
  title: string;
  content: string;
  overallScore: number;
  createdAt: string;
  helpfulCount?: number;
  downVoteCount?: number;
  userVote?: VoteType | null;
  author?: Author;
  company?: {
    id?: string;
    name: string;
    category?: string;
  };
  product?: {
    id?: string;
    name: string;
  };
  _count?: {
    comments?: number;
    helpfulVotes?: number;
  };
}

export interface ComplaintReply {
  id: string;
  content: string;
  createdAt: string;
  company: {
    name: string;
    logo?: string;
  };
}

export interface Complaint {
  id: string;
  title: string;
  content: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  helpfulCount?: number;
  downVoteCount?: number;
  userVote?: VoteType | null;
  author?: Author;
  company?: {
    id?: string;
    name: string;
    logo?: string;
  };
  product?: {
    id?: string;
    name: string;
  };
  replies?: ComplaintReply[];
  _count?: {
    comments?: number;
  };
}

export interface VoteResponse {
  voteType: VoteType | null;
  helpfulCount: number;
  downVoteCount: number;
}

export interface UserProfile {
  id: string;
  email?: string;
  username: string;
  avatar?: string;
  verified?: boolean;
  bio?: string;
  reputation?: number;
}
