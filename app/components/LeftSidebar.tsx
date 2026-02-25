"use client";

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { alerts, sidebarMenuItems, languageItems } from "../data/constants";
import AlertCard from "./AlertCard";
import SidebarMenuItem from "./SidebarMenuItem";
import Separator from "./Separator";
import { trendingApi } from "../../lib/api";
import { truncateWithEllipsis } from "../utils/textUtils";

export default function LeftSidebar() {
  const t = useTranslations();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [sidebarAlerts, setSidebarAlerts] = useState(() =>
    alerts.map((item) =>
      item.type === "trending"
        ? {
            ...item,
            content: "",
          }
        : item
    )
  );

  const sidebarMenuTranslations: Record<string, string> = {
    "Exchanges": t('sidebar.exchanges'),
    "Wallets": t('sidebar.wallets'),
    "New Wallets": t('sidebar.newWallets'),
    "Top 10 Wallets": t('sidebar.top10Wallets'),
    "Blacklisted Wallets": t('sidebar.blacklistedWallets'),
    "Hardware": t('sidebar.hardware'),
    "Casinos": t('sidebar.casinos'),
    "Games": t('sidebar.games'),
    "NFT": t('sidebar.nft'),
  };

  useEffect(() => {
    let isMounted = true;

    const loadTrending = async () => {
      const response = await trendingApi.get({ period: 'week', limit: 1 });
      if (!isMounted) {
        return;
      }
      if (response.error || !response.data?.trendingNow?.length) {
        setSidebarAlerts((prev) =>
          prev.map((item) =>
            item.type === "trending"
              ? {
                  ...item,
                  content: "",
                }
              : item
          )
        );
        return;
      }

      const trendingItem = response.data.trendingNow[0];
      setSidebarAlerts((prev) =>
        prev.map((item) =>
          item.type === "trending"
            ? {
                ...item,
                content: truncateWithEllipsis(trendingItem.name, 42),
              }
            : item
        )
      );
    };

    void loadTrending();
    const intervalId = setInterval(() => {
      void loadTrending();
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <aside className="sidebar-left sidebar-border-right">
      {sidebarAlerts.map((alert, index) => (
        <AlertCard key={alert.type} alert={alert} index={index} />
      ))}
      {sidebarMenuItems.map((item) => (
        <SidebarMenuItem
          key={item}
          item={sidebarMenuTranslations[item] || item}
          isActive={activeItem === item}
          onClick={() => setActiveItem(item)}
        />
      ))}
      <Separator />
      {languageItems.map((item) => (
        <SidebarMenuItem
          key={item}
          item={t('sidebar.language')}
          isActive={activeItem === item}
          onClick={() => setActiveItem(item)}
        />
      ))}
    </aside>
  );
}
