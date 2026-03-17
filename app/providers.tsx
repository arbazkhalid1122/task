"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/lib/contexts/ToastContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import QueryProvider from "@/app/QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
