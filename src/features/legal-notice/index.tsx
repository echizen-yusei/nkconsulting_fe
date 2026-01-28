"use client";
import LayoutBackground from "@/components/layout/LayoutBackground";
import Footer from "@/components/organisms/Footer/Footer";
import { cn } from "@/libs/utils";
import { useTranslations } from "next-intl";

const LegalNoticePage = () => {
  const t = useTranslations("legalNotice");
  const legalNoticeContent = [
    {
      label: t("businessName.label"),
      value: t("businessName.value"),
    },
    {
      label: t("representative.label"),
      value: t("representative.value"),
    },
    {
      label: t("address.label"),
      value: t("address.value"),
    },
    {
      label: t("contact.label"),
      value: t("contact.value"),
    },
    {
      label: t("manager.label"),
      value: t("manager.value"),
    },
    {
      label: t("serviceFee.label"),
      value: t("serviceFee.value"),
    },
    {
      label: t("additionalFee.label"),
      value: t("additionalFee.value"),
      labelSp: t("additionalFee.labelSp"),
      isNotNewLineSp: true,
    },
    {
      label: t("refundPolicy.label"),
      value: t("refundPolicy.value"),
    },
    {
      label: t("cancellationPolicy.label"),
      value: t("cancellationPolicy.value"),
    },
    {
      label: t("disclosureOfInformation.label"),
      value: t("disclosureOfInformation.value"),
    },
    {
      label: t("paymentPeriod.label"),
      value: t("paymentPeriod.value"),
    },
  ];

  return (
    <LayoutBackground zIndex="md:z-10" isShowFooter={false}>
      <div className="flex w-full justify-center">
        <div className="md:bg-cream/20 max-w-xxl mx-6 mt-[122px] mb-8 w-full rounded-[8px] md:mx-12 md:mt-[176px] md:mb-[75px] md:px-0 md:py-[64px] md:backdrop-blur-xs lg:px-[114px] lg:py-[64px]">
          <h1 className="heading-1 text-cream pointer-events-auto mb-8 font-bold md:mb-8">{t("title")}</h1>
          <div className="flex flex-col gap-6">
            {legalNoticeContent.map((item) => (
              <div key={item.label} className="flex flex-col gap-2 md:flex-row md:gap-6">
                <div
                  className={cn(
                    "text-1 text-cream pointer-events-auto flex-1 whitespace-pre-wrap md:max-w-[176px]",
                    item?.isNotNewLineSp ? "hidden md:block" : "",
                  )}
                >
                  {item.label}
                </div>
                {item?.isNotNewLineSp && <div className="text-1 text-cream pointer-events-auto flex-1 whitespace-normal md:hidden">{item.labelSp}</div>}
                <div className="text-1 text-cream pointer-events-auto flex-1 whitespace-pre-wrap">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="text-1 text-cream pointer-events-auto mt-6">{t("version")}</div>
        </div>
      </div>
      <div className="md:hidden">
        <Footer />
      </div>
    </LayoutBackground>
  );
};

export default LegalNoticePage;
