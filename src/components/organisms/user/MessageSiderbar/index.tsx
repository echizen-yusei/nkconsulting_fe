"use client";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import SectionHeader from "@/components/atoms/SectionHeader";
import MessageSidebarItem from "@/components/molecules/MessageSidebarItem";
import { useUserContext } from "@/components/providers/UserProvider";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { isEmpty } from "@/libs/utils";
import { useGetNotifications } from "@/services/notification";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const MessageSidebar = () => {
  const t = useTranslations("notification");
  const handleShowError = useErrorHandler();
  const { data: notificationDataResponse, isLoading, error: errorNotification } = useGetNotifications({ page: 1, per_page: 4 });
  const notificationData = notificationDataResponse?.data?.announcements;
  const { isLoadingUserInfo } = useUserContext();

  useEffect(() => {
    if (errorNotification) {
      handleShowError({ error: errorNotification as AxiosError<ErrorResponseData> });
    }
  }, [errorNotification, handleShowError]);

  return !isEmpty(notificationData) && !isLoading ? (
    <div className="bg-gray333 sticky top-[141px] max-w-[390px] min-w-[390px] rounded-md px-6 py-12">
      <SectionHeader title={t("title")} textStyle="heading-5" titleClassName="md:ml-2!" />

      {isLoading && !isLoadingUserInfo ? (
        <div className="relative mt-12 mb-6 flex h-full items-center justify-center">
          <LoadingAtoms />
        </div>
      ) : isEmpty(notificationData) && !isLoading ? (
        <p className="text-1 text-cream px-6 pb-8 text-center md:py-12 md:text-left">{t("noData")}</p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {notificationData?.map((item) => (
            <MessageSidebarItem key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="max-w-[390px] min-w-[390px] rounded-md px-6"></div>
  );
};

export default MessageSidebar;
