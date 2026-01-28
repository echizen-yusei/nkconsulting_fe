import starActiveIcon from "../../public/assets/images/star-active.png";
import starInactiveIcon from "../../public/assets/images/star-inactive.png";
import calendarActiveIcon from "../../public/assets/images/calendar-active.png";
import calendarInactiveIcon from "../../public/assets/images/calendar-inactive.png";
import eventInformationIcon from "../../public/assets/images/event-active.png";
import eventInformationInactiveIcon from "../../public/assets/images/event-inactive.png";
import membershipInformationIcon from "../../public/assets/images/member-active.png";
import membershipInformationInactiveIcon from "../../public/assets/images/member-inactive.png";
import messageIcon from "../../public/assets/images/message-active.png";
import messageInactiveIcon from "../../public/assets/images/message-inactive.png";
import { useTranslations } from "next-intl";
import { ReasonCancellationType } from "@/types/member-cancellation";

export const SCREEN_MOBILE = 768;

export const MEMBERSHIP_PLANS_OPTIONS = [
  {
    label: "経営者会員",
    value: "keieisha",
  },
  {
    label: "法人向け会員",
    value: "houjin",
  },
  {
    label: "特別個人会員",
    value: "tokubetsu_kojin",
  },
  // {
  //   label: "運営法人会員",
  //   value: "unei_houjin",
  // },
  // {
  //   label: "Noriken社員",
  //   value: "noriken_shain",
  // },
];

export const planName = {
  keieisha: "経営者会員",
  tokubetsu_kojin: "特別個人会員",
  unei_houjin: "運営法人会員",
  houjin: "法人向け会員",
  noriken_shain: "Noriken社員",
};

export const planName2 = {
  keieisha: "経営者プラン",
  tokubetsu_kojin: "特別個人会員",
  unei_houjin: "運営法人会員",
  houjin: "法人向け会員",
  noriken_shain: "Noriken社員",
};

export const ONE_YEAR = 365;
export const USER = "user";
export const USER_PLAN_TYPE = "user_plan_type";

export const TAB_TITLE = {
  membershipContent: "membership-content",
  loungeReservation: "lounge-reservation",
  eventInformation: "event-information",
  membershipInformation: "membership-information",
  messages: "messages",
};

export const SCHOOL_NONE_VALUE = "なし";

export const sidebarTabs = ({
  t,
  activeTab,
  isReservationPage,
}: {
  t: ReturnType<typeof useTranslations>;
  activeTab: (typeof TAB_TITLE)[keyof typeof TAB_TITLE];
  isReservationPage: boolean;
}) => [
  ...(isReservationPage
    ? [
        {
          label: t("membershipContent"),
          value: TAB_TITLE.membershipContent,
          icon: activeTab === TAB_TITLE.membershipContent ? starActiveIcon : starInactiveIcon,
          activeIcon: starActiveIcon,
          isActive: activeTab === TAB_TITLE.membershipContent,
        },
        {
          label: t("loungeReservation.title"),
          value: TAB_TITLE.loungeReservation,
          icon: activeTab === TAB_TITLE.loungeReservation ? calendarActiveIcon : calendarInactiveIcon,
          activeIcon: calendarActiveIcon,
          isActive: activeTab === TAB_TITLE.loungeReservation,
        },
      ]
    : []),
  {
    label: t("eventInformation"),
    value: TAB_TITLE.eventInformation,
    icon: activeTab === TAB_TITLE.eventInformation ? eventInformationIcon : eventInformationInactiveIcon,
    activeIcon: eventInformationIcon,
    isActive: activeTab === TAB_TITLE.eventInformation,
  },
  {
    label: t("membershipInformation"),
    value: TAB_TITLE.membershipInformation,
    icon: activeTab === TAB_TITLE.membershipInformation ? membershipInformationIcon : membershipInformationInactiveIcon,
    activeIcon: membershipInformationIcon,
    isActive: activeTab === TAB_TITLE.membershipInformation,
  },
  {
    label: t("messages"),
    value: TAB_TITLE.messages,
    icon: activeTab === TAB_TITLE.messages ? messageIcon : messageInactiveIcon,
    activeIcon: messageIcon,
    isActive: activeTab === TAB_TITLE.messages,
  },
];

export const LOUNGE_RESERVATION_SUB_TAB = {
  current_reservation: "current_reservation",
  reservation: "reservation",
};

export const PLAN_TYPE = {
  keieisha: "keieisha",
  houjin: "houjin",
  tokubetsu_kojin: "tokubetsu_kojin",
  // unei_houjin: "unei_houjin",
  // noriken_shain: "noriken_shain",
};

export const planIsAllowLoungeReservation = [PLAN_TYPE.keieisha, PLAN_TYPE.tokubetsu_kojin];

export const RESERVATION_STATUS = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  cancelled: "cancelled",
  completed: "completed",
};

export const MEMBER_ONLY_CONTENT_TAB = {
  memberOnlyServices: "member-only-service",
  memberOnlyBenefits: "member-only-benefit",
};

export const EVENT_APPLICATION_STATUS = {
  notRegistered: "not_registered",
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  full: "full",
};

export const PER_PAGE = 20;

export const CANCELLATION_REASON_KEYS = [
  ReasonCancellationType.INFREQUENTLY,
  ReasonCancellationType.LITTLE_DEMAND,
  ReasonCancellationType.DIFFERENT_EXPECTED,
  ReasonCancellationType.NOT_COST_EFFECTIVE,
  ReasonCancellationType.BUDGETARY,
  ReasonCancellationType.NOT_EASY_TO_USE,
  ReasonCancellationType.OTHER,
] as const;

export const OTP_RESEND_TIME_SECONDS = 30;

export const PLAN_CAN_UPGRADE = [PLAN_TYPE.tokubetsu_kojin, PLAN_TYPE.houjin];

export const MemberFormSelectFields = [
  "year_of_birth",
  "month_of_birth",
  "day_of_birth",
  "plan_type",
  "elementary_school",
  "elementary_graduation_year",
  "elementary_graduation_month",
  "junior_high_school",
  "junior_high_graduation_year",
  "junior_high_graduation_month",
  "high_school",
  "high_school_graduation_year",
  "high_school_graduation_month",
  "university",
  "university_graduation_year",
  "university_graduation_month",
] as const;
