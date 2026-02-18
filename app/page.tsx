"use client";

import Image from "next/image";
import { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { LuDot } from "react-icons/lu";

export default function Home() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const renderTextWithFirstWordColored = (text: string, restColorClass: string = "text-[#324947]") => {
    const firstSpaceIndex = text.indexOf(" ");
    if (firstSpaceIndex === -1) {
      return <span className={restColorClass}>{text}</span>;
    }
    const firstWord = text.substring(0, firstSpaceIndex);
    const rest = text.substring(firstSpaceIndex);
    return (
      <>
        <span className="text-[#006042]">{firstWord}</span>
        <span className={restColorClass}>{rest}</span>
      </>
    );
  };
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
      score: "7.5/10",
      rank: 156,
    },
    {
      author: "Brand",
      title: "Reply: Really Good Stuff This Ledger Has! x",
      text: "Thank you for your comment. We appreciate it. We hope to keep happy with us and continue to grow together.",
      highlighted: true,
      score: "",
      rank: 12,
    },
    {
      author: "Username",
      title: "Review: Really good stuff this ledger has! x",
      text: "He was a tough challenge. There for 2 years and dealing with constant finance bugs, this is a solid product and the team is responsive.",
      highlighted: false,
      score: "7.5/10",
      rank: 0,
    },
    {
      author: "Username",
      title: "Review: Really Good Stuff This Ledger Has! x",
      text: "He was a tough challenge. There for 2 years and dealing with constant finance bugs, this is a solid product and the team is responsive.",
      highlighted: false,
      score: "75/10",
      rank: 35,
    },
  ];

  return (
    <div className=" bg-white text-[#2f4444]">
      <div className=" w-full px-8 min-h-screen mx-auto max-w-7xl">
        <header className="mx-auto flex h-[60px] items-center gap-5 border-b border-[#dfdfdf] justify-between">
          <div className="text-3xl font-medium text-[#00885E]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>cryptoi</div>
          <div className="flex-1 flex justify-center" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            <input
              type="text"
              placeholder="Search reviews, competitors & discussion platforms..."
              className="h-9 w-full max-w-[640px] rounded-md border border-[#74B795] bg-[#f3f3f3] px-3 text-sm text-black focus:outline-none placeholder:text-[#333333]"
            />
          </div>
          <div className="hidden items-center gap-3 text-xs text-[#6b7777] lg:flex">
            <span>Hi, <span className="font-bold text-black">Companyname</span></span>
            <span className={`text-[11px] font-semibold transition-transform rotate-90`}>{'>'}</span>
            <span className="h-10 w-10 rounded border border-[#74B795]" />
          </div>
        </header>

        <div className="relative min-h-[calc(100vh-60px)] flex flex-col">
          <main className="mx-auto grid w-full max-w-none grid-cols-1 gap-5 px-4 lg:grid-cols-[auto_minmax(0,1fr)_340px] xl:px-0 flex-1">
            <aside className="space-y-2 lg:pr-5 lg:relative lg:after:content-[''] lg:after:absolute lg:after:top-0 lg:after:bottom-0 lg:after:right-0 lg:after:w-[0.5px] lg:after:bg-[#dfdfdf] lg:h-full">
            <div className="h-14 rounded-md bg-[#00885E] px-3 mt-16 py-2 text-xs font-semibold text-white">
              <div className="flex justify-between">
                <span>Trending now:</span>
                <AiOutlineMore className="inline-block text-sm -mr-2" />
              </div>
              <span className="font-normal underline opacity-90">Best Hardware Wallets 2026</span>
            </div>
            <div className="space-y-1 text-xs font-semibold">
              <div className="rounded-md bg-[#BC3E3E] px-3 py-2 pb-3 text-xs text-white">
                <div className="flex justify-between">
                  <span>Latest Scam Alert:</span>
                  <AiOutlineMore className="inline-block text-sm -mr-2" />
                </div>
                <span className="font-semibold underline">Awax Wallet</span> <span className="font-normal">2.5/10</span>
                <br />
                <span className="font-normal">127 reports in 24hrs</span>
              </div>
            </div>
            {["Exchanges", "Wallets", "New Wallets", "Top 10 Wallets", "Blacklisted Wallets", "Hardware", "Casinos", "Games", "NFT"].map((item) => (
              <div
                key={item}
                onClick={() => setActiveItem(item)}
                className={`flex h-10 cursor-pointer items-center justify-between rounded-md px-3 text-xs text-[#5a6767] transition-colors ${activeItem === item
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
                className={`flex h-10 cursor-pointer items-center justify-between rounded-md px-3 text-xs text-[#5a6767] transition-colors ${activeItem === item
                  ? "border-[#b8dcc8] border bg-[#d0ecdf]"
                  : "border-[#d2d7d7] bg-[#f6f7f7] hover:border hover:border-[#d0e5d8] hover:bg-[#edf6f1]"
                  }`}
              >
                <span>{item}</span>
                <span className={`text-[11px] font-semibold transition-transform ${activeItem === item ? "rotate-90" : ""}`}>{'>'}</span>
              </div>
            ))}
          </aside>

          <section className="space-y-3 mb-170">
            <div className="rounded-md bg-white mt-16">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Image src="/logo.png" alt="company-logo" width={64} height={64} />
                  <div>
                    <h1 className="text-sm font-semibold text-[#29403f]">H1 Companyprofile</h1>
                    <p className="text-xl text-[#009771] font-bold">9.5/10</p>
                    <p className="text-xs text-[#333333]">(130) Reviews <LuDot className="inline-block text-sm" />(13) Companies
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
                  <button
                    className="h-9 w-full rounded border border-[#111111] bg-[#00885E] text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98] sm:h-10 sm:w-[162px]"
                  >
                    Visit Website
                  </button>
                </div>
              </div>
              <p
                className="mt-3 text-sm font-normal leading-[22px] tracking-normal text-[#333333]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Real crypto review community where everyone can warning. Compare exchanges, read reviews and share your
                experience.
              </p>
              <div className="mt-3 bg-[#DDEEE5] rounded-md flex items-center px-4 py-3 justify-between">
                <div className="flex items-center  text-sm leading-[22px] text-[#333333] font-light">
                  Notification line: Green for success and red for fake or warning
                </div>
                <div className="rounded-full bg-white p-2 text-[#00885E] w-6 h-6 flex text-[12px] items-center justify-center">X</div>
              </div>
              <div className="mt-3 rounded-md p-4 bg-[#F0F0F0]">
                <div className="flex h-10 items-center border-b border-[#d5dada] px-3">
                  <span className="text-lg font-normal leading-[14px] tracking-normal text-[#006042] mr-4">★★★★★★★☆☆☆</span>
                  <span
                    className="text-sm font-normal leading-[14px] tracking-normal text-[#44615f]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    How would you rate? {'  '}
                  </span>
                  <span className="ml-1 text-sm font-semibold leading-[14px] tracking-normal text-[#00885E]">
                    Companyprofile
                  </span>
                </div>
                <input
                  type="text"

                  placeholder="Review title: Write your review headline here"
                  className="py-3 w-full rounded-md border border-[#74B795] bg-[#FFFFFF] px-4 text-base text-black focus:outline-none placeholder:text-[#A4A4A4]"
                />
                <textarea placeholder="Start typing your review, keep it simple and to the point and always be polied..."
                  rows={4}
                  className="py-3 mt-3 w-full rounded-md border border-[#74B795] bg-[#FFFFFF] px-4 text-base text-black focus:outline-none placeholder:text-[#A4A4A4]" />
                <button className="h-10 w-full mt-3 rounded-md border border-[#111111] bg-[#1A1A1A] text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98]">
                  Submit Review</button>
              </div>
            </div>

            {reviews.map((review, index) => (
              <article
                key={`${review.author}-${index}`}
                className={`rounded-md border p-4 ${review.highlighted
                  ? "border-[#cbd2f1] bg-[#e5e8f9]"
                  : "border-[#d5dada] bg-[#F0F0F0]"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-2 mt-6">
                    <IoMdArrowUp color="#00885E" size={20} />
                    <span className="text-sm font-semibold text-[#333333]">{review.rank}</span>
                    <IoMdArrowDown color="#EA580C" size={20} />

                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">

                      <div className="h-10 w-10 rounded-md border border-[#74B795] bg-[#ffffff]" />
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-[#006633]">{review.author}</p>
                        <p className="text-xs text-[#333333]">12 hours ago <LuDot className="inline-block text-sm font-bold text-black" /> <span className="text-[#00885E] font-semibold">Category <LuDot className="inline-block text-sm  font-bold text-black" /> ProductCategory</span></p>
                      </div>



                    </div>
                    <div className="h-[0.5px] mb-4 mt-4 w-full bg-gray-300"></div>
                    {review.score ? <span className="text-lg text-[#009771] font-bold leading-[14px] tracking-normal text-[#006042] mr-4">★★★★★★★☆☆☆ {review.score}</span> : null}

                    {/* {review.score ? <p className="mt-1 text-xs font-semibold text-[#00a785]">★★★★★ {review.score}</p> : null} */}
                    <h3 className="mt-2 text-base font-semibold">
                      {renderTextWithFirstWordColored(review.title, "text-[#324947]")}
                    </h3>
                    <p className="mt-1 text-[13px] font-normal leading-[22px] text-[#333333] tracking-[0.1%]">
                      {review.text}
                    </p>
                    <p className="mt-3 text-xs text-[#333333]">(26 Comments) <LuDot className="inline-block text-sm font-bold text-black" /> Share <LuDot className="inline-block text-sm font-bold text-black" /> Report</p>
                  </div>
                  <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
                </div>
              </article>
            ))}
          </section>

          <aside className="space-y-3 lg:pl-5 lg:relative lg:before:content-[''] lg:before:absolute lg:before:top-0 lg:before:bottom-0 lg:before:left-0 lg:before:w-[0.5px] lg:before:bg-[#dfdfdf] lg:h-full">
            <div className="rounded-md bg-[#F0F0F0] p-3 text-end px-14 mt-4">
              <div className="flex items-end justify-end gap-2">
                <h3 className="text-[13px] font-bold text-[#333333] text-end" style={{ fontFamily: 'var(--font-inter)' }}>Need Help</h3>
                <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
              </div>
              <div className="h-[0.5px] mb-4 mt-4 w-full bg-gray-300"></div>
              <div className="mt-2 space-y-2 text-[13px] text-[#6d7a7a] text-end">
                {["Read Messages (29)", "Eddit Profile", "Change Password", "File An Complaint", "Write An Support Ticket (4)"].map((item, index, array) => (
                  <div key={item}>
                    <div className="pb-1 text-end text-[#333333] font-normal" style={{ fontFamily: 'var(--font-inter)' }}>
                      {item}
                    </div>
                    {index < array.length - 1 && (
                      <div className="h-[0.5px] mb-4 mt-4 w-full bg-gray-300 text-end"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-[#d5dada] bg-[#011827] text-white">

              <div className="flex items-center justify-between px-4 py-5">
                <h3 className="text-sm font-semibold">Top rated this week</h3>
              </div>

              <div className="space-y-2 p-3 bg-[#232C3A] rounded-t-md">
                <div className="flex items-center justify-start gap-4 ">
                  <div className="flex items-center gap-2 flex-col">
                    <div className="h-10 w-10 rounded-md border border-[#74B795] bg-[#ffffff]" />
                    <div className="bg-[#0033FF] text-[10px] font-bold text-white px-1 py-0.5 rounded-md">Rising</div>
                  </div>

                  <div className="rounded-md flex flex-col gap-1 text-sm font-bold text-white">
                    Ledger New X Mobile
                    <span className="text-lg text-[#34D399] font-bold leading-[14px] tracking-normal mr-4">7.5/10</span>
                    <p className="mt-1 text-xs text-[#FFFFFF] font-normal">(130 Reviews) <LuDot className="inline-block text-sm font-bold" /> (13) Companies </p>

                  </div>
                </div>
                <div className="h-[0.5px] mb-4 mt-4 w-full bg-[#394352]"></div>

                <p className="mt-2 text-[13px] text-white">
                  Short Review of this product which is being
                  advertised here with text and it could be also.
                </p>
                <button className="mt-3 h-10 w-full rounded-md bg-[#00885E] text-xs font-semibold text-white">Visit Website</button>
              </div >
            </div>

            <div className="rounded-md border border-[#d5dada] bg-[#011827] text-white">

              <div className="flex items-center justify-between px-4 py-5">
                <h3 className="text-sm font-semibold">Top rated this week</h3>
              </div>

              <div className="space-y-2 p-3 bg-[#E3E6F8] rounded-t-md">
                <div className="flex items-center  w-full gap-4">
                  <div className="flex items-center gap-2 flex-col">
                    <div className="h-10 w-10 rounded-md border border-[#74B795] bg-[#ffffff]" />
                    <div className="bg-[#E3552E] text-[10px] font-bold text-white px-2 py-1 rounded-md">New</div>
                  </div>

                  <div className="rounded-md flex flex-col gap-1 text-sm font-bold text-[#1A1A1A] flex-1">
                    <div className="flex items-center justify-between w-full">
                      <span>BitPay</span>
                      <Image src="/verify.svg" alt="arrow-right" width={20} height={20} />
                    </div>
                    <span className="text-lg text-[#006F56] font-bold leading-[14px] tracking-normal mr-4">8.0/10</span>
                    <p className="mt-1 text-xs text-[#333333] font-normal">(130 Reviews) <LuDot className="inline-block text-sm font-bold" /> (13) Companies </p>

                  </div>
                </div>
                <div className="h-[0.5px] mb-4 mt-4 w-full bg-[#C3C8E4]"></div>

                <p className="mt-2 text-[13px] text-[#333333]">
                  Short Review of this product which is being
                  advertised here with text and it could be also.
                </p>
                <button className="mt-3 h-10 w-full rounded-md bg-[#00885E] text-xs font-semibold text-white">Visit Website</button>
              </div >
            </div>
          </aside>
          </main>
        </div>

      </div>
      <footer className=" border-t border-[#e2e2e2] pb-0 py-16 text-center w-full">
        <div className=" text-left text-3xl font-medium text-[#00885E] xl:px-0 mx-auto max-w-7xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>cryptoi</div>
        <p className="mt-4 text-xs text-[#999999] py-6 border-t border-[#E5E5E5] mt-40 text-center ">Copyright © 2026 Brand •  All Rights Reserved</p>
      </footer>
    </div>
  );
}
