import Button from "@/components/atoms/Button/Button";
import { CustomDatePicker } from "@/components/atoms/DatePicker";
import { FormControl } from "@/components/atoms/FormField";
import FormLabel from "@/components/atoms/FormLabel";
import LoadingSpinner from "@/components/atoms/Loading";
import { TimePicker } from "@/components/atoms/TimePicker";
import reservationSchema, { ReservationSchemaType } from "@/schemas/reservation.schema";
import { useReservation } from "@/services/reservation";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import useNavigation from "@/hooks/useNavigation";
import { PAGE } from "@/constants/page";
import { toast } from "sonner";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LOUNGE_RESERVATION_SUB_TAB } from "@/constants";
import { buildApiUrl } from "@/libs/utils";

const ReservationForm = () => {
  const t = useTranslations("loungeReservation");
  const tSchema = useTranslations();
  const searchParams = useSearchParams();
  const subTab = searchParams.get("sub-tab");
  const handleShowError = useErrorHandler();
  const { router } = useNavigation();

  const options = Array.from({ length: 20 }, (_, index) => ({
    label: `${index + 1}${t("currentReservation.guestCountSuffix")}`,
    value: `${index + 1}`,
  }));

  const { mutate: reservationMutate, isPending } = useReservation();

  const methods = useForm<ReservationSchemaType>({
    defaultValues: {
      reserved_date: "",
      reserved_time: "",
      guest_count: "",
    },
    resolver: zodResolver(reservationSchema(tSchema)),
    mode: "onSubmit",
  });

  const reservedDate = useWatch({
    control: methods.control,
    name: "reserved_date",
  });

  const reservedTime = useWatch({
    control: methods.control,
    name: "reserved_time",
  });

  const getMinDate = () => {
    const now = dayjs();
    const currentHour = now.hour();
    if (currentHour >= 12) {
      return dayjs().add(1, "day").startOf("day").toDate();
    }
    return dayjs().startOf("day").toDate();
  };

  const getTimeConstraints = () => {
    if (!reservedDate) {
      return { minTime: "00:00", maxTime: undefined };
    }

    const selectedDateObj = dayjs(reservedDate, "YYYY/MM/DD");
    const today = dayjs().startOf("day");
    const now = dayjs();
    const currentTime = now.format("HH:mm");
    const currentHour = now.hour();

    if (selectedDateObj.isSame(today, "day")) {
      const minTime = currentTime;

      if (currentHour >= 12) {
        return { minTime, maxTime: undefined };
      }
      return { minTime, maxTime: "12:00" };
    }

    return { minTime: "00:00", maxTime: undefined };
  };

  const { minTime, maxTime } = getTimeConstraints();

  const onSubmit = (data: ReservationSchemaType) => {
    reservationMutate(data, {
      onSuccess: (response) => {
        methods.reset();
        const reservationId = response.data?.id || response.data?.reservation?.id || response.data?.data?.id;
        toast.success(t("form.successMessage"));
        if (reservationId) {
          const params = buildApiUrl({
            "sub-tab": LOUNGE_RESERVATION_SUB_TAB.reservation,
            reservation_id: reservationId,
          });
          router.push(`${PAGE.USER_LOUNGE_RESERVATION_COMPLETE}${params}`);
        }
      },
      onError: (error) => {
        handleShowError({ error: error as AxiosError<ErrorResponseData> });
      },
    });
  };

  useEffect(() => {
    methods.reset();
  }, [subTab, methods]);

  return (
    <FormProvider {...methods}>
      {isPending && <LoadingSpinner />}

      <form className="flex flex-col gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start gap-2 md:flex-row md:gap-0">
          <FormLabel className="flex-3 md:mt-2" isRequired fontSize="text-xl">
            {t("form.date.label")}
          </FormLabel>
          <div className="w-full md:flex-4">
            <CustomDatePicker
              name="reserved_date"
              placeholder={t("form.date.placeholder")}
              value={reservedDate}
              onChange={(value: string) => {
                methods.setValue("reserved_date", value, { shouldValidate: false });
                methods.setValue("reserved_time", "", { shouldValidate: false });
              }}
              minDate={getMinDate()}
              error={methods.formState.errors.reserved_date?.message || ""}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 md:flex-row md:gap-0">
          <FormLabel className="flex-3 md:mt-2" isRequired fontSize="text-xl">
            {t("form.time.label")}
          </FormLabel>
          <div className="w-full md:flex-4">
            <TimePicker
              name="reserved_time"
              placeholder={t("form.time.placeholder")}
              value={reservedTime}
              onChange={(value: string) => {
                methods.setValue("reserved_time", value, { shouldValidate: false });
              }}
              minTime={minTime}
              maxTime={maxTime}
              selectedDate={reservedDate}
              error={methods.formState.errors.reserved_time?.message || ""}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 md:flex-row md:gap-0">
          <FormLabel className="flex-3 md:mt-2" isRequired fontSize="text-xl">
            {t("form.guestCount.label")}
          </FormLabel>
          <div className="w-full md:flex-4">
            <FormControl
              name="guest_count"
              label={t("form.guestCount.label")}
              type="select"
              placeholder={t("form.guestCount.placeholder")}
              isShowLabel={false}
              options={options}
              className="flex-1"
            />
          </div>
        </div>
        <p className="text-1 text-cream my-2 hidden text-center md:my-4 md:block">{t("form.confirmMessage")}</p>
        <p className="text-1 text-cream my-2 block text-center whitespace-pre-line md:my-8 md:hidden">{t("form.confirmMessageSp")}</p>
        <Button type="submit" className="heading-5 w-full">
          {t("form.submit")}
        </Button>
      </form>
    </FormProvider>
  );
};

export default ReservationForm;
