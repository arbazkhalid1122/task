import { cache } from "react";
import { getBackendUrl } from "@/lib/env";
import type { Review, UserProfile, Complaint } from "@/lib/types";
import { hasLikelyAuthCookie } from "@/lib/authCookies";
import { PAGE_SIZE } from "@/lib/constants";

/** Page size for profile reviews/complaints (match useProfileQueries). */
const PROFILE_PAGE_SIZE = 10;

export interface ServerAuthResult {
  isLoggedIn: boolean;
  user: UserProfile | null;
}

/**
 * Server-only: fetch auth state from backend using request cookies.
 * Pass the result of (await cookies()).toString() or the Cookie header.
 */
export async function getServerAuth(cookieHeader?: string): Promise<ServerAuthResult> {
  const base = getBackendUrl();
  if (!base) return { isLoggedIn: false, user: null };
  try {
    const headers: HeadersInit = {};
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }
    const res = await fetch(`${base}/api/auth/me`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) {
      return { isLoggedIn: false, user: null };
    }
    const data = (await res.json()) as { user?: UserProfile };
    return {
      isLoggedIn: !!data?.user,
      user: data?.user ?? null,
    };
  } catch {
    return { isLoggedIn: false, user: null };
  }
}

export interface ServerReviewsResult {
  reviews: Review[];
}

/**
 * Server-only: fetch approved reviews for the home feed.
 * Optionally pass cookie header to include user vote state.
 */
export async function getServerReviews(options?: {
  limit?: number;
  cookieHeader?: string;
}): Promise<ServerReviewsResult> {
  const base = getBackendUrl();
  if (!base) return { reviews: [] };
  const limit = options?.limit ?? PAGE_SIZE;
  const hasAuthContext = hasLikelyAuthCookie(options?.cookieHeader);
  try {
    const url = `${base}/api/reviews?status=APPROVED&limit=${limit}`;
    const headers: HeadersInit = {};
    if (options?.cookieHeader) {
      headers["Cookie"] = options.cookieHeader;
    }
    const res = await fetch(url, {
      headers,
      ...(hasAuthContext
        ? { cache: "no-store" as const }
        : { next: { revalidate: 30 } }),
    });
    if (!res.ok) {
      return { reviews: [] };
    }
    const data = (await res.json()) as { reviews?: Review[] };
    return {
      reviews: Array.isArray(data?.reviews) ? data.reviews : [],
    };
  } catch {
    return { reviews: [] };
  }
}

export interface UserProfileResponse {
  user: UserProfile & { createdAt?: string };
  stats: { followersCount: number; followingCount: number; postsCount: number; complaintsCount: number };
  viewerState: { isFollowing: boolean };
}

/**
 * Server-only: fetch full user profile (user, stats, viewerState).
 * Pass cookieHeader to get correct isFollowing for the current viewer.
 * Deduped per-request via React cache() so metadata and page can share one fetch.
 */
export const getServerUserProfileFull = cache(
  async (
    username: string,
    cookieHeader?: string
  ): Promise<UserProfileResponse | null> => {
    const base = getBackendUrl();
    if (!base) return null;
    try {
      const headers: HeadersInit = {};
      if (cookieHeader) headers["Cookie"] = cookieHeader;
      const res = await fetch(`${base}/api/users/${encodeURIComponent(username)}`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = (await res.json()) as UserProfileResponse;
      return data?.user ? data : null;
    } catch {
      return null;
    }
  }
);

/**
 * Server-only: fetch public user profile for metadata/SEO.
 * Returns only user; use getServerUserProfileFull for full profile + stats.
 */
export async function getServerUserProfile(username: string): Promise<{
  user: (UserProfile & { createdAt?: string }) | null;
}> {
  const data = await getServerUserProfileFull(username);
  return { user: data?.user ?? null };
}

export interface ServerProfileReviewsResult {
  reviews: Review[];
  pagination: { page: number; total: number; totalPages: number };
}

/**
 * Server-only: fetch first page of reviews for a user profile.
 */
export async function getServerProfileReviews(
  username: string,
  options?: { page?: number; limit?: number; cookieHeader?: string }
): Promise<ServerProfileReviewsResult> {
  const base = getBackendUrl();
  if (!base) return { reviews: [], pagination: { page: 1, total: 0, totalPages: 0 } };
  const page = options?.page ?? 1;
  const limit = options?.limit ?? PROFILE_PAGE_SIZE;
  const hasAuthContext = hasLikelyAuthCookie(options?.cookieHeader);
  try {
    const url = `${base}/api/reviews?username=${encodeURIComponent(username)}&page=${page}&limit=${limit}`;
    const headers: HeadersInit = {};
    if (options?.cookieHeader) headers["Cookie"] = options.cookieHeader;
    const res = await fetch(url, {
      headers,
      ...(hasAuthContext
        ? { cache: "no-store" as const }
        : { next: { revalidate: 30 } }),
    });
    if (!res.ok) return { reviews: [], pagination: { page: 1, total: 0, totalPages: 0 } };
    const data = (await res.json()) as {
      reviews?: Review[];
      pagination?: { page: number; total: number; totalPages: number };
    };
    const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
    const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };
    return { reviews, pagination };
  } catch {
    return { reviews: [], pagination: { page: 1, total: 0, totalPages: 0 } };
  }
}

export interface ServerProfileComplaintsResult {
  complaints: Complaint[];
  pagination: { page: number; total: number; totalPages: number };
}

/**
 * Server-only: fetch first page of complaints for a user profile.
 */
export async function getServerProfileComplaints(
  username: string,
  options?: { page?: number; limit?: number; cookieHeader?: string }
): Promise<ServerProfileComplaintsResult> {
  const base = getBackendUrl();
  if (!base) return { complaints: [], pagination: { page: 1, total: 0, totalPages: 0 } };
  const page = options?.page ?? 1;
  const limit = options?.limit ?? PROFILE_PAGE_SIZE;
  const hasAuthContext = hasLikelyAuthCookie(options?.cookieHeader);
  try {
    const url = `${base}/api/complaints?username=${encodeURIComponent(username)}&page=${page}&limit=${limit}`;
    const headers: HeadersInit = {};
    if (options?.cookieHeader) headers["Cookie"] = options.cookieHeader;
    const res = await fetch(url, {
      headers,
      ...(hasAuthContext
        ? { cache: "no-store" as const }
        : { next: { revalidate: 30 } }),
    });
    if (!res.ok) return { complaints: [], pagination: { page: 1, total: 0, totalPages: 0 } };
    const data = (await res.json()) as {
      complaints?: Complaint[];
      pagination?: { page: number; total: number; totalPages: number };
    };
    const complaints = Array.isArray(data?.complaints) ? data.complaints : [];
    const pagination = data?.pagination ?? { page: 1, total: 0, totalPages: 0 };
    return { complaints, pagination };
  } catch {
    return { complaints: [], pagination: { page: 1, total: 0, totalPages: 0 } };
  }
}

export interface ServerComplaintsResult {
  complaints: Complaint[];
}

/**
 * Server-only: fetch complaints for the complaints page.
 */
export async function getServerComplaints(options?: {
  limit?: number;
  page?: number;
  cookieHeader?: string;
}): Promise<ServerComplaintsResult> {
  const base = getBackendUrl();
  if (!base) return { complaints: [] };
  const limit = options?.limit ?? PAGE_SIZE;
  const page = options?.page ?? 1;
  const hasAuthContext = hasLikelyAuthCookie(options?.cookieHeader);
  try {
    const url = `${base}/api/complaints?limit=${limit}&page=${page}`;
    const headers: HeadersInit = {};
    if (options?.cookieHeader) {
      headers["Cookie"] = options.cookieHeader;
    }
    const res = await fetch(url, {
      headers,
      ...(hasAuthContext
        ? { cache: "no-store" as const }
        : { next: { revalidate: 30 } }),
    });
    if (!res.ok) {
      return { complaints: [] };
    }
    const data = (await res.json()) as { complaints?: Complaint[] };
    return {
      complaints: Array.isArray(data?.complaints) ? data.complaints : [],
    };
  } catch {
    return { complaints: [] };
  }
}
