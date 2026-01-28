"use client";
import { cn } from "@/libs/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { MEMBER_ONLY_CONTENT_TAB } from "@/constants";
import MemberOnlyBenefits from "@/features/user/member-only-benefits";
import MemberOnlyServices from "@/features/user/member-only-services";
import MessageSidebar from "@/components/organisms/user/MessageSiderbar";

export const UserPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || MEMBER_ONLY_CONTENT_TAB.memberOnlyServices;

  const tabs = [
    {
      id: MEMBER_ONLY_CONTENT_TAB.memberOnlyServices,
      label: "コンサルサービス",
    },
    {
      id: MEMBER_ONLY_CONTENT_TAB.memberOnlyBenefits,
      label: "会員限定特典",
    },
  ];

  const renderTabContent = () => {
    return (
      <>
        <div className={cn(activeTab === MEMBER_ONLY_CONTENT_TAB.memberOnlyServices ? "block md:block" : "hidden md:block")}>
          <MemberOnlyServices />
        </div>
        <div className={cn(activeTab === MEMBER_ONLY_CONTENT_TAB.memberOnlyBenefits ? "block md:block" : "hidden md:block")}>
          <MemberOnlyBenefits />
        </div>
      </>
    );
  };
  return (
    <div>
      <div className="sticky top-[82px] right-0 left-0 z-20 flex bg-black md:hidden">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`text-2 flex-1 cursor-pointer py-4 text-center md:border-none ${activeTab === tab.id ? "border-red-primary text-cream" : "border-red-lighter bg-gray333 text-gray999"} border-b-4`}
            onClick={() => router.push(`/user?tab=${tab.id}`)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col md:mx-12 md:my-16 md:gap-12 lg:flex-row">
        <div className="flex-1">{renderTabContent()}</div>
        <div className="hidden md:block">
          <MessageSidebar />
        </div>
      </div>
    </div>
  );
};
