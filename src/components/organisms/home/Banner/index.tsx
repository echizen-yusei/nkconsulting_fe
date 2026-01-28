"use client";
import topBanner from "../../../../../public/assets/images/background_top.png";

import { useTranslations } from "next-intl";
import Image from "next/image";

const Banner = () => {
  const t = useTranslations("HomePage");

  return (
    <>
      <div className="flex min-h-dvh w-full flex-col justify-center px-6 text-left md:hidden">
        <h1 className="heading-1 text-cream noto-serif-jp whitespace-pre-line">
          {t.rich("titleSp", {
            highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
          })}
        </h1>
        <p className="text-cream text-1 mt-5 whitespace-pre-line">{t("descriptionSp")}</p>
      </div>
      <div className="relative hidden max-h-screen overflow-hidden md:block">
        <Image src={topBanner} alt="background_top" quality={70} className="hidden h-auto w-full object-cover opacity-0 md:block" priority />
        <div className={`absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-left md:px-12 lg:px-[162px]`}>
          <h1 className="heading-1 text-cream noto-serif-jp">
            {t.rich("title", {
              highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
            })}
          </h1>
          <p className="text-cream text-1 mt-10">{t("description")}</p>
        </div>
      </div>
    </>
  );
};

export default Banner;
