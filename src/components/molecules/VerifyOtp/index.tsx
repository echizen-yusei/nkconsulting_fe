"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import Button from "@/components/atoms/Button/Button";
import { FormControl } from "@/components/atoms/FormField";
import { useVerifyEmailOtp, useSendEmailOtp } from "@/services/email-change";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import ErrorMsg from "@/components/atoms/ErrorMsg";
import LoadingDots from "@/components/atoms/LoadingDots";
import { userInfoAtom } from "@/atoms/user-atoms";
import { useAtom } from "jotai";
import { UpdateEmailFormData, VerifyOtpFormData, verifyOtpSchema } from "@/schemas/membership-info";
import { useAutoFocusField } from "@/hooks/useAutoFocusField";
import useRemainingTime from "@/hooks/useRemainingTime";
import { OTP_RESEND_TIME_SECONDS } from "@/constants";

interface VerifyOtpProps {
  onClose: () => void;
  requestData: UpdateEmailFormData & { requestId: string };
  onSuccess: () => void;
  onBackEmailChange: () => void;
}

const VerifyOtp = ({ onClose, requestData, onSuccess, onBackEmailChange }: VerifyOtpProps) => {
  const t = useTranslations("profilePage.emailChange.verifyOtp");
  const tValidation = useTranslations("Validation");
  const { mutate: verifyOtp, isPending } = useVerifyEmailOtp();
  const { mutate: sendOtp, isPending: isResending } = useSendEmailOtp();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const handleShowError = useErrorHandler();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string>(requestData.requestId);
  const { remainingTime, setRemainingTime } = useRemainingTime(0);

  const methods = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema(t, tValidation)),
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (data: VerifyOtpFormData) => {
    if (isPending) return;

    verifyOtp(
      {
        requestId: currentRequestId,
        data: { email_change_request: { new_email: requestData.email, otp_code: data.otp } },
      },
      {
        onSuccess: () => {
          if (requestData.email) {
            setUserInfo({ ...userInfo, email: requestData.email, plan_type_key: userInfo?.plan_type_key || "" });
          }
          methods.reset();
          onSuccess();
          onClose();
        },
        onError: (error) => {
          if ((error as AxiosError<ErrorResponseData>).response?.status === 400) {
            const errorMessage = (error as AxiosError<ErrorResponseData>).response?.data?.errors;
            if (errorMessage && Array.isArray(errorMessage)) {
              setErrorMessage(errorMessage[0] as string);
            }
            return;
          }
          handleShowError({ error: error as AxiosError<ErrorResponseData> });
        },
      },
    );
  };

  const onUseAnotherEmail = () => {
    onBackEmailChange();
    methods.reset();
    setRemainingTime(0);
  };

  const handleResendOtp = () => {
    if (remainingTime > 0 || isResending) return;

    sendOtp(
      { email_change_request: { newEmail: requestData.email } },
      {
        onSuccess: (response) => {
          setCurrentRequestId(response.email_change_request.id);
          setRemainingTime(OTP_RESEND_TIME_SECONDS);
          setErrorMessage(null);
        },
        onError: (error) => {
          handleShowError({ error: error as AxiosError<ErrorResponseData> });
        },
      },
    );
  };

  useAutoFocusField("otp");

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-black-custom heading-3-30 hidden md:block">{t("title")}</h2>
      <h2 className="text-black-custom heading-5 md:hidden">{t("title")}</h2>

      <div className="flex flex-col gap-2">
        <p className="text-black-custom text-1">{t("description")}</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormControl
            name="otp"
            label={t("otpLabel")}
            placeholder={t("placeholder")}
            required
            isColumn
            isShowLabel={false}
            className="mb-2 gap-2"
            borderClassName="border border-gray-medium rounded-[8px]"
            isOutline
            isNumber
            inputMaxLength={6}
          />
          {errorMessage && !methods.formState.errors.otp?.message && <ErrorMsg message={errorMessage} name="otp" className="mt-0 mb-2" />}
          <span>
            <Button type="button" buttonType="underline" onClick={onUseAnotherEmail} textColor="text-black text-start" className="inline">
              {t("useAnotherEmail")}
            </Button>
          </span>
          <div className="mt-1 flex items-center gap-2">
            {remainingTime > 0 ? (
              <span className="text-1 text-gray-medium">{`${remainingTime} ${t("resendOtpTimeAfter")}`}</span>
            ) : (
              <Button
                buttonType="underline"
                type="button"
                onClick={handleResendOtp}
                textColor="text-black text-start"
                className="inline"
                isDisabled={remainingTime > 0 || isResending}
              >
                {isResending ? <LoadingDots /> : t("resendOtp")}
              </Button>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <Button type="submit" buttonType="secondary" className="font-noto-serif-jp xs:text-[20px] h-14! w-full py-0! font-semibold" isDisabled={isPending}>
              {isPending ? <LoadingDots /> : t("submit")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default VerifyOtp;
