"use client";
import React, { useMemo, useState } from "react";
import { PAGE } from "@/constants/page";
import { useTranslations } from "next-intl";
import Button from "@/components/atoms/Button/Button";
import useNavigation from "@/hooks/useNavigation";
import Image from "next/image";
import listLine from "../../../../public/assets/images/list-line-icon.png";
import { useLogout } from "@/services/login";
import LoadingSpinner from "@/components/atoms/Loading";
import { sidebarTabs, TAB_TITLE } from "@/constants";
import { cn } from "@/libs/utils";
import { useActiveTab } from "@/hooks/useActiveTab";
import { useUserContext } from "@/components/providers/UserProvider";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/atoms/user-atoms";

const Sidebar = () => {
  const { router } = useNavigation();
  const { isLoadingUserInfo, clearUser, isAllowLoungeReservation } = useUserContext();
  const [userInfo] = useAtom(userInfoAtom);
  const t = useTranslations("Header");
  const t2 = useTranslations("userPage.tabs");
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useLogout();
  const tabParam = useActiveTab();
  const tabs = useMemo(
    () => sidebarTabs({ t: t2, activeTab: tabParam, isReservationPage: isAllowLoungeReservation }),
    [t2, tabParam, isAllowLoungeReservation],
  );

  const handleContact = () => {
    router.push(`${PAGE.CONTACT}`);
    toggleMenu();
  };

  const handleLogin = () => {
    router.push(`${PAGE.LOGIN}`);
    toggleMenu();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    toggleMenu();
    mutate(undefined, {
      onSettled: () => {
        clearUser();
        router.refresh();
        router.push(PAGE.LOGIN);
      },
    });
  };
  const handleTabClick = (tab: string) => {
    const tabRouteMap: Record<string, string> = {
      [TAB_TITLE.loungeReservation]: PAGE.USER_LOUNGE_RESERVATION,
      [TAB_TITLE.eventInformation]: PAGE.EVENT_INFORMATION,
      [TAB_TITLE.membershipInformation]: PAGE.MEMBERSHIP_INFORMATION,
      [TAB_TITLE.messages]: PAGE.MESSAGES,
    };
    const route = tabRouteMap[tab] || PAGE.USER;
    router.push(route);
    toggleMenu();
  };
  return (
    <div className="sidebar md:hidden">
      {isPending && <LoadingSpinner />}
      <button onClick={toggleMenu} className="fixed top-6 right-6 z-50 flex cursor-pointer flex-col gap-2" aria-label="Toggle menu">
        <Image
          src={listLine}
          alt=""
          className={`w-12 transition-all duration-300 ${isOpen ? "translate-x-0.5 translate-y-3 rotate-[-135deg]" : "translate-y-0 rotate-0"}`}
          priority
        />
        <Image
          src={listLine}
          alt=""
          className={`w-12 transition-all duration-300 ${isOpen ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"}`}
          priority
        />
        <Image
          src={listLine}
          alt=""
          className={`w-12 transition-all duration-300 ${isOpen ? "translate-x-0.5 -translate-y-3 -rotate-45" : "translate-y-0 rotate-0"}`}
          priority
        />
      </button>

      {isOpen && <div className="fixed inset-0 z-10 bg-black/0 transition-opacity duration-300" onClick={handleOverlayClick} aria-hidden="true" />}

      <div
        className={`bg-black-custom fixed top-0 right-0 bottom-0 z-30 flex h-full min-w-60 flex-col items-center justify-center transition-transform duration-300 ease-in-out md:px-6 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {!isLoadingUserInfo && userInfo && Object.keys(userInfo).length > 0 ? (
          <>
            {isLoadingUserInfo && <LoadingSpinner />}
            <div className="w-full">
              <div className="mb-16 pl-6">
                <div className="text-2 text-cream">{t("userName", { name: userInfo.full_name ?? "" })}</div>
                <div className="text-2 text-cream mt-2">{t("userId", { id: userInfo.member_id ?? "" })}</div>
              </div>
              <div>
                {tabs.map((tab) => (
                  <div
                    key={tab.value}
                    className={cn("flex items-center gap-2 py-4 pl-6", tab.isActive ? "bg-gray333" : "")}
                    onClick={() => handleTabClick(tab.value)}
                  >
                    <Image src={tab.icon} alt={tab.label} width={24} height={24} />
                    <div className="text-cream heading-3-30">{tab.label}</div>
                  </div>
                ))}
              </div>
              <div className="font-noto-serif-jp heading-3-30 text-cream border-cream mt-6 border-t pt-8 pl-6" onClick={handleLogout}>
                {t("logout")}
              </div>
            </div>
          </>
        ) : isLoadingUserInfo ? (
          <LoadingSpinner />
        ) : (
          <>
            <Button
              className="font-noto-serif-jp heading-5 mb-6"
              buttonType="secondary"
              onClick={handleLogin}
              style={{
                padding: "18.5px 12.5px",
              }}
            >
              {t("login")}
            </Button>
            <Button
              className="font-noto-serif-jp heading-5"
              buttonType="primary"
              onClick={handleContact}
              style={{
                padding: "18.55px 36px",
              }}
            >
              {t("contact")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
