"use client";

import { reviews } from "./data/constants";
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import CompanyProfile from "./components/CompanyProfile";
import ReviewCard from "./components/ReviewCard";
import RightSidebar from "./components/RightSidebar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-bg-white text-foreground">
      <div className="w-full px-4 sm:px-6 lg:px-8 min-h-screen mx-auto max-w-7xl">
        <Header />

        <div className="relative min-h-[calc(100vh-60px)] flex flex-col">
          <main className="mx-auto grid w-full max-w-none grid-cols-1 gap-5 px-0 sm:px-2 lg:px-4 lg:grid-cols-[auto_minmax(0,1fr)_340px] xl:px-0 flex-1">
            <LeftSidebar />

            <section className="space-y-3 mb-140 px-4 sm:px-0 font-inter">
              <CompanyProfile />

              {reviews.map((review, index) => (
                <ReviewCard key={`${review.author}-${index}`} review={review} index={index} />
              ))}
            </section>

            <RightSidebar />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
