"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { helpMenuItems, topRatedCards } from "../data/constants";
import Separator from "./Separator";
import TopRatedCard from "./TopRatedCard";
import Toast from "./Toast";
import { authApi } from "../../lib/api";
import { FcGoogle } from "react-icons/fc";

interface RightSidebarProps {
  isLoggedIn: boolean;
}

export default function RightSidebar({ isLoggedIn }: RightSidebarProps) {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const helpMenuTranslations: Record<string, string> = {
    "Read Messages (29)": t('sidebar.readMessages') + " (29)",
    "Eddit Profile": t('sidebar.editProfile'),
    "Change Password": t('sidebar.changePassword'),
    "File An Complaint": t('sidebar.fileComplaint'),
    "Write An Support Ticket (4)": t('sidebar.writeSupportTicket') + " (4)",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isSignup) {
        // Generate username from email (take part before @)
        const username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
        const response = await authApi.register({
          email,
          username,
          password,
        });
        if (response.error) {
          setError(response.error);
          setToast({ message: response.error, type: "error" });
          setSubmitting(false);
        } else {
          setToast({ message: "Account created successfully!", type: "success" });
          setHasAuthenticated(true);
          setSubmitting(false);
          // Session cookie is set by the backend, refresh to reflect login state
          setTimeout(() => {
            router.refresh();
          }, 1000);
        }
      } else {
        const response = await authApi.login({ email, password });
        if (response.error) {
          setError(response.error);
          setToast({ message: response.error, type: "error" });
          setSubmitting(false);
        } else {
          setToast({ message: "Logged in successfully!", type: "success" });
          setHasAuthenticated(true);
          setSubmitting(false);
          // Session cookie is set by the backend, refresh to reflect login state
          setTimeout(() => {
            router.refresh();
          }, 1000);
        }
      }
    } catch (error) {
      const errorMessage = "An error occurred. Please try again.";
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
      setSubmitting(false);
    }
  };

  const handleAuthModeToggle = () => {
    setIsSignup((prev) => !prev);
    setError("");
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
      <aside className="space-y-3 px-4 sm:px-0 lg:pl-5 sidebar-border-left">
      {(isLoggedIn || hasAuthenticated) ? (
        <div className="rounded-md bg-bg-light p-3 text-center sm:text-end px-4 sm:px-14 mt-4">
        <div className="flex items-end justify-end gap-2">
          <h3 className="text-[13px] font-bold text-text-primary text-end font-inter">{t('sidebar.needHelp')}</h3>
          <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
        </div>
        <Separator />
        <div className="mt-2 space-y-2 text-[13px] text-text-quaternary text-center sm:text-end">
          {helpMenuItems.map((item, index, array) => (
            <div key={item}>
              <div className="pb-1 text-center sm:text-end text-text-primary font-normal font-inter">
                {helpMenuTranslations[item] || item}
              </div>
              {index < array.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>
      ) : (
        <div>
          <div className="card-base border border-[#E5E5E5] p-5 mt-4 z-10">
            <h3 className="text-heading-center">{isSignup ? t('common.auth.createAccount') : t('common.auth.signIn')}</h3>
            <p className="text-description mt-2">{isSignup ? t('common.auth.itsFree') : t('common.auth.welcomeBack')}</p>
            <button 
              type="button"
              disabled
              className="flex items-center justify-center gap-2 w-full py-3 mx-auto mt-4 rounded-md border border-[#E5E5E5] bg-[#F0F0F0] text-sm font-semibold text-text-dark opacity-100 cursor-not-allowed"
            >
              <FcGoogle size={21} />
              {t('common.auth.continueWithGoogle')}
            </button>
            <div className="mt-8 mb-8">
              <Separator className="bg-[#E5E5E5]" />
            </div>


            <form onSubmit={handleSubmit} className="">
              <div className="mb-3">
                <label className="text-label mb-2 ml-2">{t('common.auth.emailAddress')}</label>
                <input
                  type="email"
                  placeholder={t('common.auth.enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full input-field border-[#E5E5E5]"
                  required
                />
              </div>
              <div className="mb-3 mt-4">
                <label className="text-label mb-2 ml-2">{t('common.auth.password')}</label>
                <input
                  type="password"
                  placeholder={t('common.auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full input-field border-[#E5E5E5]"
                  required
                />
              </div>
              {error && (
                <p className="text-xs text-alert-red mb-3 text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 h-10 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t('common.auth.processing') : isSignup ? t('common.auth.signUp') : t('common.auth.signIn')}
              </button>
            </form>
          </div>
          <div className="bg-[#F0F0F0] border border-[#E5E5E5] p-4 rounded-b-md -z-1 -mt-2 text-center text-sm">
            {isSignup ? t('common.auth.alreadyHaveAccount') : t('common.auth.dontHaveAccount')}{" "}
            <button
              type="button"
              onClick={handleAuthModeToggle}
              className="text-[#111111] font-semibold text-[13px]"
            >
              {isSignup ? t('common.auth.signIn') : t('common.auth.signUp')}
            </button>
          </div>
        </div>
      )}



      {topRatedCards.map((card, index) => (
        <TopRatedCard key={index} card={card} index={index} />
      ))}
    </aside>
    </>
  );
}
