"use client";
import { useTranslations } from "next-intl";
import useWindowSize from "@/hooks/useWindowSize";
import useScreen from "@/hooks/useScreen";
import Image from "next/image";
import bottomBannerFull from "../../../../../public/assets/images/bottom-banner-full.png";
import bottomBanner from "../../../../../public/assets/images/bottom-banner.png";
import Button from "@/components/atoms/Button/Button";
import Link from "next/link";

const VisitWebsite = () => {
  const t = useTranslations("HomePage");
  const { width } = useWindowSize();
  const isMinWidth = width <= 1116;
  const { isMobile } = useScreen();

  const renderContent = () => {
    if (isMobile) {
      return (
        <div className="relative h-[356px]">
          <Image src={bottomBannerFull} alt="Visit Website" quality={80} width={width} height={356} className="h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 px-6 pt-[64px]">
            <h2 className="heading-2-36 text-cream text-left">
              {t.rich("visitWebsite.title", {
                highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
              })}
            </h2>
            <p className="text-1 text-cream mt-12 text-left whitespace-pre-line">{t("visitWebsite.descriptionSp")}</p>
            <Button buttonType="secondary" className="heading-5 mt-12 w-full" style={{ letterSpacing: "-0.6px", height: "56px", padding: "0" }}>
              <Link href="https://azure-forest-yokohama.jp" target="_blank">
              {t("visitWebsite.button")}
              </Link>
            </Button>
            {/* TODO: Add button when it is implemented */}
          </div>
        </div>
      );
    }
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
        <Image src={bottomBanner} alt="Visit Website" quality={80} className="h-auto w-full object-cover" />
        <div
          className={`${
            isMinWidth ? "px-12" : "px-[162px]"
          } absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-between`}
        >
          <div>
            <h2 className="heading-2-36 text-cream text-left">
              {t.rich("visitWebsite.title", {
                highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
              })}
            </h2>
            <p className="text-1 text-cream mt-10 text-left">{t("visitWebsite.description")}</p>
          </div>
          <Button buttonType="secondary" className="heading-5" style={{ letterSpacing: "-0.6px" }}>
            <Link href="https://azure-forest-yokohama.jp" target="_blank">
            {t("visitWebsite.button")}
            </Link>
          </Button>
          {/* TODO: Add button when it is implemented */}
        </div>
      </div>
    );
  };

  return renderContent();
};

export default VisitWebsite;
