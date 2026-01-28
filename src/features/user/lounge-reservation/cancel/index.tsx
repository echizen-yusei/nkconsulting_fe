"use client";
import Button from "@/components/atoms/Button/Button";
import LoadingSpinner from "@/components/atoms/Loading";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import Nodata from "@/components/atoms/Nodata";
import SectionHeader from "@/components/atoms/SectionHeader";
import { useUserContext } from "@/components/providers/UserProvider";
import { LOUNGE_RESERVATION_SUB_TAB, RESERVATION_STATUS } from "@/constants";
import { PAGE } from "@/constants/page";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import useNavigation from "@/hooks/useNavigation";
import { buildApiUrl } from "@/libs/utils";
import { useCancelReservation, useGetReservationDetail } from "@/services/reservation";
import { AxiosError } from "axios";
import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CancelBooking = () => {
  const searchParams = useSearchParams();
  const handleShowError = useErrorHandler();
  const { isLoadingUserInfo } = useUserContext();
  const reservationId = searchParams.get("reservation_id");
  const reservationCount = searchParams.get("reservation_count");
  const page = parseInt(searchParams.get("page") || "1");
  const { data: reservations, error, isLoading } = useGetReservationDetail(reservationId || "");
  const { mutate: cancelReservation, isPending: isCanceling } = useCancelReservation();
  const reservation = reservations?.data.reservation;
  const t = useTranslations("loungeReservation");
  const { router } = useNavigation();
  const [isClosing, setIsClosing] = useState(false);

  const onBack = (isSuccess: boolean = false) => {
    setIsClosing(true);
    if (isSuccess && reservationCount === "1" && page > 1) {
      const params = buildApiUrl({
        "sub-tab": LOUNGE_RESERVATION_SUB_TAB.current_reservation,
        page: page - 1,
      });
      setTimeout(() => {
        router.push(`${PAGE.USER_LOUNGE_RESERVATION}${params}`);
      }, 300);
    } else {
      const params = buildApiUrl({
        "sub-tab": LOUNGE_RESERVATION_SUB_TAB.current_reservation,
        page: page,
      });
      setTimeout(() => {
        router.push(`${PAGE.USER_LOUNGE_RESERVATION}${params}`);
      }, 300);
    }
  };

  const onClickCancel = () => {
    cancelReservation(
      { id: reservationId || "" },
      {
        onSuccess: (res) => {
          onBack(true);
          toast.success(res.data.reservation.message);
        },
        onError: (error) => {
          if ((error as AxiosError<ErrorResponseData>).status === 404) {
            onBack(true);
          }
          handleShowError({ error: error as AxiosError<ErrorResponseData> });
        },
      },
    );
  };

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData>, isHandle404: false });
    }
  }, [error, handleShowError]);

  const renderContent = () => (
    <div
      className={`bg-black transition-all duration-300 ease-in-out md:mx-0 md:mt-0 md:bg-transparent md:px-12 md:py-16 ${
        isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div className="border-cream relative flex cursor-pointer items-center border-b py-6 md:hidden">
        <div className="absolute top-1/2 left-6 -translate-y-1/2">
          <ChevronLeftIcon className="text-cream h-6 w-6" onClick={() => onBack()} />
        </div>
        <div className="text-cream heading-5 flex-1 px-12 text-center">{t("cancelBooking.title")}</div>
      </div>
      <SectionHeader title={t("cancelBooking.subTitle")} className="mx-6 mt-8 md:mx-0 md:mt-0" />
      {error ? (
        <Nodata className="my-8 ml-6 text-left md:ml-0" />
      ) : isLoading && !isLoadingUserInfo ? (
        <div className="relative mt-16 mb-6 flex h-full items-center justify-center">
          <LoadingAtoms />
        </div>
      ) : (
        <>
          <div className={"border-gradient-gold-md md:bg-gray333 rounded-md md:mt-12"}>
            <div className="px-6 md:py-12">
              <div className="my-6 md:my-0">
                <p className="text-1 text-cream hidden md:block">{t("cancelBooking.message")}</p>
                <p className="text-1 text-cream block whitespace-pre-line md:hidden">{t("cancelBooking.messageSp")}</p>
              </div>
              <div className="flex flex-col gap-4 md:mt-8">
                <div className="text-cream border-cream flex justify-between border-b pb-2">
                  <div className="text-1 text-cream">{t("cancelBooking.reservedDate")}</div>
                  <div className="text-1">{reservation?.reserved_date}</div>
                </div>
                <div className="text-cream border-cream flex justify-between border-b pb-2">
                  <div className="text-1">{t("cancelBooking.reservedTime")}</div>
                  <div className="text-1">{reservation?.reserved_time}~</div>
                </div>
                <div className="text-cream border-cream flex justify-between border-b pb-2">
                  <div className="text-1">{t("cancelBooking.guestCount")}</div>
                  <div className="text-1">
                    {reservation?.guest_count}
                    {t("cancelBooking.guestCountSuffix")}
                  </div>
                </div>
                <div className="text-cream border-cream flex justify-between border-b pb-2">
                  <div className="text-1">{t("cancelBooking.statusLabel")}</div>
                  <div className="text-1">{t(`cancelBooking.status.${reservation?.status}`)}</div>
                </div>
              </div>
              <div>
                <div className="w-full">
                  <Button
                    type="button"
                    className="heading-5 mt-8 w-full"
                    onClick={() => {
                      if (reservation?.status === RESERVATION_STATUS.completed) return;
                      onClickCancel();
                    }}
                    isDisabled={reservation?.status === RESERVATION_STATUS.completed}
                  >
                    {t("cancelBooking.cancelConfirm")}
                  </Button>
                </div>
                <div className="hidden w-full md:block">
                  <Button type="button" buttonType="outline" className="heading-5 mt-8 w-full" onClick={() => onBack()}>
                    {t("cancelBooking.goBack")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const content = renderContent();

  return (
    <>
      {isCanceling && <LoadingSpinner />}
      <div className="fixed inset-0 z-60 block bg-black md:hidden">{content}</div>
      <div className="hidden md:block">{content}</div>
    </>
  );
};

export default CancelBooking;
