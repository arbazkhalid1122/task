import Image from "next/image";
import { helpMenuItems, topRatedCards } from "../data/constants";
import Separator from "./Separator";
import TopRatedCard from "./TopRatedCard";

export default function RightSidebar() {
  return (
    <aside className="space-y-3 px-4 sm:px-0 lg:pl-5 lg:relative lg:before:content-[''] lg:before:absolute lg:before:top-0 lg:before:bottom-0 lg:before:left-0 lg:before:w-[0.5px] lg:before:bg-border lg:before:h-full">
      <div className="rounded-md bg-bg-light p-3 text-center sm:text-end px-4 sm:px-14 mt-4">
        <div className="flex items-end justify-end gap-2">
          <h3 className="text-[13px] font-bold text-text-primary text-end font-inter">Need Help</h3>
          <Image src="/verify.svg" alt="arrow-right" width={16} height={16} />
        </div>
        <Separator />
        <div className="mt-2 space-y-2 text-[13px] text-text-quaternary text-center sm:text-end">
          {helpMenuItems.map((item, index, array) => (
            <div key={item}>
              <div className="pb-1 text-center sm:text-end text-text-primary font-normal font-inter">
                {item}
              </div>
              {index < array.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>

      {topRatedCards.map((card, index) => (
        <TopRatedCard key={index} card={card} index={index} />
      ))}
    </aside>
  );
}

