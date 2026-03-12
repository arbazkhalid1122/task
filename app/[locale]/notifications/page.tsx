import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NotificationsPageClient from "@/features/notifications/components/NotificationsPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("notificationsTitle"),
    description: t("notificationsDescription"),
    openGraph: {
      title: t("notificationsTitle"),
      description: t("notificationsDescription"),
    },
  };
}

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}
