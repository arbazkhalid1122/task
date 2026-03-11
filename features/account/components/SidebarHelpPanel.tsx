"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { helpMenuKeys } from "@/shared/data/uiContent";
import Separator from "@/shared/components/ui/Separator";
import { Link } from "@/i18n/routing";

const HELP_MENU_ACTIONS: Record<(typeof helpMenuKeys)[number], "messages" | "editProfile" | "changePassword" | "complaint" | "supportTicket"> = {
  readMessages: "messages",
  editProfile: "editProfile",
  changePassword: "changePassword",
  fileComplaint: "complaint",
  writeSupportTicket: "supportTicket",
};

interface SidebarHelpPanelProps {
  onEditProfile: () => void;
  onChangePassword: () => void;
}

export default function SidebarHelpPanel({
  onEditProfile,
  onChangePassword,
}: SidebarHelpPanelProps) {
  const t = useTranslations();

  return (
    <div className="mt-4 rounded-md bg-bg-light p-3 px-4 text-center sm:px-14 sm:text-end">
      <div className="flex items-end justify-end gap-2">
        <h3 className="text-end font-inter text-[13px] font-bold text-text-primary">{t("sidebar.needHelp")}</h3>
        <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
      </div>
      <Separator />
      <div className="mt-2 space-y-2 text-center text-[13px] text-text-quaternary sm:text-end">
        {helpMenuKeys.map((key, index, array) => {
          const label = t(`sidebar.${key}`);
          const action = HELP_MENU_ACTIONS[key];
          return (
            <div key={key}>
              <div className="pb-1 text-center font-inter font-normal text-text-primary sm:text-end">
                {action === "editProfile" ? (
                  <button type="button" onClick={onEditProfile} className="text-left hover:text-primary hover:underline">
                    {label}
                  </button>
                ) : action === "changePassword" ? (
                  <button
                    type="button"
                    onClick={onChangePassword}
                    className="text-left hover:text-primary hover:underline"
                  >
                    {label}
                  </button>
                ) : action === "complaint" ? (
                  <Link href="/complaints" className="hover:text-primary hover:underline">
                    {label}
                  </Link>
                ) : (
                  label
                )}
              </div>
              {index < array.length - 1 && <Separator />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
