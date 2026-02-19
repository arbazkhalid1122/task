"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { helpMenuItems, topRatedCards } from "../data/constants";
import Separator from "./Separator";
import TopRatedCard from "./TopRatedCard";
import Toast from "./Toast";
import { authApi } from "../../lib/api";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

interface RightSidebarProps {
  isLoggedIn: boolean;
}

export default function RightSidebar({ isLoggedIn }: RightSidebarProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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
      <aside className="space-y-3 px-4 sm:px-0 lg:pl-5 lg:relative lg:before:content-[''] lg:before:absolute lg:before:top-0 lg:before:bottom-0 lg:before:left-0 lg:before:w-[0.5px] lg:before:bg-border lg:before:h-full">
      {isLoggedIn ? (
        <div className="rounded-md bg-bg-light p-3 text-center sm:text-end px-4 sm:px-14 mt-4">
        <div className="flex items-end justify-end gap-2">
          <h3 className="text-[13px] font-bold text-text-primary text-end font-inter">Need Help</h3>
          <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
        </div>
        <Separator />
        <div className="mt-2 space-y-2 text-[13px] text-text-quaternary text-center sm:text-end">
          {helpMenuItems.map((item, index, array) => (
            <div key={item}>
              <div className="pb-1 text-center sm:text-end text-text-primary font-normal font-inter">
                {item}
              </div>
              {index < array.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>
      ) : (
        <div>
          <div className="rounded-md bg-bg-white border border-[#E5E5E5] p-5 mt-4 z-10">
            <h3 className="text-xl font-semibold text-text-primary font-inter leading-[22px] text-center">
              Create Account
            </h3>
            <p className="text-[13px] font-normal text-text-primary font-inter leading-[22px] text-center mt-2">
              Its free and always will be!
            </p>
            <button 
              type="button"
              disabled
              className="flex items-center gap-2 w-full py-3 mx-auto mt-4 rounded-md border border-[#E5E5E5] bg-[#F0F0F0] text-sm font-semibold text-text-dark opacity-100 cursor-not-allowed"
            >
              <FcGoogle size={21} />
              Continue with Google
            </button>
            <div className="mt-8 mb-8">
              <Separator className="bg-[#E5E5E5]" />
            </div>


            <form onSubmit={handleSubmit} className="">
              <div className="mb-3">
                <label className="block text-[13px] font-semibold text-[#111111] font-inter leading-[13px] mb-2 ml-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 rounded-md border border-[#E5E5E5] bg-bg-white px-4 text-sm text-text-dark focus:outline-none placeholder:text-text-placeholder font-inter"
                  required
                />
              </div>
              <div className="mb-3 mt-4">
                <label className="block text-[13px] font-semibold text-[#111111] font-inter leading-[13px] mb-2 ml-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 rounded-md border border-[#E5E5E5] bg-bg-white px-4 text-sm text-text-dark focus:outline-none placeholder:text-text-placeholder font-inter"
                  required
                />
              </div>
              {error && (
                <p className="text-xs text-alert-red mb-3 text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 h-10 w-full rounded-md bg-primary text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : isSignup ? "Sign up" : "Login"}
              </button>
            </form>
          </div>
          <div className="bg-[#F0F0F0] border border-[#E5E5E5] p-4 rounded-b-md -z-1 -mt-2 text-center text-sm">
            Already have an account? <Link href="/login" className="text-[#111111] font-semibold text-[13px]">Sign in</Link>
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
