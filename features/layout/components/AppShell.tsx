import type { ReactNode } from "react";
import Footer from "@/features/layout/components/Footer";
import Header from "@/features/header/components/Header";
import LeftSidebar from "@/features/layout/components/LeftSidebar";
import RightSidebar from "@/features/layout/components/RightSidebar";

interface AppShellProps {
  children: ReactNode;
  contentClassName?: string;
}

export default function AppShell({ children, contentClassName }: AppShellProps) {
  return (
    <div className="bg-bg-white text-foreground">
      <Header />
      <div className="page-container">
        <div className="page-main-wrap">
          <main className="main-grid">
            <LeftSidebar />
            <section className={contentClassName ?? "content-section"}>{children}</section>
            <RightSidebar />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
