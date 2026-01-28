"use client";
import Button from "@/components/atoms/Button/Button";
import LayoutBackground from "@/components/layout/LayoutBackground";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { useTranslations } from "next-intl";
import backgroundTopSp from "../../../../public/assets/images/background_sp_2.png";
const SettingPasswordCompletePage = () => {
  const { router } = useNavigation();
  const t = useTranslations("settingPasswordCompletePage");

  const handleLogin = () => {
    router.push(PAGE.LOGIN);
  };
  return (
    <LayoutBackground isShowFooter={false} backgroundSp={backgroundTopSp}>
      <div className="max-w-xxl mx-auto flex min-h-dvh flex-col md:px-0">
        <div className="mt-0 flex w-full flex-1 items-center px-6 text-center md:px-0">
          <div className="md:bg-cream/20 w-full rounded-md py-16 md:mx-12 md:px-[114px] md:backdrop-blur-xs">
            <h1 className="heading-1 text-cream text-left whitespace-pre-line">{t("title")}</h1>
            <p className="text-cream text-1 text-1 my-8 hidden text-left whitespace-pre-line md:block">{t("description")}</p>
            <p className="text-cream text-1 text-1 my-8 text-left whitespace-pre-line md:hidden">{t("descriptionSp")}</p>
            <Button type="button" buttonType="outline" className="heading-5 w-full" onClick={handleLogin}>
              {t("button")}
            </Button>
          </div>
        </div>
      </div>
    </LayoutBackground>
  );
};

export default SettingPasswordCompletePage;
