"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import logo from "../../../../public/assets/images/logo.png";
import Link from "next/link";
import { PAGE } from "@/constants/page";

const Footer = () => {
  const t = useTranslations("Footer");

  const footerControl = () => (
    <div className="mt-12 flex flex-col gap-2 md:mt-0 md:flex-col md:gap-4">
      <Link href={PAGE.PRIVACY_POLICY} className="text-1 text-cream text-left md:text-right">
        {t("privacyPolicy")}
      </Link>
      <Link href={PAGE.MEMBERSHIP_TERMS} className="text-1 text-cream text-left md:text-right">
        {t("member")}
      </Link>
      <Link href={PAGE.LEGAL_NOTICE} className="text-1 text-cream text-left md:text-right">
        {t("specificBusinessTransactions")}
      </Link>
    </div>
  );

  return (
    <div className={`bg-black-custom h-[484px] px-6 pt-[64px] pb-[127px] md:h-[462px] md:px-12 md:py-30`}>
      <Image src={logo} alt="logo" width={80} height={43} priority className="h-10 w-20 md:h-12 md:w-24" />
      <div className="md:hidden">{footerControl()}</div>
      <div className="mt-12 flex items-center justify-between">
        <div className="flex flex-col gap-2 md:gap-4">
          <p className="text-1 text-cream">{t("companyName")}</p>
          <p className="text-1 text-cream">{t("postalCode")}</p>
          <p className="text-1 text-cream">{t("address")}</p>
        </div>
        <div className="hidden md:block">{footerControl()}</div>
      </div>
    </div>
  );
};

export default Footer;
