"use client";
import { useEffect } from "react";
import SectionHeader from "@/components/atoms/SectionHeader";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { cn } from "@/libs/utils";
import { actionScrollToTop } from "@/libs";
import { LOUNGE_RESERVATION_SUB_TAB } from "@/constants";
import CurrentReservation from "@/components/organisms/user/LoungeReservation/CurrentReservation";
import ReservationForm from "@/components/organisms/user/LoungeReservation/ReservationForm";

const LougeReservation = () => {
  const t = useTranslations("loungeReservation");
  const searchParams = useSearchParams();
  const { router } = useNavigation();
  const tab = searchParams.get("sub-tab") ?? LOUNGE_RESERVATION_SUB_TAB.current_reservation;

  const subTab = [
    {
      label: t("subTab.currentReservation"),
      value: LOUNGE_RESERVATION_SUB_TAB.current_reservation,
    },
    {
      label: t("subTab.reservation"),
      value: LOUNGE_RESERVATION_SUB_TAB.reservation,
    },
  ];
  const handleSubTabClick = (value: string) => {
    router.push(`${PAGE.USER_LOUNGE_RESERVATION}?sub-tab=${value}`);
  };
  const renderSubTab = () => {
    return subTab.map((item) => (
      <div
        key={item.value}
        onClick={() => handleSubTabClick(item.value)}
        className={`text-2 flex-1 cursor-pointer py-4 text-center md:border-none ${tab === item.value ? "border-red-primary text-cream" : "border-red-lighter bg-gray333 text-gray999"} border-b-4`}
      >
        {item.label}
      </div>
    ));
  };

  useEffect(() => {
    actionScrollToTop();
  }, []);

  return (
    <>
      <div className="fixed top-[82px] right-0 left-0 z-20 flex bg-black md:hidden">{renderSubTab()}</div>
      <div className="flex flex-col pt-14 md:mx-12 md:pt-16 md:pb-16">
        <div className={cn(tab === "current_reservation" ? "block" : "hidden md:block")}>
          <CurrentReservation />
        </div>
        <div className={cn("mx-6 mt-8 flex flex-col md:mx-0 md:mt-0 md:gap-12", tab === "reservation" ? "flex" : "hidden md:flex")}>
          <SectionHeader title={t("form.title")} className="mt-16 hidden md:block" />
          <p className="text-1 text-cream whitespace-pre-line">{t("form.note")}</p>
          <div className="border-gradient-gold-md md:bg-gray333 rounded-md py-6 md:px-6 md:py-8">
            <ReservationForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default LougeReservation;
