import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AppShell from "@/features/layout/components/AppShell";
import {
  getServerUserProfileFull,
  getServerProfileReviews,
  getServerProfileComplaints,
} from "@/lib/server-api";
import { getQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import UserProfilePageClient from "./UserProfilePageClient";

interface PageProps {
  params: Promise<{ locale: string; username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, username } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const fallbackTitle = `${username} – ${t("homeTitle")}`;
  const fallbackDescription = t("homeDescription");

  try {
    const cookieStore = await cookies();
    const profile = await getServerUserProfileFull(username, cookieStore.toString());
    const user = profile?.user ?? null;
    const title = user
      ? `@${user.username}${user.bio?.trim() ? ` – ${user.bio.slice(0, 50)}${user.bio.length > 50 ? "…" : ""}` : ""}`
      : fallbackTitle;
    const description =
      (user?.bio && user.bio.trim()) || fallbackDescription;
    const siteUrl =
      typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL
        ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
        : null;
    const avatarUrl =
      user?.avatar && user.avatar.startsWith("http")
        ? user.avatar
        : user?.avatar && siteUrl
          ? `${siteUrl}${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`
          : null;

    return {
      title: title || fallbackTitle,
      description,
      openGraph: {
        title: title || fallbackTitle,
        description,
        ...(avatarUrl && { images: [{ url: avatarUrl, width: 200, height: 200, alt: `@${user?.username}` }] }),
      },
      twitter: {
        card: "summary",
        title: title || fallbackTitle,
        description,
      },
    };
  } catch {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const queryClient = getQueryClient();

  // SSR: fetch profile (may be cached from generateMetadata) + first page of reviews + complaints in parallel
  const [profileData, reviewsData, complaintsData] = await Promise.all([
    getServerUserProfileFull(username, cookieHeader),
    getServerProfileReviews(username, { page: 1 }),
    getServerProfileComplaints(username, { page: 1 }),
  ]);

  if (!profileData?.user) {
    notFound();
  }

  // Prime React Query cache for instant client hydration (no loading flash)
  queryClient.setQueryData(queryKeys.profile(username), profileData);
  queryClient.setQueryData(
    [...queryKeys.profileReviews(username)],
    {
      pages: [
        {
          reviews: reviewsData.reviews,
          pagination: reviewsData.pagination,
        },
      ],
      pageParams: [1],
    }
  );
  queryClient.setQueryData(
    [...queryKeys.profileComplaints(username)],
    {
      pages: [
        {
          complaints: complaintsData.complaints,
          pagination: complaintsData.pagination,
        },
      ],
      pageParams: [1],
    }
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <AppShell>
      <HydrationBoundary state={dehydratedState}>
        <UserProfilePageClient username={username} />
      </HydrationBoundary>
    </AppShell>
  );
}

