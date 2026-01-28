"use client";
import LayoutBackground from "@/components/layout/LayoutBackground";
import backgroundTopSp from "../../../../public/assets/images/background_sp_2.png";
import { useTranslations } from "next-intl";
import Button from "@/components/atoms/Button/Button";
import useNavigation from "@/hooks/useNavigation";
import { PAGE } from "@/constants/page";
const RegisterCompletePage = () => {
  const t = useTranslations("registerCompletePage");
  const { router } = useNavigation();
  const handleLogin = () => {
    router.push(PAGE.LOGIN);
  };
  return (
    <LayoutBackground isShowFooter={false} backgroundSp={backgroundTopSp}>
      <div className="flex min-h-dvh flex-col">
        <div className="max-w-xxl mx-auto flex min-h-dvh w-full flex-col justify-center md:min-h-[calc(100vh-112px)] md:px-0 md:pt-[112px]">
          <div className="mt-0 flex w-full flex-1 items-center text-center">
            <div className="md:bg-cream/20 mx-6 w-full rounded-md py-16 md:mx-12 md:px-12 lg:px-[114px]">
              <h1 className="heading-1 text-cream text-left whitespace-pre-line">{t("title")}</h1>
              <p className="text-cream text-1 mt-6 hidden text-left whitespace-pre-line md:mt-8 md:block">{t("description")}</p>
              <p className="text-cream text-1 mt-8 block text-left whitespace-pre-line md:mt-10 md:hidden">{t("descriptionSp")}</p>
              <Button type="button" buttonType="outline" className="heading-5 mt-8 block w-full md:hidden" onClick={handleLogin}>
                {t("button")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LayoutBackground>
  );
};

export default RegisterCompletePage;
