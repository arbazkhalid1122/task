'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/app/contexts/ToastContext';
import { AuthProvider } from '@/app/contexts/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
