"use client";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import Pagination from "@/components/atoms/Pagination";
import SectionHeader from "@/components/atoms/SectionHeader";
import EventItem from "@/components/molecules/EventItem";
import MessageSidebar from "@/components/organisms/user/MessageSiderbar";
import { useUserContext } from "@/components/providers/UserProvider";
import { isEmpty } from "@/libs/utils";
import { useGetEvents } from "@/services/event";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
const PER_PAGE = 20;

const EventInformationPage = () => {
  const t = useTranslations("eventInformation");
  const { isLoadingUserInfo } = useUserContext();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const { data, isLoading, error } = useGetEvents({ page, per_page: PER_PAGE });

  const eventData = data?.data?.event_informations;
  const pagination = data?.data?.pagination.total_pages;
  const handleShowError = useErrorHandler();

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData> });
    }
  }, [error, handleShowError]);

  return (
    <div className="mx-0 my-0 flex flex-wrap gap-12 md:mx-12 md:my-16 xl:flex-nowrap">
      <div className="w-full">
        <SectionHeader title={t("title")} className="hidden md:block" />
        {isLoading && !isLoadingUserInfo ? (
          <div className="relative mt-12 mb-6 flex h-full items-center justify-center">
            <LoadingAtoms />
          </div>
        ) : isEmpty(eventData) && !isLoading ? (
          <p className="text-1 text-cream py-8 text-center md:py-12 md:text-left">{t("noData")}</p>
        ) : (
          <div className="my-12 flex flex-col gap-6 md:gap-12">
            {eventData?.map((item) => (
              <EventItem key={item.id} data={item} />
            ))}
          </div>
        )}

        <div>
          <Pagination totalPages={pagination || 0} />
        </div>
      </div>
      <div className="hidden md:block">
        <MessageSidebar />
      </div>
    </div>
  );
};

export default EventInformationPage;
