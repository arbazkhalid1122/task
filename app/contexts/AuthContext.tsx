"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { authApi, setApiAuthToken } from "@/lib/api";
import { useToast } from "@/app/contexts/ToastContext";
import type { UserProfile } from "@/lib/types";

function isAuthFailureMessage(message: string): boolean {
  return /unauthorized|authentication required/i.test(message);
}

// Map NextAuth session.user to UserProfile (session is source of truth when authenticated)
function sessionUserToProfile(sessionUser: {
  id?: string;
  email?: string | null;
  name?: string | null;
  username?: string;
  avatar?: string | null;
  verified?: boolean;
  reputation?: number;
  bio?: string | null;
}): UserProfile | null {
  if (!sessionUser?.id || !sessionUser?.username) return null;
  return {
    id: sessionUser.id,
    email: sessionUser.email ?? undefined,
    username: sessionUser.username,
    avatar: sessionUser.avatar ?? undefined,
    verified: sessionUser.verified ?? false,
    bio: sessionUser.bio ?? undefined,
    reputation: sessionUser.reputation ?? 0,
  };
}

function getSessionBackendToken(sessionUser: unknown): string | undefined {
  if (!sessionUser || typeof sessionUser !== "object") return undefined;
  const token = (sessionUser as { backendToken?: unknown }).backendToken;
  return typeof token === "string" && token.trim() ? token.trim() : undefined;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: UserProfile | null;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface InitialAuth {
  isLoggedIn: boolean;
  user: UserProfile | null;
}

export function AuthProvider({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth?: InitialAuth | null;
}) {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth?.isLoggedIn ?? false);
  const [user, setUser] = useState<UserProfile | null>(initialAuth?.user ?? null);
  const { showToast } = useToast();

  const refreshAuth = useCallback(async () => {
    const response = await authApi.me();
    const loggedIn = !!response.data?.user;
    setIsLoggedIn(loggedIn);
    setUser(response.data?.user ?? null);
    if (response.error && !isAuthFailureMessage(response.error)) {
      showToast(response.error, "error");
    }
  }, [showToast]);

  // Sync with NextAuth session (primary source when user logs in via NextAuth)
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setApiAuthToken(getSessionBackendToken(session.user));
      const profile = sessionUserToProfile(session.user as Parameters<typeof sessionUserToProfile>[0]);
      setIsLoggedIn(true);
      setUser(profile ?? null);
      return;
    }
    if (status === "unauthenticated") {
      setApiAuthToken(undefined);
      setIsLoggedIn(false);
      setUser(null);
    }
    // when status === "loading", keep current state
  }, [status, session?.user]);

  // Optional: when we have no NextAuth session but had initialAuth from server (backend cookie), keep it
  useEffect(() => {
    if (initialAuth != null && status !== "authenticated") {
      setIsLoggedIn(initialAuth.isLoggedIn);
      setUser(initialAuth.user ?? null);
    }
  }, [initialAuth?.isLoggedIn, initialAuth?.user, status]);

  // Fallback: if no initialAuth, try backend /me once (e.g. if backend cookie exists)
  useEffect(() => {
    if (initialAuth == null && status === "unauthenticated") {
      void refreshAuth();
    }
  }, [initialAuth, status, refreshAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
