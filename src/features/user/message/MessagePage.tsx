"use client";
import Pagination from "@/components/atoms/Pagination";
import FixedMobileLayout from "@/components/layout/FixedMobileLayout";
import MessageItem from "@/components/molecules/MessageItem";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { useGetNotifications, useGetNotificationsInfo, useReadNotifications } from "@/services/notification";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { isEmpty } from "@/libs/utils";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import { useUserContext } from "@/components/providers/UserProvider";
import RenderHtml from "@/components/atoms/RenderHtml";
import { actionScrollToTop } from "@/libs";
const PER_PAGE = 20;

const MessagePage = () => {
  const t = useTranslations("notification");
  const { isLoadingUserInfo } = useUserContext();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { router } = useNavigation();
  const [selectedId, setSelectedId] = useState<number | null>(Number(id) || null);
  const isOpen = selectedId === null;
  const page = parseInt(searchParams.get("page") || "1");
  const { data, isLoading, error } = useGetNotifications({ page: page, per_page: PER_PAGE });
  const notificationData = data?.data?.announcements;
  const pagination = data?.data?.pagination.total_pages || 0;
  const handleShowError = useErrorHandler();
  const { data: detailDataResponse, isLoading: isLoadingDetail, error: errorDetail } = useGetNotificationsInfo(selectedId || null);
  const detailData = detailDataResponse?.data?.announcement;
  const { mutate: readNotifications } = useReadNotifications();
  const [isRead, setIsRead] = useState<{ [key: number]: boolean }>({});

  const handleSelect = (id: number, isMobile: boolean) => {
    if (isMobile) {
      actionScrollToTop();
    }

    setSelectedId(id);
    setIsRead({ ...isRead, [id]: true });
  };

  const onBack = () => {
    actionScrollToTop();
    router.push(`${PAGE.MESSAGES}?page=${page}`);
    setSelectedId(null);
  };

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedId(Number(id) || null);
      setIsRead((prev) => ({ ...prev, [Number(id)]: true }));
    } else {
      setSelectedId(null);
    }
  }, [id]);

  useEffect(() => {
    if (detailData && detailData.unread) {
      readNotifications(detailData.id);
    }
  }, [detailData, readNotifications]);

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData> });
    }
  }, [error, handleShowError]);

  useEffect(() => {
    if (errorDetail) {
      handleShowError({ error: errorDetail as AxiosError<ErrorResponseData>, isHandle404: false });
    }
  }, [errorDetail, handleShowError]);

  useEffect(() => {
    const sidebar = document.getElementsByClassName("sidebar");
    if (selectedId) {
      sidebar[0].classList.add("hidden");
    } else {
      sidebar[0].classList.remove("hidden");
    }
  }, [router, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      actionScrollToTop();
    }
  }, [selectedId]);

  return (
    <>
      <div className="flex">
        <div className="bg-gradient-dark-100 hidden max-w-[300px] min-w-[300px] md:block lg:max-w-[400px] lg:min-w-[400px]">
          <div className="message-scroll-container sticky top-[80px] max-h-[calc(100dvh-80px)] min-h-[calc(100dvh-401px)] overflow-y-auto">
            {isLoading && !isLoadingUserInfo ? (
              <div className="relative mt-12 mb-6 flex h-full items-center justify-center">
                <LoadingAtoms />
              </div>
            ) : isEmpty(notificationData) && !isLoading ? (
              <p className="text-1 text-cream px-6 pb-8 text-center md:py-12 md:text-left">{t("noData")}</p>
            ) : (
              <>
                {notificationData?.map((item) => (
                  <MessageItem key={item.id} data={item} onSelect={() => handleSelect(item.id, false)} isRead={isRead} />
                ))}
                <div className="my-6">
                  <Pagination totalPages={pagination} maxVisiblePages={3} />
                </div>
              </>
            )}
          </div>
        </div>
        {isOpen && (
          <div className="block w-full md:hidden">
            <div>
              {isLoading && !isLoadingUserInfo ? (
                <div className="relative my-6 flex h-full items-center justify-center py-6">
                  <LoadingAtoms />
                </div>
              ) : isEmpty(notificationData) && !isLoading ? (
                <p className="text-1 text-cream px-6 py-8 text-center md:py-12 md:text-left">{t("noData")}</p>
              ) : (
                <div className="bg-gradient-dark-100">
                  {notificationData?.map((item) => (
                    <MessageItem key={item.id} data={item} onSelect={() => handleSelect(item.id, true)} isRead={isRead} />
                  ))}
                  <div className={`${pagination > 1 ? "my-6" : "hidden"}`}>
                    <Pagination totalPages={pagination} maxVisiblePages={3} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="hidden flex-1 flex-col md:flex">
          {selectedId ? (
            <>
              {isLoadingDetail && !isLoadingUserInfo && (
                <div className="relative my-6 flex h-full items-center justify-center py-6">
                  <LoadingAtoms />
                </div>
              )}

              {!isLoadingDetail && isEmpty(detailData) && <p className="text-1 text-cream mt-[calc(100dvh/4)] px-6 pb-8 text-center md:py-12">{t("noData")}</p>}

              {!isEmpty(detailData) && (
                <div className="bg-gray333 m-12 rounded-md p-12">
                  <h1 className="heading-2-36 text-cream mb-6">{detailData?.title}</h1>
                  <RenderHtml content={detailData?.content || ""} className="text-cream" />
                </div>
              )}
            </>
          ) : (
            <p className="heading-2-36 text-cream mt-[calc(100dvh/4)] items-center text-center">メッセージを選択してください</p>
          )}
        </div>
      </div>
      {!isOpen && (
        <div className="block md:hidden">
          <FixedMobileLayout title={t("detail")} onBack={onBack} paddingX="px-0" paddingBottom="pb-0">
            <div className="bg-gray333 block min-h-full w-full p-6 md:hidden">
              {isLoadingDetail && !isLoadingUserInfo ? (
                <div className="relative my-6 flex h-full items-center justify-center py-6">
                  <LoadingAtoms />
                </div>
              ) : isEmpty(detailData) && !isLoadingDetail ? (
                <p className="text-1 text-cream mt-[calc(100dvh/4)] px-6 pb-8 text-center md:py-12">{t("noData")}</p>
              ) : (
                <div>
                  <h1 className="heading-2-36 text-cream mb-6">{detailData?.title}</h1>
                  <RenderHtml content={detailData?.content || ""} className="text-cream" />
                </div>
              )}
            </div>
          </FixedMobileLayout>
        </div>
      )}
    </>
  );
};

export default MessagePage;
