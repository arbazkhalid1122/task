"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-12">
      <h1 className="text-xl font-semibold text-text-dark">
        Something went wrong
      </h1>
      <p className="max-w-md text-center text-sm text-text-secondary">
        We couldn’t load this page. Please try again.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-dark hover:bg-bg-lightest"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
