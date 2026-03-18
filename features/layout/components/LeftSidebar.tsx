"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/routing";
import { alerts, sidebarMenuKeys, languageItems } from "@/shared/data/uiContent";
import AlertCard from "@/shared/components/feedback/AlertCard";
import SidebarMenuItem from "@/shared/components/layout/SidebarMenuItem";
import Separator from "@/shared/components/ui/Separator";
import { useTrendingOverviewQuery } from "@/features/trending/hooks/useTrendingOverviewQuery";
import { truncateWithEllipsis } from "@/shared/utils/text";

type SidebarAlert = (typeof alerts)[number];

export default function LeftSidebar() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const controls = useAnimationControls();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { data } = useTrendingOverviewQuery();

  useEffect(() => {
    if (reduceMotion) return;
    void controls.start({
      opacity: [0.6, 1],
      x: [-6, 0],
      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
    });
  }, [pathname, reduceMotion, controls]);

  const trendingItem = data?.trendingNow?.[0] ?? data?.topRatedThisWeek?.[0] ?? null;
  const sidebarAlerts: SidebarAlert[] = alerts.map((item) =>
    item.type === "trending" && trendingItem
      ? {
          ...item,
          content: truncateWithEllipsis(trendingItem.name, 42),
        }
      : item
  );

  return (
    <motion.aside
      className="sidebar-left sidebar-border-right"
      initial={reduceMotion ? false : { opacity: 0, x: -8 }}
      animate={reduceMotion ? { opacity: 1 } : controls}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: reduceMotion ? undefined : "transform, opacity" }}
    >
      {sidebarAlerts.map((alert, index) => (
        <AlertCard key={`${alert.type}-${index}`} alert={alert} index={index} />
      ))}
      {sidebarMenuKeys.map((key) => (
        <SidebarMenuItem
          key={key}
          item={t(`sidebar.${key}`)}
          isActive={activeItem === key}
          onClick={() => setActiveItem(key)}
        />
      ))}
      <Separator />
      {languageItems.map((item) => (
        <SidebarMenuItem
          key={item}
          item={t("sidebar.language")}
          isActive={activeItem === item}
          onClick={() => setActiveItem(item)}
        />
      ))}
    </motion.aside>
  );
}
