"use client";

import Image from "next/image";
import { useState } from "react";
import { topRatedCards } from "../data/constants";
import Separator from "./Separator";
import TopRatedCard from "./TopRatedCard";
import { authApi } from "../../lib/api";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

interface RightSidebarProps {
  isLoggedIn: boolean;
}

export default function RightSidebar({ isLoggedIn }: RightSidebarProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        } else {
          alert("Account created successfully!");
          setEmail("");
          setPassword("");
        }
      } else {
        const response = await authApi.login({ email, password });
        if (response.error) {
          setError(response.error);
        } else {
          alert("Logged in successfully!");
          setEmail("");
          setPassword("");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="space-y-3 px-4 sm:px-0 lg:pl-5 lg:relative lg:before:content-[''] lg:before:absolute lg:before:top-0 lg:before:bottom-0 lg:before:left-0 lg:before:w-[0.5px] lg:before:bg-border lg:before:h-full">
      {isLoggedIn ? (
        <div className="rounded-md bg-bg-light p-4 mt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-bold text-text-primary font-inter">Get Verified</h3>
            <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
          </div>
          <Separator />
          <p className="mt-2 text-[13px] text-text-primary font-inter leading-5">
            Verify your company profile to unlock trust signals and more visibility.
          </p>
          <button className="mt-3 h-10 w-full rounded-md bg-primary text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98]">
            Start Verification
          </button>
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
            <button className="flex items-center gap-2 w-full py-3 mx-auto mt-4 rounded-md border border-[#E5E5E5] bg-[#F0F0F0] text-sm font-semibold text-text-dark opacity-100 transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center">
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
  );
}
