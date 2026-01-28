"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/atoms/Button/Button";
import SectionHeader from "@/components/atoms/SectionHeader";
import { LOUNGE_RESERVATION_SUB_TAB } from "@/constants";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { useGetReservationDetail } from "@/services/reservation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { buildApiUrl } from "@/libs/utils";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import Nodata from "@/components/atoms/Nodata";
import { useUserContext } from "@/components/providers/UserProvider";

const ReservationComplete = () => {
  const t = useTranslations("loungeReservation");
  const searchParams = useSearchParams();
  const { isLoadingUserInfo } = useUserContext();
  const reservationId = searchParams.get("reservation_id");
  const page = parseInt(searchParams.get("page") || "1");
  const handleShowError = useErrorHandler();
  const { data: reservations, isLoading, error } = useGetReservationDetail(reservationId || "");
  const reservation = reservations?.data.reservation;
  const { router } = useNavigation();
  const [isClosing, setIsClosing] = useState(false);

  const onClickBack = useCallback(() => {
    setIsClosing(true);
    const params = buildApiUrl({
      "sub-tab": LOUNGE_RESERVATION_SUB_TAB.reservation,
      page: page,
    });
    setTimeout(() => {
      router.push(`${PAGE.USER_LOUNGE_RESERVATION}${params}`);
    }, 300);
  }, [page, router]);

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData>, isHandle404: false });
    }
  }, [error, handleShowError]);

  const renderContent = useMemo(() => {
    return (
      <div
        className={`bg-black transition-all duration-300 ease-in-out md:mx-0 md:mt-0 md:bg-transparent md:px-12 md:py-16 ${
          isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="border-cream relative flex cursor-pointer items-center border-b py-6 md:hidden">
          <div className="absolute top-1/2 left-6 -translate-y-1/2">
            <ChevronLeftIcon className="text-cream h-6 w-6" onClick={onClickBack} />
          </div>
          <div className="text-cream heading-5 flex-1 px-12 text-center">{t("reservationComplete.titleSp")}</div>
        </div>
        <div className="px-6 py-8 md:px-0 md:py-0">
          <SectionHeader title={t("reservationComplete.title")} textStyle="heading-2-36" />
          <div className="border-gradient-gold-md md:bg-gray333 rounded-md md:mt-12">
            {!isLoadingUserInfo && (
              <div className="md:px-6 md:py-12">
                {error ? (
                  <Nodata className="my-8 text-left md:ml-0" />
                ) : isLoading && !isLoadingUserInfo ? (
                  <div className="relative mt-16 mb-6 flex h-full items-center justify-center">
                    <LoadingAtoms />
                  </div>
                ) : (
                  <>
                    <div className="my-6 md:mt-0">
                      <p className="text-1 text-cream">{t("reservationComplete.message1")}</p>
                      <p className="text-1 text-cream">{t("reservationComplete.message2")}</p>
                    </div>
                    <div className="mt-8 flex flex-col gap-4">
                      <div className="text-cream border-cream flex justify-between border-b pb-2">
                        <div className="text-1 text-cream">{t("reservationComplete.reservedDate")}</div>
                        <div className="text-1">{reservation?.reserved_date}</div>
                      </div>
                      <div className="text-cream border-cream flex justify-between border-b pb-2">
                        <div className="text-1">{t("reservationComplete.reservedTime")}</div>
                        <div className="text-1">{reservation?.reserved_time}~</div>
                      </div>
                      <div className="text-cream border-cream flex justify-between border-b pb-2">
                        <div className="text-1">{t("reservationComplete.guestCount")}</div>
                        <div className="text-1">
                          {reservation?.guest_count}
                          {t("reservationComplete.guestCountSuffix")}
                        </div>
                      </div>
                      <div className="text-cream border-cream flex justify-between border-b pb-2">
                        <div className="text-1">{t("reservationComplete.statusLabel")}</div>
                        <div className="text-1">{t(`reservationComplete.status.${reservation?.status}`)}</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      buttonType="outline"
                      className="heading-5 mt-8 hidden w-full md:block"
                      onClick={() => router.push(`${PAGE.USER_LOUNGE_RESERVATION}?sub-tab=current_reservation`)}
                    >
                      {t("reservationComplete.button")}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    isClosing,
    onClickBack,
    t,
    isLoadingUserInfo,
    error,
    isLoading,
    reservation?.reserved_date,
    reservation?.reserved_time,
    reservation?.guest_count,
    reservation?.status,
    router,
  ]);

  return (
    <>
      <div className="fixed inset-0 z-60 block bg-black md:hidden">{renderContent}</div>
      <div className="hidden md:block">{renderContent}</div>
    </>
  );
};

export default ReservationComplete;
