import type { ReactNode } from "react";
import AppShell from "@/features/layout/components/AppShell";

interface HomePageClientProps {
  children: ReactNode;
}

export default function HomePageClient({ children }: HomePageClientProps) {
  return <AppShell>{children}</AppShell>;
}
