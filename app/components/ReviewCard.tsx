"use client";

import Image from "next/image";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useTranslations } from 'next-intl';
import { renderTextWithFirstWordColored } from "../utils/textUtils";
import Separator from "./Separator";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    content: string;
    overallScore: number;
    createdAt: string;
    author?: {
      username: string;
      avatar?: string;
      verified?: boolean;
    };
    company?: {
      name: string;
      category?: string;
    };
    product?: {
      name: string;
    };
    _count?: {
      comments?: number;
      helpfulVotes?: number;
    };
  };
  index: number;
}

export default function ReviewCard({ review, index }: ReviewCardProps) {
  const t = useTranslations();

  // Render stars based on score (0-10 scale)
  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 10 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="text-lg font-bold leading-[14px] tracking-normal text-primary-dark mr-4">
        <span className="text-primary-lighter">{'★'.repeat(fullStars)}</span>
        {hasHalfStar && <span className="text-primary-lighter">★</span>}
        <span className="text-gray-300">{'☆'.repeat(emptyStars)}</span>
        <span className="text-primary-lighter ml-1">{score.toFixed(1)}/10</span>
      </span>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return t('common.time.hoursAgo');
    }
  };

  const authorName = review.author?.username || "Anonymous";
  const commentCount = review._count?.comments || 0;
  const category = review.company?.category || review.product?.name || t('common.review.category');

  return (
    <article
      key={review.id}
      className="rounded-md border border-border-light bg-bg-light p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-2 mt-6 flex-shrink-0">
          <IoMdArrowUp color="#00885E" size={20} />
          <span className="text-sm font-semibold text-text-primary">{review._count?.helpfulVotes || 0}</span>
          <IoMdArrowDown color="#EA580C" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md border border-primary-border bg-bg-white flex-shrink-0 overflow-hidden">
              {review.author?.avatar ? (
                <Image src={review.author.avatar} alt={authorName} width={40} height={40} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-green-text">
                {authorName}
                {review.author?.verified && <span className="ml-1">✓</span>}
              </p>
              <p className="text-xs text-text-primary break-words mt-0.5 flex gap-1 items-center">
                <span className="text-[#333333] opacity-80">{formatTimeAgo(review.createdAt)}</span>
                <span className="text-[#333333] opacity-80">•</span>
                <span className="text-primary font-semibold">
                  {t('common.review.category')} • {t('common.review.productCategory')}
                </span>
              </p>
            </div>
          </div>
          <Separator />
          {renderStars(review.overallScore)}
          <h3 className="mt-2 text-base font-semibold break-words">{renderTextWithFirstWordColored(review.title)}</h3>
          <p className="mt-1 text-[13px] font-normal leading-[22px] text-text-primary tracking-[0.1%] break-words">{review.content}</p>
          <p className="mt-3 text-xs text-text-primary break-words">
            ({commentCount} {t('common.review.comments')}) <LuDot className="inline-block text-sm font-bold text-text-dark" /> {t('common.review.share')}{' '}
            <LuDot className="inline-block text-sm font-bold text-text-dark" /> {t('common.review.report')}
          </p>
        </div>
        <Image src="/verify.svg" alt="arrow-right" width={16} height={16} className="flex-shrink-0" />
      </div>
    </article>
  );
}
