"use client";

import { useTranslations } from 'next-intl';
import { MoreVerticalIcon } from "@/shared/components/ui/Icons";

interface AlertCardProps {
  alert: {
    type: string;
    title: string;
    content: string;
    score?: string;
    reports?: string;
    bgColor: string;
    textColor: string;
    height: string;
    padding: string;
    hasScore: boolean;
  };
  index: number;
}

export default function AlertCard({ alert, index }: AlertCardProps) {
  const t = useTranslations();
  
  const getTranslatedTitle = () => {
    if (alert.type === 'trending') {
      return t('alerts.trendingNow');
    } else if (alert.type === 'scam') {
      return t('alerts.latestScamAlert');
    }
    return alert.title;
  };

  const getTranslatedReports = () => {
    if (alert.reports && alert.reports.includes('reports in 24hrs')) {
      return alert.reports.replace('reports in 24hrs', t('alerts.reportsIn24hrs'));
    }
    return alert.reports;
  };

  return (
    <div className={index === 1 ? "space-y-1 text-xs font-semibold" : ""}>
      <div className={`${alert.height} rounded-md ${alert.bgColor} ${alert.padding} text-xs font-semibold ${alert.textColor}`}>
        <div className="flex flex-row flex-nowrap items-start justify-between gap-2">
          <span className="min-w-0 flex-1 break-words">{getTranslatedTitle()}</span>
          <MoreVerticalIcon className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        {alert.hasScore ? (
          <>
            <span className="font-semibold break-words">{alert.content}</span> <span className="font-normal">{alert.score}</span>
            <br />
            <span className="font-normal break-words">{getTranslatedReports()}</span>
          </>
        ) : (
          <span className="font-normal opacity-90 break-words min-h-[18px] inline-block">{alert.content}</span>
        )}
      </div>
    </div>
  );
}
