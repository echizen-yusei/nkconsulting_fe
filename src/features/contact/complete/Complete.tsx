"use client";
import { useTranslations } from "next-intl";
import LayoutBackground from "@/components/layout/LayoutBackground";
const CompletePage = () => {
  const t = useTranslations("ContactCompletePage");
  return (
    <LayoutBackground>
      <div className="flex min-h-dvh flex-col">
        <div className="mx-5 mt-0 flex flex-1 items-center text-center md:px-6 lg:mx-[138px] lg:mt-[-112px]">
          <div>
            <h1 className="heading-1 text-cream block text-left whitespace-pre-line md:hidden">{t("titleSp")}</h1>
            <h1 className="heading-1 text-cream hidden text-left whitespace-pre-line md:block">{t("title")}</h1>
            <p className="text-cream text-1 mt-6 text-left whitespace-pre-line md:mt-10">{t("description")}</p>
          </div>
        </div>
      </div>
    </LayoutBackground>
  );
};

export default CompletePage;
