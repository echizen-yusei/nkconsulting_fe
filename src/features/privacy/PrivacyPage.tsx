"use client";
import LayoutBackground from "@/components/layout/LayoutBackground";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useTranslations } from "next-intl";

type PrivacyPageProps = {
  initialIsMobile: boolean;
};

const PrivacyPage = ({ initialIsMobile }: PrivacyPageProps) => {
  const isMobile = useResponsiveScreen(initialIsMobile);
  const t = useTranslations("privacy");
  return (
    <LayoutBackground zIndex="md:z-10" isShowFooter={isMobile}>
      <div className="flex justify-center">
        <div className="max-w-xxl md:bg-cream/20 mx-6 mt-[122px] mb-[75px] rounded-[8px] md:mx-12 md:mt-[176px] md:px-8 md:py-[64px] md:backdrop-blur-xs lg:px-[114px] lg:py-[64px]">
          <h1 className="heading-1 text-cream pointer-events-auto mb-6 font-bold md:mb-8">{t("title")}</h1>
          <span className="text-1 text-cream word-break-all pointer-events-auto whitespace-pre-wrap">{t("description")}</span>
        </div>
      </div>
    </LayoutBackground>
  );
};

export default PrivacyPage;
