"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import CalendarIcon from "../../../../../public/assets/images/calendar-icon.png";
import PlaceIcon from "../../../../../public/assets/images/place-icon.png";
import SectionHeader from "@/components/atoms/SectionHeader";
import { formatTime12Hour, handleCurrency } from "@/libs";
import Button from "@/components/atoms/Button/Button";
import FixedMobileLayout from "@/components/layout/FixedMobileLayout";
import useNavigation from "@/hooks/useNavigation";
import { PAGE } from "@/constants/page";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useGetEventInfo, useJoinEvent } from "@/services/event";
import { EventDetailInfo } from "@/types/event-information";
import { useUserContext } from "@/components/providers/UserProvider";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import { cn, isAfterCurrentTime, isEmpty } from "@/libs/utils";
import NoImage from "../../../../../public/assets/images/no-image.jpg";
import { toast } from "sonner";
import LoadingSpinner from "@/components/atoms/Loading";
import { useEffect, useMemo, useState } from "react";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";
import { EVENT_APPLICATION_STATUS } from "@/constants";
import { customEventTabTitleAtom } from "@/atoms/user-atoms";
import { useAtom } from "jotai";
import RenderHtml from "@/components/atoms/RenderHtml";

const EventInformationDetail = () => {
  const t = useTranslations("eventInformation");
  const { router } = useNavigation();
  const { id } = useParams();
  const { data, isLoading, error } = useGetEventInfo(Number(id));
  const { isLoadingUserInfo } = useUserContext();
  const eventData: EventDetailInfo | undefined = data?.data?.event_information;
  const searchParams = useSearchParams();
  const prevPage = searchParams.get("prev");
  const decodedPrev = decodeURIComponent(prevPage || "");
  const { mutate: joinEvent, isPending: isJoiningEvent } = useJoinEvent();
  const handleShowError = useErrorHandler();
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [, setCustomEventTabTitle] = useAtom(customEventTabTitleAtom);
  const currentStatus = useMemo(() => {
    return localStatus || eventData?.status || EVENT_APPLICATION_STATUS.notRegistered;
  }, [localStatus, eventData?.status]);

  const isAfterTargetDate = isAfterCurrentTime(`${eventData?.target_date} ${eventData?.end_time}`);

  const handleJoinEvent = () => {
    joinEvent(Number(id), {
      onSuccess: () => {
        toast.success(t("responseMessage.joinEventSuccess"));
        setLocalStatus(EVENT_APPLICATION_STATUS.pending);
      },
      onError: (err) => {
        handleShowError({ error: err as AxiosError<ErrorResponseData> });
      },
    });
  };

  const onBack = () => {
    router.push(decodedPrev || PAGE.EVENT_INFORMATION);
  };

  const isShowJoinButton = [EVENT_APPLICATION_STATUS.notRegistered, EVENT_APPLICATION_STATUS.pending, EVENT_APPLICATION_STATUS.rejected].includes(
    currentStatus as string,
  );
  const isDisabledJoinButton = currentStatus !== EVENT_APPLICATION_STATUS.notRegistered;
  const isShowFullButton = currentStatus === EVENT_APPLICATION_STATUS.full;
  const isShowJoinedButton = currentStatus === EVENT_APPLICATION_STATUS.approved;

  useEffect(() => {
    if (eventData?.title) {
      setCustomEventTabTitle(eventData?.title);
    }
    return () => {
      setCustomEventTabTitle(null);
    };
  }, [eventData?.title, setCustomEventTabTitle]);

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData>, isHandle404: false });
    }
  }, [error, handleShowError]);

  return (
    <>
      {isJoiningEvent && <LoadingSpinner />}
      <div className="mx-3 my-8 hidden gap-12 md:mx-12 md:my-16 md:flex">
        {isLoading && !isLoadingUserInfo ? (
          <div className="relative mt-12 mb-6 flex h-full w-full items-center justify-center">
            <LoadingAtoms />
          </div>
        ) : isEmpty(eventData) && !isLoading ? (
          <p className="text-1 text-cream px-6 pb-8 text-center md:py-12 md:text-left"> {t("noData")}</p>
        ) : (
          <>
            {eventData ? (
              <>
                <div className="w-full">
                  <div className="relative aspect-video w-full rounded-md">
                    <Image src={eventData.thumbnail || NoImage} quality={80} alt={eventData.title} fill className="rounded-md object-cover" />
                  </div>
                  <div className="border-cream mt-2 flex items-center gap-4 border-b py-4">
                    <Image src={CalendarIcon} alt="calendar-icon" width={29} height={29} />
                    <p className="heading-5 text-cream">{eventData.target_date}</p>
                    <p className="heading-5 text-cream">{formatTime12Hour(eventData.start_time, eventData.end_time)}</p>
                  </div>
                  <div className="border-cream mt-2 flex items-start gap-4 border-b py-4">
                    <Image src={PlaceIcon} alt="place-icon" width={29} height={29} />
                    <div className="flex flex-wrap gap-2">
                      <p className="heading-5 text-cream">{eventData.venue_name}</p>
                      <Link href={eventData.venue_address_url} target="_blank" className="text-1 text-cream hover:underline">
                        {eventData.venue_address}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-12 mb-6">
                    <SectionHeader title={t("eventInformationDetail")} />
                    <RenderHtml content={eventData.content} className="text-cream mt-6" />
                  </div>
                </div>
                {isAfterTargetDate && (
                  <div className="bg-cream sticky top-[133px] h-fit max-w-[390px] min-w-[390px] rounded-md p-6">
                    <div className="flex justify-between gap-2">
                      <p className="heading-5 whitespace-pre">{t("capacityDetail", { capacity: eventData.capacity })}</p>
                      <p className="heading-5 whitespace-pre">{t("participantsDetail", { participants: eventData.excepted_number_of_participants })}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <p className="heading-5">{t("feeDetail")}</p>
                      <p className="heading-5">{handleCurrency(Number(eventData.participant_fee))}</p>
                    </div>
                    {isShowJoinButton && (
                      <Button className="heading-5 mt-6 w-full" buttonType="secondary" onClick={handleJoinEvent} isDisabled={isDisabledJoinButton}>
                        {t("joinText")}
                      </Button>
                    )}
                    {isShowFullButton && <p className="heading-5 mt-6 border-0! px-0! py-0! text-center">{t("fullSlotText")}</p>}
                    {isShowJoinedButton && <p className="heading-5 mt-6 border-0! px-0! py-0! text-center">{t("joinedText")}</p>}
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      <FixedMobileLayout
        title={t("eventInformationDetail")}
        onBack={onBack}
        supHeaderContent={
          eventData ? (
            <>
              {isShowFullButton || isShowJoinedButton ? (
                <div className="bg-cream flex items-center justify-center gap-6 px-6 py-4">
                  {isShowFullButton && <p className="heading-5 border-0! px-0! py-0! text-center">{t("fullSlotText")}</p>}
                  {isShowJoinedButton && <p className="heading-5 border-0! px-0! py-0! text-center">{t("joinedText")}</p>}
                </div>
              ) : (
                isAfterTargetDate && (
                  <div className="bg-cream flex justify-between gap-6 px-6 py-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-2">{t("capacityDetailSp")}</p>
                        <p className="text-2">
                          {eventData.capacity}
                          {t("capacitySuffix")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2">{t("participantsDetailSp")}</p>
                        <p className="text-2">
                          {eventData.excepted_number_of_participants}
                          {t("capacitySuffix")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2">{t("feeDetail")}</p>
                        <p className="text-2">{handleCurrency(Number(eventData.participant_fee))}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button className="heading-5" buttonType="secondary" onClick={handleJoinEvent} isDisabled={isDisabledJoinButton}>
                        {t("joinText")}
                      </Button>
                    </div>
                  </div>
                )
              )}
            </>
          ) : (
            <></>
          )
        }
      >
        <div className={cn("w-full", isShowFullButton || isShowJoinedButton ? "mt-[84px]" : isAfterTargetDate ? "mt-[129px]" : "mt-8")}>
          {isLoading && !isLoadingUserInfo ? (
            <div className="relative mt-12 mb-6 flex h-full w-full items-center justify-center">
              <LoadingAtoms />
            </div>
          ) : isEmpty(eventData) && !isLoading ? (
            <p className="text-1 text-cream px-6 pb-8 text-center md:py-12 md:text-left">{t("noData")}</p>
          ) : (
            <>
              {eventData ? (
                <>
                  <div className="relative aspect-video w-full rounded-md">
                    <Image src={eventData.thumbnail || NoImage} quality={80} alt={eventData.title} fill className="rounded-md object-cover" />
                  </div>
                  <p className="heading-2-36 text-cream mt-4">{eventData.title}</p>
                  <div className="border-cream mt-2 flex items-center gap-2 border-b py-1">
                    <Image src={CalendarIcon} alt="calendar-icon" width={26} height={26} />
                    <p className="text-1 text-cream">{eventData.target_date}</p>
                    <p className="text-1 text-cream">{formatTime12Hour(eventData.start_time, eventData.end_time)}</p>
                  </div>
                  <div className="border-cream mt-2 flex items-start gap-2 border-b py-1">
                    <Image src={PlaceIcon} alt="place-icon" width={26} height={26} />
                    <div className="flex flex-wrap gap-2">
                      <p className="text-1 text-cream">{eventData.venue_name}</p>
                      <Link href={eventData.venue_address_url} target="_blank" className="text-1 text-cream hover:underline">
                        {eventData.venue_address}
                      </Link>
                    </div>
                  </div>
                  <div className="my-6">
                    <SectionHeader title={t("eventInformationDetail")} textStyle="heading-2-36" titleClassName="md:ml-2!" />
                    <RenderHtml content={eventData.content} className="text-cream mt-6" />
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </FixedMobileLayout>
    </>
  );
};

export default EventInformationDetail;
