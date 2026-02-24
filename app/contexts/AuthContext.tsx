"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { useToast } from "@/app/contexts/ToastContext";
import type { UserProfile } from "@/lib/types";

function isAuthFailureMessage(message: string): boolean {
  return /unauthorized|authentication required/i.test(message);
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

  useEffect(() => {
    if (initialAuth != null) {
      setIsLoggedIn(initialAuth.isLoggedIn);
      setUser(initialAuth.user ?? null);
    }
  }, [initialAuth?.isLoggedIn, initialAuth?.user]);

  useEffect(() => {
    if (initialAuth == null) {
      void refreshAuth();
    }
  }, [initialAuth, refreshAuth]);

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
