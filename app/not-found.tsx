import { routing, Link } from "@/i18n/routing";

// Root-level 404 for non-locale routes like `/ok`.
// Also acts as a safety net if the locale-specific 404 isn't used.
export default function RootNotFound() {
  const homeHref = `/${routing.defaultLocale}`;

  return (
    <html lang={routing.defaultLocale} suppressHydrationWarning>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-12">
          <h1 className="text-xl font-semibold text-text-dark">Page not found</h1>
          <p className="max-w-md text-center text-sm text-text-secondary">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
          <Link
            href={homeHref}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}

