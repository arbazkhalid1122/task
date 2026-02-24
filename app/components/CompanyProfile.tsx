"use client";

import Image from "next/image";
import { LuDot } from "react-icons/lu";
import { useTranslations } from 'next-intl';
import { companyProfile } from "../data/constants";
import { useState } from "react";
import StarRating from "./StarRating";
import { reviewsApi } from "../../lib/api";
import { createReviewSchema } from "../../lib/validations";
import { safeApiMessage } from "../../lib/apiErrors";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";

const MIN_REVIEW_CONTENT_LENGTH = 20;

interface CompanyProfileProps {
  onReviewSubmitted?: (newReview?: unknown) => void;
}

export default function CompanyProfile({ onReviewSubmitted }: CompanyProfileProps) {
  const t = useTranslations();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = createReviewSchema.safeParse({
      title: reviewTitle,
      content: reviewContent,
      overallScore: rating,
      criteriaScores: { overall: rating },
    });

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? "Validation failed");
      return;
    }

    setSubmitting(true);

    try {
      const response = await reviewsApi.create({
        title: parsed.data.title,
        content: parsed.data.content,
        overallScore: parsed.data.overallScore,
        criteriaScores: parsed.data.criteriaScores ?? { overall: parsed.data.overallScore },
      });

      if (response.error) {
        const msg = safeApiMessage(response.error);
        setError(msg);
        showToast(msg, "error");
      } else {
        setReviewTitle("");
        setReviewContent("");
        setRating(0);
        if (onReviewSubmitted) {
          onReviewSubmitted(response.data);
        }
      }
    } catch (caughtError) {
      const raw = caughtError instanceof Error ? caughtError.message : "An error occurred. Please try again.";
      const msg = safeApiMessage(raw);
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-base mt-8 sm:mt-12 lg:mt-16">
      {isLoggedIn ? (
        <>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
            <div className="flex gap-3">
              <Image src="/logo.png" alt="company-logo" width={64} height={64} className="flex-shrink-0" />
              <div>
                <h1 className="text-sm font-semibold text-text-heading">{companyProfile.name}</h1>
                <p className="text-xl text-primary-lighter font-bold">{companyProfile.score}</p>
                <p className="text-xs text-text-primary">
                  ({companyProfile.reviews}) {t("companyProfile.reviews")} <LuDot className="inline-block text-sm" /> ({companyProfile.companies}) {t("companyProfile.companies")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Image src="/verify.svg" alt="" width={16} height={16} className="flex-shrink-0" />
              <button type="button" className="h-9 w-full sm:h-10 sm:w-[162px] btn-primary px-4">
                {t("companyProfile.visitWebsite")}
              </button>
            </div>
          </div>
          <p className="mt-3 text-body-sm leading-[22px] tracking-normal">{companyProfile.description}</p>
        </>
      ) : (
        <div>
          <h1 className="text-[26px] mt-16 font-semibold text-text-darker font-inter leading-9 tracking-tight">
            {t("companyProfile.heading")}
          </h1>
          <p className="mt-3 text-sm font-normal text-text-primary font-inter leading-[22px]">{t("companyProfile.description")}</p>
          <p className="mt-2 text-[13px] text-green-text font-normal font-inter">{t("companyProfile.readMore")}</p>
        </div>
      )}
      <div className="mt-3 bg-primary-bg rounded-md flex items-center px-4 py-3 justify-between gap-3">
        {isLoggedIn ? (
          <div className="flex items-center text-sm leading-[22px] text-text-primary font-light break-words flex-1 min-w-0">
            {companyProfile.notification}
          </div>
        ) : (
          <div className="flex gap-6 items-center text-sm leading-[22px] text-text-primary font-light break-words flex-1 min-w-0">
            <Image src="/analytics.png" alt="info" width={16} height={16} className="flex-shrink-0" />
            {t("companyProfile.reviewsAddedToday")}
          </div>
        )}
        <div className="rounded-full bg-bg-white p-2 text-primary w-6 h-6 flex text-xs items-center justify-center flex-shrink-0">X</div>
      </div>
      {isLoggedIn && (
        <div className="mt-3 card-light p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row h-auto sm:h-10 items-start sm:items-center border-b border-border-light px-3 py-2 sm:py-0 gap-2 sm:gap-0">
              <StarRating rating={rating} onRatingChange={setRating} maxRating={10} size={18} />
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-sm font-normal leading-[14px] tracking-normal text-text-primary font-inter">
                  {t("companyProfile.howWouldYouRate")} {"  "}
                </span>
                <span className="text-sm font-semibold leading-[14px] tracking-normal text-primary">Companyprofile</span>
              </div>
            </div>
            <input
              type="text"
              placeholder={t("companyProfile.reviewTitle")}
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="py-3 w-full textarea-field text-base"
              required
            />
            <textarea
              placeholder={t("companyProfile.reviewContent")}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              rows={6}
              minLength={MIN_REVIEW_CONTENT_LENGTH}
              className="textarea-field mt-3 w-full text-[13px]"
              required
            />
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-submit-review">
              {submitting ? t("common.auth.processing") : t("companyProfile.submitReview")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
