'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/app/contexts/ToastContext';
import { AuthProvider } from '@/app/contexts/AuthContext';
import PlausibleTracker from '@/app/components/PlausibleTracker';
import type { UserProfile } from '@/lib/types';

export interface InitialAuth {
  isLoggedIn: boolean;
  user: UserProfile | null;
}

export default function Providers({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth?: InitialAuth;
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AuthProvider initialAuth={initialAuth}>
          <PlausibleTracker />
          {children}
        </AuthProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
