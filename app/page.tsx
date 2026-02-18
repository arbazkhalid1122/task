"use client";

import Image from "next/image";
import { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { LuDot } from "react-icons/lu";

// Data Arrays
const sidebarMenuItems = ["Exchanges", "Wallets", "New Wallets", "Top 10 Wallets", "Blacklisted Wallets", "Hardware", "Casinos", "Games", "NFT"];
const languageItems = ["English"];
const helpMenuItems = ["Read Messages (29)", "Eddit Profile", "Change Password", "File An Complaint", "Write An Support Ticket (4)"];

const alerts = [
  {
    type: "trending",
    title: "Trending now:",
    content: "Best Hardware Wallets 2026",
    bgColor: "bg-primary",
    textColor: "text-white",
    height: "h-14",
    padding: "px-3 mt-16 py-2",
    hasScore: false,
  },
  {
    type: "scam",
    title: "Latest Scam Alert:",
    content: "Awax Wallet",
    score: "2.5/10",
    reports: "127 reports in 24hrs",
    bgColor: "bg-alert-red",
    textColor: "text-white",
    height: "auto",
    padding: "px-3 py-2 pb-3",
    hasScore: true,
  },
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

const topRatedCards = [
  {
    title: "Top rated this week",
    product: {
      name: "Ledger New X Mobile",
      score: "7.5/10",
      reviews: "130 Reviews",
      companies: "13 Companies",
      badge: { text: "Rising", color: "bg-accent-blue" },
      description: "Short Review of this product which is being advertised here with text and it could be also.",
      bgColor: "bg-dark-card",
      textColor: "text-white",
      scoreColor: "text-emerald",
      separatorColor: "bg-border-gray",
    },
  },
  {
    title: "Top rated this week",
    product: {
      name: "BitPay",
      score: "8.0/10",
      reviews: "130 Reviews",
      companies: "13 Companies",
      badge: { text: "New", color: "bg-alert-orange-light" },
      description: "Short Review of this product which is being advertised here with text and it could be also.",
      bgColor: "bg-card-purple-light-bg",
      textColor: "text-text-dark",
      scoreColor: "text-primary-light",
      separatorColor: "bg-card-purple-light-border",
      hasVerify: true,
    },
  },
];

const companyProfile = {
  name: "H1 Companyprofile",
  score: "9.5/10",
  reviews: "130",
  companies: "13",
  description: "Real crypto review community where everyone can warning. Compare exchanges, read reviews and share your experience.",
  notification: "Notification line: Green for success and red for fake or warning",
};

export default function Home() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const renderTextWithFirstWordColored = (text: string, restColorClass: string = "text-text-body") => {
    const firstSpaceIndex = text.indexOf(" ");
    if (firstSpaceIndex === -1) {
      return <span className={restColorClass}>{text}</span>;
    }
    const firstWord = text.substring(0, firstSpaceIndex);
    const rest = text.substring(firstSpaceIndex);
    return (
      <>
        <span className="text-primary-dark">{firstWord}</span>
        <span className={restColorClass}>{rest}</span>
      </>
    );
  };

  const renderSidebarItem = (item: string) => (
    <div
      key={item}
      onClick={() => setActiveItem(item)}
      className={`flex h-10 cursor-pointer items-center justify-between rounded-md px-3 text-xs text-text-secondary transition-colors ${
        activeItem === item
          ? "border-primary-border-active border bg-primary-bg-light"
          : "border-border-lighter bg-bg-lightest hover:border hover:border-primary-border-hover hover:bg-primary-bg-hover"
      }`}
    >
      <span>{item}</span>
      <span className={`text-[11px] font-semibold transition-transform ${activeItem === item ? "rotate-90" : ""}`}>{'>'}</span>
    </div>
  );

  const renderSeparator = (className: string = "bg-gray-300") => (
    <div className={`h-[0.5px] mb-4 mt-4 w-full ${className}`}></div>
  );

  return (
    <div className="bg-bg-white text-foreground">
      <div className="w-full px-4 sm:px-6 lg:px-8 min-h-screen mx-auto max-w-7xl">
        <header className="mx-auto flex flex-col sm:flex-row h-auto sm:h-[60px] items-center gap-3 sm:gap-5 border-b border-border justify-between py-3 sm:py-0">
          <div className="text-2xl sm:text-3xl font-medium text-primary w-full sm:w-auto text-center sm:text-left" style={{ fontFamily: 'var(--font-space-grotesk)' }}>cryptoi</div>
          <div className="flex-1 flex justify-center w-full sm:w-auto" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            <input
              type="text"
              placeholder="Search reviews, competitors & discussion platforms..."
              className="h-9 w-full max-w-[640px] rounded-md border border-primary-border bg-bg-lighter px-3 text-sm text-text-dark focus:outline-none placeholder:text-text-primary"
            />
          </div>
          <div className="hidden items-center gap-3 text-xs text-text-tertiary lg:flex">
            <span>Hi, <span className="font-bold text-text-dark">Companyname</span></span>
            <span className="text-[11px] font-semibold transition-transform rotate-90">{'>'}</span>
            <span className="h-10 w-10 rounded border border-primary-border" />
          </div>
        </header>

        <div className="relative min-h-[calc(100vh-60px)] flex flex-col">
          <main className="mx-auto grid w-full max-w-none grid-cols-1 gap-5 px-0 sm:px-2 lg:px-4 lg:grid-cols-[auto_minmax(0,1fr)_340px] xl:px-0 flex-1">
            <aside className="space-y-2 px-4 sm:px-0 lg:pr-5 lg:relative lg:after:content-[''] lg:after:absolute lg:after:top-0 lg:after:bottom-0 lg:after:right-0 lg:after:w-[0.5px] lg:after:bg-border lg:after:h-full lg:min-w-[250px]">
              {alerts.map((alert, index) => (
                <div key={alert.type} className={index === 1 ? "space-y-1 text-xs font-semibold" : ""}>
                  <div className={`${alert.height} rounded-md ${alert.bgColor} ${alert.padding} text-xs font-semibold ${alert.textColor}`}>
                    <div className="flex justify-between items-start gap-2">
                      <span className="break-words flex-1">{alert.title}</span>
                      <AiOutlineMore className="inline-block text-sm flex-shrink-0" />
                    </div>
                    {alert.hasScore ? (
                      <>
                        <span className="font-semibold break-words">{alert.content}</span> <span className="font-normal">{alert.score}</span>
                        <br />
                        <span className="font-normal break-words">{alert.reports}</span>
                      </>
                    ) : (
                      <span className="font-normal opacity-90 break-words">{alert.content}</span>
                    )}
                  </div>
                </div>
              ))}
              {sidebarMenuItems.map(renderSidebarItem)}
              {renderSeparator()}
              {languageItems.map(renderSidebarItem)}
            </aside>

            <section className="space-y-3 mb-140 px-4 sm:px-0">
              <div className="rounded-md bg-bg-white mt-8 sm:mt-12 lg:mt-16">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
                  <div className="flex gap-3">
                    <Image src="/logo.png" alt="company-logo" width={64} height={64} className="flex-shrink-0" />
                    <div>
                      <h1 className="text-sm font-semibold text-text-heading">{companyProfile.name}</h1>
                      <p className="text-xl text-primary-lighter font-bold">{companyProfile.score}</p>
                      <p className="text-xs text-text-primary">({companyProfile.reviews}) Reviews <LuDot className="inline-block text-sm" />({companyProfile.companies}) Companies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Image src="/verify.svg" alt="arrow-right" width={16} height={16} className="flex-shrink-0" />
                    <button className="h-9 w-full sm:h-10 sm:w-[162px] rounded bg-primary text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98] px-4">
                      Visit Website
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-normal leading-[22px] tracking-normal text-text-primary" style={{ fontFamily: 'var(--font-inter)' }}>
                  {companyProfile.description}
                </p>
                <div className="mt-3 bg-primary-bg rounded-md flex items-center px-4 py-3 justify-between gap-3">
                  <div className="flex items-center text-sm leading-[22px] text-text-primary font-light break-words flex-1 min-w-0">
                    {companyProfile.notification}
                  </div>
                  <div className="rounded-full bg-bg-white p-2 text-primary w-6 h-6 flex text-[12px] items-center justify-center flex-shrink-0">X</div>
                </div>
                <div className="mt-3 rounded-md p-4 bg-bg-light">
                  <div className="flex flex-col sm:flex-row h-auto sm:h-10 items-start sm:items-center border-b border-border-light px-3 py-2 sm:py-0 gap-2 sm:gap-0">
                    <span className="text-lg font-normal leading-[14px] tracking-normal text-primary-dark sm:mr-4">★★★★★★★☆☆☆</span>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-sm font-normal leading-[14px] tracking-normal text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                        How would you rate? {'  '}
                      </span>
                      <span className="text-sm font-semibold leading-[14px] tracking-normal text-primary">
                        Companyprofile
                      </span>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Review title: Write your review headline here"
                    className="py-3 w-full rounded-md border border-primary-border bg-bg-white px-4 text-base text-text-dark focus:outline-none placeholder:text-text-placeholder"
                  />
                  <textarea
                    placeholder="Start typing your review, keep it simple and to the point and always be polied..."
                    rows={4}
                    className="py-3 mt-3 w-full rounded-md border border-primary-border bg-bg-white px-4 text-base text-text-dark focus:outline-none placeholder:text-text-placeholder"
                  />
                  <button className="h-10 w-full mt-3 rounded-md border border-text-darker bg-text-dark text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98]">
                    Submit Review
                  </button>
                </div>
              </div>

              {reviews.map((review, index) => (
                <article
                  key={`${review.author}-${index}`}
                  className={`rounded-md border p-4 ${
                    review.highlighted
                      ? "border-card-purple-border bg-card-purple-bg"
                      : "border-border-light bg-bg-light"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-2 mt-6 flex-shrink-0">
                      <IoMdArrowUp color="#00885E" size={20} />
                      <span className="text-sm font-semibold text-text-primary">{review.rank}</span>
                      <IoMdArrowDown color="#EA580C" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md border border-primary-border bg-bg-white flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-semibold text-green-text">{review.author}</p>
                          <p className="text-xs text-text-primary break-words">
                            12 hours ago <LuDot className="inline-block text-sm font-bold text-text-dark" />{' '}
                            <span className="text-primary font-semibold">
                              Category <LuDot className="inline-block text-sm font-bold text-text-dark" /> ProductCategory
                            </span>
                          </p>
                        </div>
                      </div>
                      {renderSeparator()}
                      {review.score && (
                        <span className="text-lg text-primary-lighter font-bold leading-[14px] tracking-normal text-primary-dark mr-4">
                          ★★★★★★★☆☆☆ {review.score}
                        </span>
                      )}
                      <h3 className="mt-2 text-base font-semibold break-words">{renderTextWithFirstWordColored(review.title)}</h3>
                      <p className="mt-1 text-[13px] font-normal leading-[22px] text-text-primary tracking-[0.1%] break-words">{review.text}</p>
                      <p className="mt-3 text-xs text-text-primary break-words">
                        (26 Comments) <LuDot className="inline-block text-sm font-bold text-text-dark" /> Share{' '}
                        <LuDot className="inline-block text-sm font-bold text-text-dark" /> Report
                      </p>
                    </div>
                    <Image src="/verify.svg" alt="arrow-right" width={16} height={16} className="flex-shrink-0" />
                  </div>
                </article>
              ))}
            </section>

            <aside className="space-y-3 px-4 sm:px-0 lg:pl-5 lg:relative lg:before:content-[''] lg:before:absolute lg:before:top-0 lg:before:bottom-0 lg:before:left-0 lg:before:w-[0.5px] lg:before:bg-border lg:before:h-full">
              <div className="rounded-md bg-bg-light p-3 text-center sm:text-end px-4 sm:px-14 mt-4">
                <div className="flex items-end justify-end gap-2">
                  <h3 className="text-[13px] font-bold text-text-primary text-end" style={{ fontFamily: 'var(--font-inter)' }}>Need Help</h3>
                  <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
                </div>
                {renderSeparator()}
                <div className="mt-2 space-y-2 text-[13px] text-text-quaternary text-center sm:text-end">
                  {helpMenuItems.map((item, index, array) => (
                    <div key={item}>
                      <div className="pb-1 text-center sm:text-end text-text-primary font-normal" style={{ fontFamily: 'var(--font-inter)' }}>
                        {item}
                      </div>
                      {index < array.length - 1 && renderSeparator()}
                    </div>
                  ))}
                </div>
              </div>

              {topRatedCards.map((card, index) => (
                <div key={index} className="rounded-md border border-border-light bg-dark-bg text-white">
                  <div className="flex items-center justify-between px-4 py-5">
                    <h3 className="text-sm font-semibold">{card.title}</h3>
                  </div>
                  <div className={`space-y-2 p-3 ${card.product.bgColor} rounded-t-md`}>
                    <div className="flex items-start sm:items-center w-full gap-4">
                      <div className="flex items-center gap-2 flex-col flex-shrink-0">
                        <div className="h-10 w-10 rounded-md border border-primary-border bg-bg-white" />
                        <div className={`${card.product.badge.color} text-[10px] font-bold text-white ${index === 0 ? 'px-1 py-0.5' : 'px-2 py-1'} rounded-md`}>
                          {card.product.badge.text}
                        </div>
                      </div>
                      <div className={`rounded-md flex flex-col gap-1 text-sm font-bold ${card.product.textColor} ${index === 1 ? 'flex-1 min-w-0' : 'min-w-0'}`}>
                        {index === 1 ? (
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="break-words">{card.product.name}</span>
                            <Image src="/verify.svg" alt="arrow-right" width={20} height={20} className="flex-shrink-0" />
                          </div>
                        ) : (
                          <div className="break-words">{card.product.name}</div>
                        )}
                        <span className={`text-lg ${card.product.scoreColor} font-bold leading-[14px] tracking-normal sm:mr-4`}>
                          {card.product.score}
                        </span>
                        <p className={`mt-1 text-xs ${card.product.textColor} font-normal break-words`}>
                          ({card.product.reviews}) <LuDot className="inline-block text-sm font-bold" /> ({card.product.companies}) Companies
                        </p>
                      </div>
                    </div>
                    <div className={`h-[0.5px] mb-4 mt-4 w-full ${card.product.separatorColor}`}></div>
                    <p className={`mt-2 text-[13px] ${card.product.textColor} break-words`}>{card.product.description}</p>
                    <button className="mt-3 h-10 w-full rounded-md bg-primary text-xs font-semibold text-white">
                      Visit Website
                    </button>
                  </div>
                </div>
              ))}
            </aside>
          </main>
        </div>
      </div>
      <footer className="border-t border-border-separator pb-0 pt-8 sm:pt-16 text-center w-full">
        <div className="text-left text-2xl sm:text-3xl font-medium text-primary px-4 sm:px-8 lg:px-8 xl:px-0 mx-auto max-w-7xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          cryptoi
        </div>
        <p className="mt-4 text-xs text-text-light py-6 border-t border-border-separator mt-20 sm:mt-40 text-center px-4">
          Copyright © 2026 Brand • All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
