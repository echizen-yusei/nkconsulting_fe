"use client";
import Button from "@/components/atoms/Button/Button";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl } from "@/components/atoms/FormField";
import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import useNavigation from "@/hooks/useNavigation";
import { PAGE } from "@/constants/page";
import { ResetPasswordPayload } from "@/types/reset-password";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { useResetPassword } from "@/services/reset-password";
import LoadingSpinner from "@/components/atoms/Loading";
import { AxiosError } from "axios";
import { handleTrimValue } from "@/libs";
import useAutoFocus from "@/hooks/useAutoFocus";

const ResetPasswordPage = () => {
  const t = useTranslations("resetPassword");
  const { router } = useNavigation();
  const handleShowError = useErrorHandler();
  const { mutate, isPending } = useResetPassword();

  const methods = useForm<ResetPasswordPayload>({
    defaultValues: {
      email: "",
      frontend_url: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (data: ResetPasswordPayload) => {
    if (isPending) return;
    const payload = handleTrimValue({
      email: data.email,
      frontend_url: `${window.location.origin}${PAGE.SETTING_PASSWORD}`,
    });
    mutate(payload, {
      onSuccess: () => {
        methods.reset();
        methods.clearErrors();
        router.push(PAGE.RESET_PASSWORD_COMPLETE);
      },
      onError: (err: AxiosError) => {
        handleShowError({ error: err as AxiosError<ErrorResponseData>, isHandle404: false });
      },
    });
  };

  const handleLogin = () => {
    router.push(PAGE.LOGIN);
  };

  useAutoFocus();
  return (
    <div className="max-w-xxl mx-auto flex min-h-dvh flex-col justify-center px-5 md:block md:px-0 md:pb-0">
      <div className="pt-[82px] md:pt-[176px]">
        {isPending && <LoadingSpinner />}
        <div className="mb-8 ml-0 hidden flex-col justify-center sm:mb-16 sm:ml-4 md:mb-24 md:ml-8 md:flex lg:mb-16 lg:ml-[162px]">
          <span className="heading-1 text-cream noto-serif-jp pointer-events-auto md:text-left">
            {t.rich("title", {
              highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
            })}
          </span>
          <Breadcrumb autoGenerate className="pointer-events-auto mt-6 hidden md:mt-10 md:block" />
        </div>
        <FormProvider {...methods}>
          <form
            className="md:bg-cream/20 relative mx-0 mt-0 mb-8 flex flex-col rounded-md sm:mx-4 sm:mb-8 sm:px-8 md:mx-8 md:mb-24 md:px-16 md:py-16 md:backdrop-blur-xs lg:mx-12 lg:mb-45 lg:px-[114px]"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <span className="heading-1 text-cream noto-serif-jp pointer-events-auto mb-8 block md:hidden md:text-left">
              {t.rich("title", {
                highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
              })}
            </span>
            <p className="text-cream text-1 pointer-events-auto mb-8 whitespace-pre-line">{t("form.explain1")}</p>
            <p className="text-cream heading-3-30 pointer-events-auto mb-2 block whitespace-pre-line md:hidden">{t("form.explain3")}</p>
            <p className="text-cream text-2 pointer-events-auto mb-2 hidden whitespace-pre-line md:mb-4 md:block">{t("form.explain2")}</p>
            <p className="text-cream text-2 pointer-events-auto mb-2 block whitespace-pre-line md:mb-4 md:hidden">{t("form.explain2sp")}</p>
            <FormControl
              inputClassName="w-full"
              name="email"
              label={t("form.label.email")}
              placeholder={t("form.placeholder.email")}
              className="pointer-events-auto rounded-md"
              maxLength={255}
              required
              isInvalidField
              isShowLabel={false}
            />

            <Button type="submit" className="heading-5 pointer-events-auto mt-8 w-full">
              {t("form.submit")}
            </Button>
            <Button type="button" buttonType="outline" className="heading-5 pointer-events-auto mt-8 w-full" onClick={handleLogin}>
              {t("form.login")}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
