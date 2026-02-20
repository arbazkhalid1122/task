"use client";

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border-separator pb-0 pt-8 sm:pt-16 text-center w-full">
      <div className="text-left text-2xl sm:text-3xl font-medium text-primary px-4 sm:px-8 lg:px-8 xl:px-0 mx-auto max-w-7xl font-space-grotesk">
        {t('footer.title')}
      </div>
      <p className="mt-4 text-xs text-text-light py-6 border-t border-border-separator mt-20 sm:mt-40 text-center px-4">
        {t('footer.copyright')}
      </p>
    </footer>
  );
}

