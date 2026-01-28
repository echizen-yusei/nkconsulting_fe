"use client";
import Cookies from "js-cookie";
import { FormProvider, useForm } from "react-hook-form";
import { LoginFormDataType } from "@/types/login";
import { useTranslations } from "next-intl";
import Button from "@/components/atoms/Button/Button";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import SectionHeader from "@/components/atoms/SectionHeader";
import FormLabel from "@/components/atoms/FormLabel";
import { FormControl } from "@/components/atoms/FormField";
import ButtonUnderline from "@/components/atoms/ButtonUnderline/ButtonUnderline";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { useLogin } from "@/services/login";
import LoadingSpinner from "@/components/atoms/Loading";
import { actionScrollToTop, handleTrimValue } from "@/libs";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ONE_YEAR, USER } from "@/constants";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useUserContext } from "@/components/providers/UserProvider";
import useAutoFocus from "@/hooks/useAutoFocus";

type LoginPageProps = {
  isMobile: boolean;
};

const LoginPage = ({ isMobile: initialIsMobile }: LoginPageProps) => {
  const t = useTranslations("login");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { router } = useNavigation();
  const { mutate, isPending } = useLogin();
  const handleShowError = useErrorHandler();
  const { refetch } = useUserContext();
  const isMobile = useResponsiveScreen(initialIsMobile);
  const methods = useForm<LoginFormDataType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const isLoading = isPending || isRedirecting;

  const onSubmit = (data: LoginFormDataType) => {
    if (isLoading) return;
    mutate(handleTrimValue(data), {
      onSuccess: (res) => {
        setIsRedirecting(true);
        methods.reset();
        Cookies.set(USER, JSON.stringify(res.data.user), { expires: ONE_YEAR });
        methods.clearErrors();
        refetch();
        router.replace(PAGE.USER);
      },
      onError: (err) => {
        handleShowError({ error: err as AxiosError<ErrorResponseData> });
      },
    });
  };

  const handleRegister = () => {
    router.push(PAGE.REGISTER_MEMBER);
  };

  useAutoFocus();

  useEffect(() => {
    actionScrollToTop();
  }, []);

  return (
    <div className="max-w-xxl mx-auto px-6 md:px-0">
      {isLoading && <LoadingSpinner />}
      <div className="mt-[123px] mb-8 ml-0 flex flex-col justify-center sm:mb-16 sm:ml-4 md:mt-32 md:mb-24 md:ml-8 md:block md:min-h-auto lg:mt-[176px] lg:mb-16 lg:ml-[162px]">
        <span className="heading-1 text-cream noto-serif-jp pointer-events-auto hidden w-auto gap-4 md:block md:text-left">
          {t.rich("loginTitle", {
            highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
          })}
          <Breadcrumb autoGenerate className="pointer-events-auto mt-6 md:mt-10" />
        </span>
        <SectionHeader title={t("login")} className="heading-1 text-cream noto-serif-jp pointer-events-auto block w-auto gap-4 md:hidden md:text-left" />
      </div>
      <FormProvider {...methods}>
        <div className="bg-cream/0 md:bg-cream/20 mx-0 mb-[104px] block justify-between gap-12 rounded-md px-0 py-0 backdrop-blur-[0] sm:mx-4 sm:px-8 md:mb-16 md:flex md:px-16 md:py-16 md:backdrop-blur-xs lg:mx-12 lg:px-[114px]">
          <form className="relative flex w-full max-w-full flex-col md:max-w-[444px]" onSubmit={methods.handleSubmit(onSubmit)}>
            <SectionHeader className="hidden md:block" title={t("login")} />
            <FormLabel className="mt-0 mb-2 md:mt-8 md:mb-0">{t("label.email")}</FormLabel>
            <p className="text-cream text-2 pointer-events-auto my-4 hidden md:block">{t("explain.email")}</p>
            <FormControl
              name="email"
              label={t("label.email")}
              placeholder={isMobile ? t("placeholder.emailMobile") : t("placeholder.email")}
              className="pointer-events-auto"
              required
              isShowLabel={false}
              heightInput="h-[56px]"
              isInvalidField
            />
            <FormLabel className="mt-8 mb-2 md:mb-0">{t("label.password")}</FormLabel>
            <p className="text-cream text-2 pointer-events-auto my-4 hidden md:block">{t("explain.password")}</p>
            <FormControl
              name="password"
              type="password"
              label={t("label.password")}
              placeholder={t("placeholder.password")}
              className="pointer-events-auto"
              required
              isShowLabel={false}
              heightInput="h-[56px]"
              minLength={8}
              maxLength={20}
            />
            <div className="mt-8 mb-8 md:mt-4 md:mb-8">
              <ButtonUnderline href={PAGE.RESET_PASSWORD}>{t("forgotPassword")}</ButtonUnderline>
            </div>
            <Button type="submit" buttonType="secondary" className="heading-5 pointer-events-auto">
              {t("login")}
            </Button>
          </form>
          <div className="bg-cream hidden w-px self-stretch md:block" />
          <div className="mt-12 w-full max-w-full md:mt-0 md:max-w-[444px]">
            <SectionHeader title={t("userFirstLogin")} />
            <div className="mt-8 hidden md:block">
              <div>
                <ButtonUnderline href={PAGE.PRIVACY} className="inline">
                  {t("privacyPolicy")}
                </ButtonUnderline>
              </div>
              <div className="mt-4">
                <ButtonUnderline href={PAGE.MEMBERSHIP_TERMS}>{t("membershipTerms")}</ButtonUnderline>
              </div>
              <div className="mt-4">
                <ButtonUnderline href={PAGE.LEGAL_NOTICE}>{t("legalNotice")}</ButtonUnderline>
              </div>
            </div>
            <Button buttonType="outline" type="button" className="heading-5 pointer-events-auto mt-8 w-full" onClick={handleRegister}>
              {t("register")}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default LoginPage;
