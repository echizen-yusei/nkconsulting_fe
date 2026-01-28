import { usePathname } from "next/navigation";
import { PAGE } from "@/constants/page";
import { TAB_TITLE } from "@/constants";

export const useActiveTab = (): keyof typeof TAB_TITLE => {
  const pathname = usePathname();

  if (pathname.includes(PAGE.USER_LOUNGE_RESERVATION)) {
    return TAB_TITLE.loungeReservation as keyof typeof TAB_TITLE;
  }

  if (pathname.includes(PAGE.EVENT_INFORMATION)) {
    return TAB_TITLE.eventInformation as keyof typeof TAB_TITLE;
  }

  if (pathname.includes(PAGE.MEMBERSHIP_INFORMATION)) {
    return TAB_TITLE.membershipInformation as keyof typeof TAB_TITLE;
  }

  if (pathname.includes(PAGE.MESSAGES)) {
    return TAB_TITLE.messages as keyof typeof TAB_TITLE;
  }

  return TAB_TITLE.membershipContent as keyof typeof TAB_TITLE;
};
