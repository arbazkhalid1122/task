"use client";

import { useTranslations } from "next-intl";

export default function FeedLoading() {
  const t = useTranslations("feed");
  return (
    <div className="min-h-[200px] flex items-center justify-center py-8 text-center text-text-primary" role="status" aria-live="polite">
      {t("loading")}
    </div>
  );
}
