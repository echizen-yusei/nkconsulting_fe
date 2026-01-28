"use client";
import SectionHeader from "@/components/atoms/SectionHeader";
import { PAGE } from "@/constants/page";
import { useGetReservation } from "@/services/reservation";
import { useTranslations } from "next-intl";
import Pagination from "@/components/atoms/Pagination";
import useNavigation from "@/hooks/useNavigation";
import Button from "@/components/atoms/Button/Button";
import { useSearchParams } from "next/navigation";
import { isEmpty } from "@/libs/utils";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { useUserContext } from "@/components/providers/UserProvider";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/atoms/user-atoms";
import { RESERVATION_STATUS } from "@/constants";

const CurrentReservation = () => {
  const t = useTranslations("loungeReservation");
  const searchParams = useSearchParams();
  const handleShowError = useErrorHandler();
  const { isLoadingUserInfo } = useUserContext();
  const [userInfo] = useAtom(userInfoAtom);
  const page = parseInt(searchParams.get("page") || "1");
  const { data: reservations, isLoading, error } = useGetReservation(page, userInfo?.plan_type_key ?? "");

  const reservation = reservations?.data?.reservations;
  const { router } = useNavigation();
  const onClickCancel = (reservationId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("reservation_id", reservationId);
    router.push(`${PAGE.USER_LOUNGE_RESERVATION}/cancel?${newSearchParams.toString()}&reservation_count=${reservation?.length}`);
  };
  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData> });
    }
  }, [error, handleShowError]);

  useEffect(() => {
    if (reservation?.length === 0 && page > 1) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", String(page - 1));
      router.push(`${PAGE.USER_LOUNGE_RESERVATION}?${newSearchParams.toString()}`);
    }
  }, [reservation, router, page, searchParams]);

  return (
    <>
      <SectionHeader title={t("currentReservation.title")} className="heading-2 hidden md:block" />
      <div className="mt-8 flex flex-col gap-10 md:mt-12 md:gap-6">
        {isLoading && !isLoadingUserInfo ? (
          <div className="relative mt-12 mb-6 flex h-full items-center justify-center">
            <LoadingAtoms />
          </div>
        ) : isEmpty(reservation) ? (
          <div className={"border-gradient-gold-md md:bg-gray333 pt-8 md:my-0 md:rounded-md md:pt-0"}>
            <p className="text-1 text-cream px-6 pb-8 text-center md:py-12 md:text-left">{t("currentReservation.noReservation")}</p>
          </div>
        ) : (
          reservation?.map((item, index) => (
            <div className={"border-gradient-gold-md md:bg-gray333 md:my-0 md:rounded-md md:pt-0"} key={`${item.reserved_date}-${item.reserved_time}-${index}`}>
              <div className="px-6 md:py-8">
                <div className="flex flex-col gap-4">
                  <div className="text-cream border-cream flex justify-between border-b pb-2">
                    <div className="text-1">{t("currentReservation.reservedDate")}</div>
                    <div className="text-1">{item.reserved_date}</div>
                  </div>
                  <div className="text-cream border-cream flex justify-between border-b pb-2">
                    <div className="text-1">{t("currentReservation.reservedTime")}</div>
                    <div className="text-1">{item.reserved_time}~</div>
                  </div>
                  <div className="text-cream border-cream flex justify-between border-b pb-2">
                    <div className="text-1">{t("currentReservation.guestCount")}</div>
                    <div className="text-1">
                      {item.guest_count}
                      {t("currentReservation.guestCountSuffix")}
                    </div>
                  </div>
                  <div className="text-cream border-cream flex justify-between border-b pb-2">
                    <div className="text-1">{t("currentReservation.statusLabel")}</div>
                    <div className="text-1">{t(`currentReservation.status.${item.status}`)}</div>
                  </div>
                  {item.status !== RESERVATION_STATUS.cancelled && item.status !== RESERVATION_STATUS.completed && (
                    <Button
                      buttonType="underline"
                      onClick={() => {
                        onClickCancel(item.id);
                      }}
                      className="text-left"
                    >
                      {t("currentReservation.cancelConfirm")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <Pagination totalPages={reservations?.data?.pagination.total_pages || 0} maxVisiblePages={2} className="mb-4 md:mt-2" />
      </div>
    </>
  );
};

export default CurrentReservation;
