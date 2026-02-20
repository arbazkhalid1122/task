"use client";

import Image from "next/image";
import { LuDot } from "react-icons/lu";
import { useTranslations } from 'next-intl';
import { companyProfile } from "../data/constants";
import { useState } from "react";

export default function CompanyProfile() {
  const t = useTranslations();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="card-base mt-8 sm:mt-12 lg:mt-16">
{     isLoggedIn ? <><div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
        <div className="flex gap-3">
          <Image src="/logo.png" alt="company-logo" width={64} height={64} className="flex-shrink-0" />
          <div>
            <h1 className="text-sm font-semibold text-text-heading">{companyProfile.name}</h1>
            <p className="text-xl text-primary-lighter font-bold">{companyProfile.score}</p>
            <p className="text-xs text-text-primary">
              ({companyProfile.reviews}) {t('companyProfile.reviews')} <LuDot className="inline-block text-sm" />({companyProfile.companies}) {t('companyProfile.companies')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Image src="/verify.svg" alt="arrow-right" width={16} height={16} className="flex-shrink-0" />
          <button className="h-9 w-full sm:h-10 sm:w-[162px] btn-primary px-4">
            {t('companyProfile.visitWebsite')}
          </button>
        </div>
      </div>
      <p className="mt-3 text-body-sm leading-[22px] tracking-normal">
        {companyProfile.description}
      </p> </> :
       <div>
        <h1 className="text-[26px] font-semibold text-[#111111] font-inter leading-[36px] tracking-[-0.65px]">
          {t('companyProfile.heading')}
        </h1>
        <p className="mt-3 text-[14px] font-normal text-[#333333] font-inter leading-[22px]">
          {t('companyProfile.description')}
        </p>
        <p className="mt-2 text-[13px] text-[#006633] font-normal font-inter">{t('companyProfile.readMore')}</p>
      </div> }
      <div className="mt-3 bg-primary-bg rounded-md flex items-center px-4 py-3 justify-between gap-3">
       {isLoggedIn ? <div className="flex items-center text-sm leading-[22px] text-text-primary font-light break-words flex-1 min-w-0">
          {companyProfile.notification}
        </div> : <div className="flex gap-6 items-center text-sm leading-[22px] text-text-primary font-light break-words flex-1 min-w-0">
          <Image src="/analytics.png" alt="info" width={16} height={16} className="flex-shrink-0" />
        {t('companyProfile.reviewsAddedToday')}
        </div> }
        <div className="rounded-full bg-bg-white p-2 text-primary w-6 h-6 flex text-[12px] items-center justify-center flex-shrink-0">X</div>
      </div>
      <div className="mt-3 card-light p-4">
        <div className="flex flex-col sm:flex-row h-auto sm:h-10 items-start sm:items-center border-b border-border-light px-3 py-2 sm:py-0 gap-2 sm:gap-0">
          <span className="text-lg font-normal leading-[14px] tracking-normal text-primary-dark sm:mr-4">★★★★★★★☆☆☆</span>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-sm font-normal leading-[14px] tracking-normal text-text-muted font-inter">
              {t('companyProfile.howWouldYouRate')} {'  '}
            </span>
            <span className="text-sm font-semibold leading-[14px] tracking-normal text-primary">
              Companyprofile
            </span>
          </div>
        </div>
        <input
          type="text"
          placeholder={t('companyProfile.reviewTitle')}
          className="py-3 w-full textarea-field text-base"
        />
        <textarea
          placeholder={t('companyProfile.reviewContent')}
          rows={6}
          className="textarea-field mt-3 w-full text-[13px]"
        />
        <button className="h-10 w-full mt-3 rounded-md border border-text-darker bg-text-dark text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98]">
          {t('companyProfile.submitReview')}
        </button>
      </div>
    </div>
  );
}

