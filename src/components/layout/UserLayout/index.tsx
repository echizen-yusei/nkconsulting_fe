"use client";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import LayoutBackground from "@/components/layout/LayoutBackground";
import Tab from "@/components/molecules/Tab/Tab";
import TopContent from "@/components/organisms/user/TopContent/TopContent";
import { sidebarTabs } from "@/constants";
import { useActiveTab } from "@/hooks/useActiveTab";
import { useUserContext } from "@/components/providers/UserProvider";
import LoadingSpinner from "@/components/atoms/Loading";
import { usePathname, useRouter } from "next/navigation";
import { PAGE } from "@/constants/page";
import Header from "@/components/organisms/Header/Header";
import { BreadcrumbItem } from "@/components/molecules/Breadcrumb";

type UserLayoutProps = {
  children: React.ReactNode;
  zIndex?: string;
  isShowFooter?: boolean;
  mobilePaddingBottom?: string;
  breadcrumbCustom?: BreadcrumbItem[] | null;
};

export default function UserLayout({ children, zIndex, isShowFooter = true, mobilePaddingBottom = "pb-8", breadcrumbCustom }: UserLayoutProps) {
  const t = useTranslations("userPage.tabs");
  const pathname = usePathname();
  const router = useRouter();
  const tabParam = useActiveTab();

  const { isLoadingUserInfo, isAllowLoungeReservation } = useUserContext();

  const isLoungeReservationPage = useMemo(() => pathname.includes(PAGE.USER_LOUNGE_RESERVATION) || pathname === PAGE.USER, [pathname]);

  const tabs = useMemo(
    () =>
      sidebarTabs({
        t,
        activeTab: tabParam,
        isReservationPage: isAllowLoungeReservation,
      }),
    [isAllowLoungeReservation, t, tabParam],
  );
  useEffect(() => {
    if (isLoungeReservationPage && !isLoadingUserInfo && !isAllowLoungeReservation) {
      router.replace(PAGE.EVENT_INFORMATION);
    }
  }, [isLoungeReservationPage, isLoadingUserInfo, isAllowLoungeReservation, router]);

  return (
    <LayoutBackground
      isFixedHeader={false}
      minHeight=""
      isShowLoginButton={false}
      isBorderMobile
      isShowFooterMobile={false}
      isShowFooter={isShowFooter}
      zIndex={zIndex}
    >
      <Header isFixed={false} isShowLoginButton={false} isBorderMobile className={`sticky top-0 left-0 md:relative md:top-auto md:left-auto ${zIndex}`} />
      <div className="flex h-full flex-col">
        <div className="hidden md:block">
          <TopContent activeTab={tabParam} breadcrumbCustom={breadcrumbCustom} />
        </div>
        <div className={`relative min-h-[calc(100dvh-82px)] flex-1 ${mobilePaddingBottom} md:min-h-auto md:pt-0 md:pb-0`}>
          <div className="bg-black-custom absolute inset-0 z-[-1]"></div>
          <div className="bg-black-custom sticky top-0 left-0 z-20 w-full">
            <Tab tabs={tabs} activeTab={tabParam} isLoading={isLoadingUserInfo} />
          </div>
          {isLoadingUserInfo && <LoadingSpinner />}
          {isLoungeReservationPage && !isAllowLoungeReservation ? null : children}
        </div>
      </div>
    </LayoutBackground>
  );
}
