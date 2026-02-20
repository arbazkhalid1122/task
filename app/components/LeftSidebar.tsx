"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { alerts, sidebarMenuItems, languageItems } from "../data/constants";
import AlertCard from "./AlertCard";
import SidebarMenuItem from "./SidebarMenuItem";
import Separator from "./Separator";

export default function LeftSidebar() {
  const t = useTranslations();
  const [activeItem, setActiveItem] = useState<string | null>(null);

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

  return (
    <aside className="space-y-2 px-4 sm:px-0 lg:pr-5 sidebar-border-right lg:min-w-[250px] font-inter">
      {alerts.map((alert, index) => (
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

