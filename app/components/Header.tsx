"use client";

import { useTranslations } from 'next-intl';

interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
  const t = useTranslations();

  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto flex flex-col sm:flex-row h-auto sm:h-[60px] items-center gap-3 sm:gap-5 justify-between py-3 sm:py-0 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-2xl sm:text-3xl font-medium text-primary w-full sm:w-auto text-center sm:text-left font-space-grotesk">
          {t('header.title')}
        </div>
        <div className="flex-1 flex justify-center w-full sm:w-auto font-space-grotesk">
          <input
            type="text"
            placeholder={t('common.search.placeholder')}
            className="h-9 w-full max-w-[640px] input-base bg-bg-lighter px-3 placeholder:text-text-primary"
          />
        </div>
        {isLoggedIn ? (
          <div className="hidden items-center gap-3 text-xs text-text-tertiary lg:flex font-inter">
            <span>
              {t('common.greeting.hi')}, <span className="font-bold text-text-dark">{t('common.greeting.companyname')}</span>
            </span>
            <span className="text-[11px] font-semibold transition-transform rotate-90">{'>'}</span>
            <span className="h-10 w-10 rounded border border-primary-border" />
          </div>
        ) : (
          <div className="hidden items-center gap-3 text-xs text-text-tertiary lg:flex font-inter">
            <button className="px-5 py-3 btn-primary">{t('common.auth.signup')}</button>
            <button className="px-5 py-3 rounded hover:text-black/50 text-xs font-semibold text-black opacity-100 transition-all active:scale-[0.98]">
              {t('common.auth.login')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
