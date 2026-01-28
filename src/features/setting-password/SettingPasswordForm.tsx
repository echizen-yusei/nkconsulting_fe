import Button from "@/components/atoms/Button/Button";
import { FormControl } from "@/components/atoms/FormField";
import LoadingSpinner from "@/components/atoms/Loading";
import { PAGE } from "@/constants/page";
import useAutoFocus from "@/hooks/useAutoFocus";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import useNavigation from "@/hooks/useNavigation";
import { handleTrimValue } from "@/libs";
import { useSettingPassword } from "@/services/setting-password";
import { PasswordFormData, SettingPasswordFormProps } from "@/types/setting-password";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";

export default function SettingPasswordForm({ token }: SettingPasswordFormProps) {
  const t = useTranslations("settingPasswordPage");
  const { router } = useNavigation();
  const handleShowError = useErrorHandler();
  const methods = useForm<PasswordFormData>({
    defaultValues: {
      reset_password_token: token,
      password: "",
      password_confirmation: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const { mutate, isPending } = useSettingPassword();

  const onSubmit = (data: PasswordFormData) => {
    if (isPending) return;
    const newData: PasswordFormData = handleTrimValue(data);
    mutate(newData, {
      onSuccess: () => {
        methods.reset();
        methods.clearErrors();
        router.push(PAGE.SETTING_PASSWORD_COMPLETE);
      },
      onError: (err: AxiosError) => {
        handleShowError({ error: err as AxiosError<ErrorResponseData> });
      },
    });
  };

  useAutoFocus();
  return (
    <div>
      {isPending && <LoadingSpinner />}
      <h1 className="heading-1 text-cream pointer-events-auto mb-8 block text-left whitespace-pre-line md:hidden">{t("titleSp")}</h1>
      <div className="md:bg-cream/20 pointer-events-auto relative mb-16 flex flex-col gap-2 rounded-md sm:mb-16 md:mb-24 md:gap-8 md:px-16 md:py-16 md:backdrop-blur-xs lg:mb-30 lg:px-[114px]">
        <p className="text-cream text-1 hidden whitespace-pre-line md:block">{t("form.note")}</p>
        <p className="text-cream text-2 block whitespace-pre-line md:hidden">{t("form.noteSp")}</p>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormControl
              name="password"
              type="password"
              label={t("form.password.label")}
              placeholder={t("form.password.placeholder")}
              isShowLabel={false}
              required
              minLength={8}
              maxLength={20}
              className="pointer-events-auto"
            />
            <FormControl
              name="password_confirmation"
              type="password"
              label={t("form.confirmPassword.label")}
              placeholder={t("form.confirmPassword.placeholder")}
              isShowLabel={false}
              minLength={8}
              maxLength={20}
              required
              className="pointer-events-auto mt-2 md:mt-4"
              isConfirmPassword
            />
            <Button type="submit" buttonType="secondary" className="heading-5 pointer-events-auto mt-8 w-full" disabled={isPending}>
              {t("form.submit")}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
