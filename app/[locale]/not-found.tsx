"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

/**
 * Rendered when notFound() is called (e.g. invalid route or invalid locale).
 * The `Link` uses a locale-agnostic `/` href; `next-intl` will automatically
 * prefix it with the active locale (e.g. `/en`) based on the current route.
 */
export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-12">
      <h1 className="text-xl font-semibold text-text-dark">{t("pageNotFound")}</h1>
      <p className="max-w-md text-center text-sm text-text-secondary">
        {t("pageNotFoundDescription")}
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
      >
        {t("backToHome")}
      </Link>
    </div>
  );
}

