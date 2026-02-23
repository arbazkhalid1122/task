"use client";

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border-separator pb-0 pt-8 sm:pt-16 text-center w-full">
      <div className="footer-inner">{t("footer.title")}</div>
      <p className="footer-legal">{t("footer.copyright")}</p>
    </footer>
  );
}

