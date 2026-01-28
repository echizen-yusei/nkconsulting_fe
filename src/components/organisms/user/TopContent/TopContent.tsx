import { customEventTabTitleAtom, userInfoAtom } from "@/atoms/user-atoms";
import Breadcrumb, { BreadcrumbItem } from "@/components/molecules/Breadcrumb";
import { TAB_TITLE } from "@/constants";
import { PAGE } from "@/constants/page";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo, useEffect, useState, useRef, useCallback } from "react";
type TopContentProps = {
  activeTab: string;
  breadcrumbCustom?: BreadcrumbItem[] | null;
};

type DisplayContent = {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  rank: string;
  plan: string;
};

const TopContent = ({ activeTab, breadcrumbCustom }: TopContentProps) => {
  const [userInfo] = useAtom(userInfoAtom);
  const [customEventTabTitle] = useAtom(customEventTabTitleAtom);
  const pathname = usePathname();
  const t = useTranslations("userPage.topContent");
  const t2 = useTranslations("userPage.tabs");
  const [displayContent, setDisplayContent] = useState<DisplayContent>({
    title: "",
    breadcrumbItems: [],
    rank: "",
    plan: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const pageFlags = useMemo(
    () => ({
      isUserPage: pathname === PAGE.USER,
      isReservationPage: pathname === PAGE.USER_LOUNGE_RESERVATION,
      isEventInfoPage: pathname === PAGE.EVENT_INFORMATION,
      isMembershipInfoPage: pathname === PAGE.MEMBERSHIP_INFORMATION,
      isMessagesPage: pathname === PAGE.MESSAGES,
      isBookingCompletePage: pathname === PAGE.USER_LOUNGE_RESERVATION_COMPLETE,
      isBookingCancelPage: pathname === PAGE.USER_LOUNGE_RESERVATION_CANCEL,
      isMembershipInfoCancelPage: pathname === PAGE.MEMBERSHIP_INFORMATION_CANCEL,
    }),
    [pathname],
  );

  const isAutoGenerateBreadcrumb =
    pageFlags.isUserPage ||
    pageFlags.isReservationPage ||
    pageFlags.isEventInfoPage ||
    pageFlags.isMembershipInfoPage ||
    pageFlags.isMessagesPage ||
    pageFlags.isBookingCompletePage ||
    pageFlags.isBookingCancelPage;

  const baseBreadcrumb = useMemo(() => {
    if (pathname.includes(PAGE.EVENT_INFORMATION)) return { label: t("eventInformation"), href: PAGE.EVENT_INFORMATION };
    if (pathname.includes(PAGE.USER_MEMBER_ONLY_BENEFIT) || pathname.includes(PAGE.USER_MEMBER_ONLY_SERVICE))
      return { label: t("membershipContent"), href: PAGE.USER };

    return { label: "", href: "", isActive: false };
  }, [pathname, t]);

  const membershipInfoTitle = useCallback(() => {
    if (pathname.includes(PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN_COMPLETE)) {
      return t("paymentComplete");
    }
    if (pathname.includes(PAGE.MEMBERSHIP_INFORMATION_CANCEL)) {
      return t("membershipInformationCancel");
    }

    return t2("membershipInformation");
  }, [pathname, t2, t]);

  const tabTitle = useMemo(
    () => ({
      [TAB_TITLE.membershipContent]: pageFlags.isUserPage ? t("welcome", { name: userInfo?.full_name ?? "" }) : (customEventTabTitle ?? ""),
      [TAB_TITLE.loungeReservation]: pathname.includes(PAGE.USER_LOUNGE_RESERVATION_CANCEL) ? t2("loungeReservation.cancel") : t2("loungeReservation.title"),
      [TAB_TITLE.eventInformation]: pageFlags.isEventInfoPage ? t2("eventInformation") : (customEventTabTitle ?? ""),
      [TAB_TITLE.membershipInformation]: customEventTabTitle ?? membershipInfoTitle(),
      [TAB_TITLE.messages]: t2("messages"),
    }),
    [pageFlags.isUserPage, pageFlags.isEventInfoPage, t, userInfo?.full_name, customEventTabTitle, pathname, t2, membershipInfoTitle],
  );

  const breadcrumbItems = useMemo(() => {
    if (breadcrumbCustom && breadcrumbCustom.length > 0) return breadcrumbCustom;
    if (pathname.includes(PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN_COMPLETE)) {
      const items: BreadcrumbItem[] = [
        { label: t("membershipInformation"), href: PAGE.MEMBERSHIP_INFORMATION },
        { label: t("additionalFeePayment"), href: PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN },
        { label: t("paymentConfirmation"), href: PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN, isActive: true },
        { label: t("paymentComplete"), href: PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN_COMPLETE, isActive: true },
      ];
      return items;
    }
    if (pathname.includes(PAGE.MEMBERSHIP_INFORMATION_CANCEL)) {
      const items: BreadcrumbItem[] = [
        { label: t("membershipInformation"), href: PAGE.MEMBERSHIP_INFORMATION },
        { label: t("membershipInformationCancel"), href: PAGE.MEMBERSHIP_INFORMATION_CANCEL, isActive: true },
      ];
      return items;
    }
    if (!customEventTabTitle) return [];
    return [baseBreadcrumb, { label: customEventTabTitle ?? "", isActive: true }];
  }, [baseBreadcrumb, breadcrumbCustom, customEventTabTitle, pathname, t]);

  const justCameBackFromHidden = useRef(false);

  // when tab is background → set flag
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        justCameBackFromHidden.current = true;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // original effect — only fix 1 place
  useEffect(() => {
    if (activeTab === TAB_TITLE.membershipContent && pageFlags.isUserPage && !userInfo) return;

    // If tab just came back → NO run animation
    if (justCameBackFromHidden.current) {
      justCameBackFromHidden.current = false; // reset to run normally next time

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayContent({
        title: tabTitle[activeTab] ?? "",
        breadcrumbItems: breadcrumbItems,
        rank: activeTab === TAB_TITLE.membershipContent && pageFlags.isUserPage ? t("membershipRank", { rank: userInfo?.full_name ?? "" }) : "",
        plan: activeTab === TAB_TITLE.membershipContent && pageFlags.isUserPage ? (userInfo?.plan_type ?? "") : "",
      });

      return; // STOP — NO run animation
    }

    // Normally still run animation as before
    setIsAnimating(true);

    const timeout = setTimeout(() => {
      setDisplayContent({
        title: tabTitle[activeTab] ?? "",
        breadcrumbItems: breadcrumbItems,
        rank: activeTab === TAB_TITLE.membershipContent && pageFlags.isUserPage ? t("membershipRank", { rank: userInfo?.full_name ?? "" }) : "",
        plan: activeTab === TAB_TITLE.membershipContent && pageFlags.isUserPage ? (userInfo?.plan_type ?? "") : "",
      });

      setIsAnimating(false);
    }, 280);

    return () => clearTimeout(timeout);
  }, [activeTab, tabTitle, breadcrumbItems, pageFlags.isUserPage, userInfo?.full_name, userInfo?.plan_type, t, userInfo, breadcrumbCustom]);

  return (
    <div className="min-h-[208px]">
      <div className="flex h-full flex-col px-12 pt-[63px] pb-5">
        {userInfo && (
          <>
            <div className="flex h-full flex-wrap items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1
                  key={activeTab}
                  className={`heading-1 text-cream transition-all duration-700 ease-in-out ${
                    isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                  }`}
                >
                  {displayContent.title}
                </h1>
                <Breadcrumb autoGenerate={isAutoGenerateBreadcrumb} isBasePath={false} items={displayContent.breadcrumbItems} />
              </div>

              {activeTab === TAB_TITLE.membershipContent && pageFlags.isUserPage && (
                <div
                  className={`flex items-end gap-[30px] transition-all duration-700 ease-in-out ${
                    isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                  }`}
                >
                  <span className={`${isAnimating ? "wave" : ""} text-1 text-cream`}>{displayContent.rank}</span>
                  <h2 className={`${isAnimating ? "wave" : ""} heading-3-30 text-cream`}>{displayContent.plan}</h2>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopContent;
