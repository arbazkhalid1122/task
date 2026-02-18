import Image from "next/image";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { renderTextWithFirstWordColored } from "../utils/textUtils";
import Separator from "./Separator";

interface ReviewCardProps {
  review: {
    author: string;
    title: string;
    text: string;
    highlighted: boolean;
    score: string;
    rank: number;
  };
  index: number;
}

export default function ReviewCard({ review, index }: ReviewCardProps) {
  return (
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
          <Separator />
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
  );
}

