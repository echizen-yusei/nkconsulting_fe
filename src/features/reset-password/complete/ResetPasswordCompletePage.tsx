"use client";
import Button from "@/components/atoms/Button/Button";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { useTranslations } from "next-intl";

const ResetPasswordCompletePage = () => {
  const t = useTranslations("resetPasswordCompletePage");
  const { router } = useNavigation();
  return (
    <div className="max-w-xxl mx-auto flex min-h-dvh flex-col md:px-0">
      <div className="mt-0 flex w-full flex-1 items-center px-6 text-center md:px-0">
        <div className="md:bg-cream/20 w-full rounded-md py-16 md:mx-12 md:px-[114px] md:backdrop-blur-xs">
          <h1 className="heading-1 text-cream pointer-events-auto text-left whitespace-pre-line">{t("title")}</h1>
          <p className="text-cream text-1 pointer-events-auto mt-8 hidden text-left whitespace-pre-line md:block">{t("explain")}</p>
          <p className="text-cream text-1 pointer-events-auto mt-8 text-left whitespace-pre-line md:hidden">{t("explainSp")}</p>
          <Button
            type="button"
            buttonType="outline"
            className="heading-5 pointer-events-auto mt-8 block w-full md:hidden"
            onClick={() => router.push(PAGE.LOGIN)}
          >
            {t("button")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordCompletePage;
