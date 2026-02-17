"use client";

import Image from "next/image";
import { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { LuDot } from "react-icons/lu";

export default function Home() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const ratings = [
    { label: "Excellent", value: "75/100" },
    { label: "Good Stuff", value: "4.2/5" },
    { label: "Responsive", value: "8.7/10" },
    { label: "Trusted", value: "9.1/10" },
    { label: "Active", value: "88%" },
  ];

  const reviews = [
    {
      author: "Username",
      title: "Review: Really good stuff this ledger has! x",
      text: "He was a tough challenge. There for 2 years and dealing with constant finance bugs, this is a solid product and the team is responsive.",
      highlighted: false,
      score: "75/10",
    },
    {
      author: "Brand",
      title: "Reply: Really Good Stuff This Ledger Has! x",
      text: "Thank you for your comment. We appreciate it. We hope to keep happy with us and continue to grow together.",
      highlighted: true,
      score: "",
    },
    {
      author: "Username",
      title: "Review: Really good stuff this ledger has! x",
      text: "He was a tough challenge. There for 2 years and dealing with constant finance bugs, this is a solid product and the team is responsive.",
      highlighted: false,
      score: "75/10",
    },
    {
      author: "Username",
      title: "Review: Really Good Stuff This Ledger Has! x",
      text: "He was a tough challenge. There for 2 years and dealing with constant finance bugs, this is a solid product and the team is responsive.",
      highlighted: false,
      score: "75/10",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-8 text-[#2f4444] max-w-6xl mx-auto">
      <div className="mx-auto w-full max-w-none ">
        <header className="mx-auto flex h-[60px] w-full max-w-none items-center gap-5 border-b border-[#dfdfdf] px-8">
          <div className="w-[260px] text-lg font-bold text-[#00a785]">cryptoi</div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reviews, competitors & discussion platforms..."
              className="h-9 min-w-[540px] rounded-sm border border-[#b9d3cd] bg-[#f3f3f3] px-3 text-xs text-black focus:outline-none placeholder:text-black"
            />
          </div>
          <div className="hidden w-[340px] items-center gap-5 text-xs text-[#6b7777] lg:flex">
            <span>Hi, <span className="font-bold text-black">Companyname</span></span>
            <span className="h-7 w-7 rounded border border-[#7db9ad]" />
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-none grid-cols-1 gap-5 px-4 pb-20 pt-6 lg:grid-cols-[auto_minmax(0,1fr)_340px] xl:px-0">
          <aside className="space-y-2">
            <div className="h-14 rounded-sm bg-[#00a785] px-3 py-2 text-xs font-semibold text-white">
              <div className="flex justify-between">
                <span>Trending now:</span>
                <AiOutlineMore className="inline-block text-sm -mr-2" />
              </div>
              <span className="font-normal underline opacity-90">Best Hardware Wallets 2026</span>
            </div>
            <div className="space-y-1 text-xs font-semibold">
            <div className="rounded-sm bg-[#d53d3d] px-3 py-2 pb-3 text-xs text-white">
              <div className="flex justify-between">
                <span>Latest Scam Alert:</span>
                <AiOutlineMore className="inline-block text-sm -mr-2" />
              </div>
              <span className="font-semibold underline">Awax Wallet</span> <span className="font-normal">2.5/10</span>
              <br />
              <span className="font-normal">127 reports in 24hrs</span>
            </div>
            </div>
            {["Exchanges", "Wallets","New Wallets","Top 10 Wallets", "Blacklisted Wallets", "Hardware", "Casinos","Games", "NFT"].map((item) => (
              <div
                key={item}
                onClick={() => setActiveItem(item)}
                className={`flex h-10 cursor-pointer items-center justify-between rounded-sm px-3 text-xs text-[#5a6767] transition-colors ${
                  activeItem === item
                    ? "border-[#b8dcc8] border bg-[#d0ecdf]"
                    : "border-[#d2d7d7] bg-[#f6f7f7] hover:border hover:border-[#d0e5d8] hover:bg-[#edf6f1]"
                }`}
              >
                <span>{item}</span>
                <span className={`text-[11px] font-semibold transition-transform ${activeItem === item ? "rotate-90" : ""}`}>{'>'}</span>
              </div>
            ))}
            <div className="h-[0.5px] mb-4 mt-4 w-full bg-gray-300"></div>
              {["English"].map((item) => (
              <div
                key={item}
                onClick={() => setActiveItem(item)}
                className={`flex h-10 cursor-pointer items-center justify-between rounded-sm px-3 text-xs text-[#5a6767] transition-colors ${
                  activeItem === item
                    ? "border-[#b8dcc8] border bg-[#d0ecdf]"
                    : "border-[#d2d7d7] bg-[#f6f7f7] hover:border hover:border-[#d0e5d8] hover:bg-[#edf6f1]"
                }`}
              >
                <span>{item}</span>
                <span className={`text-[11px] font-semibold transition-transform ${activeItem === item ? "rotate-90" : ""}`}>{'>'}</span>
              </div>
            ))}
          </aside>

          <section className="space-y-3">
            <div className="rounded-sm border border-[#d5dada] bg-white p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Image src="/logo.png" alt="company-logo" width={64} height={64} />
                  <div>
                    <h1 className="text-sm font-semibold text-[#29403f]">Hi Companyprofile</h1>
                    <p className="text-xl text-[#009771] font-bold">9.5/10</p>
                    <p className="text-xs text-black opacity-80 font-semibold">(130) Reviews <LuDot className="inline-block text-sm" />(13) Companies
                    </p>
                  </div>
                </div>
                <button className="rounded bg-[#00a785] px-4 py-1.5 text-xs font-semibold text-white">Visit Website</button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#6d7a7a]">
                Real crypto review community where everyone can warning. Compare exchanges, read reviews and share your
                experience.
              </p>
              <div className="mt-3 h-10 rounded-sm border border-[#d3dedc] bg-[#f1f7f6] px-3 text-xs leading-10 text-[#6d7a7a]">
                Notification line: Green for success and red for fake or warning
              </div>
              <div className="mt-3 rounded-sm border border-[#d5dada]">
                <div className="h-10 border-b border-[#d5dada] bg-[#f8fbfa] px-3 text-xs font-semibold leading-10 text-[#44615f]">
                  Review title: Write your review headline here
                </div>
                <div className="h-20 px-3 pt-3 text-xs text-[#95a2a2]">Description field: Explain your review with as much detail as possible...</div>
                <div className="h-10 bg-[#171717] text-center text-xs font-semibold leading-10 text-white">Submit Review</div>
              </div>
            </div>

            {reviews.map((review, index) => (
              <article
                key={`${review.author}-${index}`}
                className={`rounded-sm border p-4 ${
                  review.highlighted
                    ? "border-[#cbd2f1] bg-[#e5e8f9]"
                    : "border-[#d5dada] bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-sm border border-[#cfd6d6] bg-[#f7f9f9]" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#3a5d5a]">{review.author}</p>
                    <p className="text-sm text-[#6f8a87]">12 hours ago · Category · ProductCategory</p>
                    {review.score ? <p className="mt-1 text-xs font-semibold text-[#00a785]">★★★★★ {review.score}</p> : null}
                    <h3 className="mt-2 text-sm font-semibold text-[#324947]">{review.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#6d7a7a]">{review.text}</p>
                    <p className="mt-3 text-sm text-[#738484]">229 Comments · Share · Report</p>
                  </div>
                  <div className="h-4 w-4 rounded-full border border-[#7ac4b7]" />
                </div>
              </article>
            ))}
          </section>

          <aside className="space-y-3">
            <div className="rounded-sm border border-[#d5dada] bg-white p-3">
              <h3 className="text-xs font-semibold text-[#3a5252]">Need Help</h3>
              <div className="mt-2 space-y-2 text-xs text-[#6d7a7a]">
                {["Test Message 2.0", "Reset Profile", "Change Password", "Add a Competitor", "Support"].map((item) => (
                  <div key={item} className="border-b border-[#e6ecec] pb-1">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-[#d5dada] bg-[#102532] p-3 text-white">
              <h3 className="text-xs font-semibold">Find and title score</h3>
              <div className="mt-2 rounded-sm bg-[#1d3651] p-2 text-xs">
                Ledger New X Mobile
                <p className="mt-1 text-sm text-[#b8d0e6]">9,570 Reviews · 2.0 Companies</p>
              </div>
              <p className="mt-2 text-sm text-[#c5d6e6]">
                Short teaser of this product with a tiny description and icon placement.
              </p>
              <button className="mt-3 h-10 w-full rounded-sm bg-[#00a785] text-xs font-semibold text-white">Visit Website</button>
            </div>

            <div className="rounded-sm border border-[#d5dada] bg-white p-3">
              <h3 className="text-xs font-semibold text-[#3a5252]">Category Scores</h3>
              <div className="mt-2 space-y-2">
                {ratings.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm text-[#6d7a7a]">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="mt-1 h-[3px] w-full bg-[#dfe7e6]">
                      <div className="h-[3px] w-3/4 bg-[#00a785]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>

        <footer className="mt-24 border-t border-[#e2e2e2] py-16 text-center">
          <div className="mx-auto max-w-none px-4 text-left text-lg font-bold text-[#00a785] xl:px-0">cryptoi</div>
          <p className="mt-16 text-sm text-[#9ca8a8]">Copyright © 2020 Bitcoin. All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
}
