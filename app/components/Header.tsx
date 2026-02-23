"use client";

import { useTranslations } from 'next-intl';

interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
  const t = useTranslations();

  return (
    <header className="w-full border-b border-border">
      <div className="header-inner">
        <div className="header-brand">{t("header.title")}</div>
        <div className="flex-1 flex justify-center w-full sm:w-auto font-space-grotesk">
          <input type="text" placeholder={t("common.search.placeholder")} className="header-search" />
        </div>
        {isLoggedIn ? (
          <div className="hidden items-center gap-3 text-xs text-[#111111] lg:flex font-inter">
            <span>
              {t("common.greeting.hi")}, <span className="font-bold text-text-dark">{t("common.greeting.companyname")}</span>
            </span>
            <span className="text-[11px] font-semibold transition-transform rotate-90">&gt;</span>
            <span className="avatar" />
          </div>
        ) : (
          <div className="hidden items-center gap-3 text-xs text-text-tertiary lg:flex font-inter">
            <button type="button" className="px-5 py-3 btn-primary">{t("common.auth.signup")}</button>
            <button type="button" className="btn-login-outline">{t("common.auth.login")}</button>
          </div>
        )}
      </div>
    </header>
  );
}
