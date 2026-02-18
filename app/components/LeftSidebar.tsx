"use client";

import { useState } from "react";
import { alerts, sidebarMenuItems, languageItems } from "../data/constants";
import AlertCard from "./AlertCard";
import SidebarMenuItem from "./SidebarMenuItem";
import Separator from "./Separator";

export default function LeftSidebar() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <aside className="space-y-2 px-4 sm:px-0 lg:pr-5 lg:relative lg:after:content-[''] lg:after:absolute lg:after:top-0 lg:after:bottom-0 lg:after:right-0 lg:after:w-[0.5px] lg:after:bg-border lg:after:h-full lg:min-w-[250px] font-inter">
      {alerts.map((alert, index) => (
        <AlertCard key={alert.type} alert={alert} index={index} />
      ))}
      {sidebarMenuItems.map((item) => (
        <SidebarMenuItem
          key={item}
          item={item}
          isActive={activeItem === item}
          onClick={() => setActiveItem(item)}
        />
      ))}
      <Separator />
      {languageItems.map((item) => (
        <SidebarMenuItem
          key={item}
          item={item}
          isActive={activeItem === item}
          onClick={() => setActiveItem(item)}
        />
      ))}
    </aside>
  );
}

