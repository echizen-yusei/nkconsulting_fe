import { TAB_TITLE } from "@/constants";
import { PAGE } from "@/constants/page";
import { TabOptionsType } from "@/types/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TabProps = {
  tabs: TabOptionsType[];
  activeTab: string;
  isLoading: boolean;
};

const Tab = ({ tabs, activeTab }: TabProps) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    const tabRouteMap: Record<string, string> = {
      [TAB_TITLE.loungeReservation]: PAGE.USER_LOUNGE_RESERVATION,
      [TAB_TITLE.eventInformation]: PAGE.EVENT_INFORMATION,
      [TAB_TITLE.membershipInformation]: PAGE.MEMBERSHIP_INFORMATION,
      [TAB_TITLE.messages]: PAGE.MESSAGES,
    };
    const route = tabRouteMap[tab] || PAGE.USER;
    router.push(route);
  };

  const getIcon = (tab: TabOptionsType) => {
    const isActiveOrHovered = activeTab === tab.value || hoveredTab === tab.value;
    return isActiveOrHovered && tab.activeIcon ? tab.activeIcon : tab.icon;
  };

  return (
    <div className="border-red-lighter hidden border-b-4 md:block">
      <div className="flex items-center justify-between px-12">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          const isHovered = hoveredTab === tab.value;
          const isActiveOrHovered = isActive || isHovered;

          return (
            <div
              key={tab.value}
              onClick={() => handleTabClick(tab.value)}
              onMouseEnter={() => setHoveredTab(tab.value)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`heading-5 relative flex min-h-[77px] flex-1 items-center justify-center transition-colors ${
                isActiveOrHovered ? "text-cream" : "text-gray-medium"
              } ${isActive ? "before:bg-red-primary cursor-default before:absolute before:right-0 before:bottom-[-4px] before:left-0 before:z-10 before:h-1" : "hover:bg-gray333"} cursor-pointer`}
            >
              <Image src={getIcon(tab)} alt={tab.label} width={24} height={24} />
              <span className="ml-2">{tab.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tab;
