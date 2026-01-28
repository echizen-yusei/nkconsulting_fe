"use client";
import { useTranslations } from "next-intl";
import ClubAnnualFeeItem from "@/components/molecules/ClubAnnualFeeItem";

const ClubAnnualFee = () => {
  const t = useTranslations("HomePage");

  const plans = [
    {
      title: t("clubAnnualFee.plans.plan1.title"),
      price: t("clubAnnualFee.plans.plan1.price"),
      subPrice: t("clubAnnualFee.plans.plan1.subPrice"),
      list: t.raw("clubAnnualFee.plans.plan1.list") as string[],
      borderBottomColor: t("clubAnnualFee.plans.plan1.borderBottomColor"),
    },
    {
      title: t("clubAnnualFee.plans.plan2.title"),
      price: t("clubAnnualFee.plans.plan2.price"),
      subPrice: t("clubAnnualFee.plans.plan2.subPrice"),
      list: t.raw("clubAnnualFee.plans.plan2.list") as string[],
      borderBottomColor: t("clubAnnualFee.plans.plan2.borderBottomColor"),
    },
    {
      title: t("clubAnnualFee.plans.plan3.title"),
      price: t("clubAnnualFee.plans.plan3.price"),
      subPrice: t("clubAnnualFee.plans.plan3.subPrice"),
      list: t.raw("clubAnnualFee.plans.plan3.list") as string[],
      borderBottomColor: t("clubAnnualFee.plans.plan3.borderBottomColor"),
    },
  ];

  return (
    <div className={"bg-cream/20 rounded-md px-6 py-16 backdrop-blur-xs md:p-16"}>
      <div>
        <h1 className="heading-2-36 text-cream text-center">
          {t.rich("clubAnnualFee.title", {
            highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
          })}
        </h1>
      </div>
      <p className="text-cream text-1 my-6 text-center md:my-12">{t("clubAnnualFee.description")}</p>
      <div className="gap-spacing-lg flex flex-wrap md:mt-16">
        {plans.map((item) => (
          <ClubAnnualFeeItem
            key={item.title}
            title={item.title}
            price={item.price}
            subPrice={item.subPrice}
            list={item.list}
            borderBottomColor={item.borderBottomColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ClubAnnualFee;
