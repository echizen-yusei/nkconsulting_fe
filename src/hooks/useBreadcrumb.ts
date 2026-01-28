import { usePathname } from "next/navigation";
import { BreadcrumbItem } from "@/components/molecules/Breadcrumb";
import { PAGE } from "@/constants/page";
import { useTranslations } from "next-intl";

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    href?: string;
    icon?: React.ReactNode;
  };
}

export const useBreadcrumbConfig = (): BreadcrumbConfig => {
  const t = useTranslations();

  return {
    "/": {
      label: t("breadcrumb.home"),
      href: PAGE.HOME,
    },
    "/contact": {
      label: t("breadcrumb.contact"),
      href: PAGE.CONTACT,
    },
    "/login": {
      label: t("breadcrumb.login"),
      href: PAGE.LOGIN,
    },
    "/register": {
      label: t("breadcrumb.register"),
      href: PAGE.LOGIN,
    },
    "/register/member": {
      label: t("breadcrumb.registerMember"),
      href: PAGE.REGISTER_MEMBER,
    },
    "/setting-password": {
      label: t("breadcrumb.settingPassword"),
      href: PAGE.SETTING_PASSWORD,
    },
    "/reset-password": {
      label: t("breadcrumb.resetPassword"),
      href: PAGE.RESET_PASSWORD,
    },
    "/user/lounge-reservation": {
      label: t("breadcrumb.loungeReservation"),
      href: PAGE.USER_LOUNGE_RESERVATION,
    },
    "/user/lounge-reservation/complete": {
      label: t("breadcrumb.loungeReservationComplete"),
      href: PAGE.USER_LOUNGE_RESERVATION_COMPLETE,
    },
    "/user/lounge-reservation/cancel": {
      label: t("breadcrumb.loungeReservationCancel"),
      href: PAGE.USER_LOUNGE_RESERVATION_CANCEL,
    },
    "/user/membership-information": {
      label: t("breadcrumb.membershipInformation"),
      href: PAGE.MEMBERSHIP_INFORMATION,
    },
    "/user/membership-information/cancel": {
      label: t("breadcrumb.membershipInformationCancel"),
      href: PAGE.MEMBERSHIP_INFORMATION_CANCEL,
    },
  };
};

export const useBreadcrumb = (isBasePath: boolean): BreadcrumbItem[] => {
  const breadcrumbConfig = useBreadcrumbConfig();
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [];

  if (isBasePath) {
    breadcrumbItems.push({
      label: breadcrumbConfig["/"]?.label || "ホーム",
      href: breadcrumbConfig["/"]?.href || PAGE.HOME,
      icon: breadcrumbConfig["/"]?.icon,
    });
  }

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const config = breadcrumbConfig[currentPath];

    if (config) {
      breadcrumbItems.push({
        label: config.label,
        href: config.href,
        icon: config.icon,
        isActive: index === pathSegments.length - 1,
      });
    }
  });

  return breadcrumbItems;
};

export default useBreadcrumb;
