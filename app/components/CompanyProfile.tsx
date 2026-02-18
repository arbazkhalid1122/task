import Image from "next/image";
import { LuDot } from "react-icons/lu";
import { companyProfile } from "../data/constants";

export default function CompanyProfile() {
  return (
    <div className="rounded-md bg-bg-white mt-8 sm:mt-12 lg:mt-16">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
        <div className="flex gap-3">
          <Image src="/logo.png" alt="company-logo" width={64} height={64} className="flex-shrink-0" />
          <div>
            <h1 className="text-sm font-semibold text-text-heading">{companyProfile.name}</h1>
            <p className="text-xl text-primary-lighter font-bold">{companyProfile.score}</p>
            <p className="text-xs text-text-primary">
              ({companyProfile.reviews}) Reviews <LuDot className="inline-block text-sm" />({companyProfile.companies}) Companies
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Image src="/verify.svg" alt="arrow-right" width={16} height={16} className="flex-shrink-0" />
          <button className="h-9 w-full sm:h-10 sm:w-[162px] rounded bg-primary text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98] px-4">
            Visit Website
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm font-normal leading-[22px] tracking-normal text-text-primary font-inter">
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
            <span className="text-sm font-normal leading-[14px] tracking-normal text-text-muted font-inter">
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
          rows={6}
          className="py-3 mt-3 w-full rounded-md border border-primary-border bg-bg-white px-4 text-[13px] text-text-dark focus:outline-none placeholder:text-text-placeholder"
        />
        <button className="h-10 w-full mt-3 rounded-md border border-text-darker bg-text-dark text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98]">
          Submit Review
        </button>
      </div>
    </div>
  );
}

