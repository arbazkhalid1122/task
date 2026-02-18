import { AiOutlineMore } from "react-icons/ai";

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
  return (
    <div className={index === 1 ? "space-y-1 text-xs font-semibold" : ""}>
      <div className={`${alert.height} rounded-md ${alert.bgColor} ${alert.padding} text-xs font-semibold ${alert.textColor}`}>
        <div className="flex justify-between items-start gap-2">
          <span className="break-words flex-1">{alert.title}</span>
          <AiOutlineMore className="inline-block text-sm flex-shrink-0" />
        </div>
        {alert.hasScore ? (
          <>
            <span className="font-semibold break-words">{alert.content}</span> <span className="font-normal">{alert.score}</span>
            <br />
            <span className="font-normal break-words">{alert.reports}</span>
          </>
        ) : (
          <span className="font-normal opacity-90 break-words">{alert.content}</span>
        )}
      </div>
    </div>
  );
}

