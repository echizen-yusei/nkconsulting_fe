"use client";

import { useTranslations } from "next-intl";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { AxiosError } from "axios";

import { FormControl } from "@/components/atoms/FormField";
import FormLabel from "@/components/atoms/FormLabel";
import Button from "@/components/atoms/Button/Button";
import LoadingDots from "@/components/atoms/LoadingDots";
import { useSendEmailOtp } from "@/services/email-change";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { UpdateEmailFormData } from "@/schemas/membership-info";
import { useAutoFocusField } from "@/hooks/useAutoFocusField";

interface EditEmailProps {
  methods: UseFormReturn<UpdateEmailFormData>;
  onOpenVerifyOtp: (data: UpdateEmailFormData & { requestId: string }) => void;
}

const EditEmail = ({ methods, onOpenVerifyOtp }: EditEmailProps) => {
  const t = useTranslations("profilePage.emailChange.editEmail");
  const { mutate: sendOtp, isPending } = useSendEmailOtp();
  const handleShowError = useErrorHandler();

  const onSubmit = (data: UpdateEmailFormData) => {
    if (isPending) return;

    sendOtp(
      { email_change_request: { newEmail: data.email } },
      {
        onSuccess: (response) => {
          onOpenVerifyOtp({ email: data.email, requestId: response.email_change_request.id });
          methods.reset();
        },
        onError: (error) => {
          handleShowError({ error: error as AxiosError<ErrorResponseData> });
        },
      },
    );
  };

  useAutoFocusField("email");

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6 md:gap-12">
        <h2 className="text-black-custom heading-3-30 hidden md:block">{t("title")}</h2>
        <h2 className="text-black-custom heading-5 md:hidden">{t("title")}</h2>

        <div>
          <FormLabel textColor="text-black" textStyle="text-1" className="mb-2">
            {t("newEmail.label")}
          </FormLabel>
          <FormControl
            name="email"
            label={t("newEmail.label")}
            placeholder={t("newEmail.placeholder")}
            isEmail
            required
            isColumn
            isShowLabel={false}
            className="gap-2"
            borderClassName="border border-gray-medium rounded-[8px]"
            isOutline
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <Button
            type="submit"
            isDisabled={isPending}
            buttonType="secondary"
            className="font-noto-serif-jp xs:text-[20px] h-14! w-full py-0! font-semibold"
            disabled={isPending}
          >
            {isPending ? <LoadingDots text={t("sending")} /> : t("sendOtp")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditEmail;
