"use client";

import BenefitsItem from "@/components/molecules/BenefitsItem";
import { useTranslations } from "next-intl";
import useScreen from "@/hooks/useScreen";
import benefits1Sp from "../../../../../public/assets/images/benefits_1_sp.png";
import benefits1 from "../../../../../public/assets/images/benefits_1.png";
import benefits2Sp from "../../../../../public/assets/images/benefits_2_sp.png";
import benefits2 from "../../../../../public/assets/images/benefits_2.png";
import benefits3Sp from "../../../../../public/assets/images/benefits_3_sp.png";
import benefits3 from "../../../../../public/assets/images/benefits_3.png";

const MemberBenefits = () => {
  const t = useTranslations("HomePage");
  const { isMobile } = useScreen();
  const data = [
    {
      title: t("benefits.item1.title"),
      description: isMobile ? t("benefits.item1.descriptionSp") : t("benefits.item1.description"),
      image: isMobile ? benefits1Sp : benefits1,
    },
    {
      title: t("benefits.item2.title"),
      description: isMobile ? t("benefits.item2.descriptionSp") : t("benefits.item2.description"),
      image: isMobile ? benefits2Sp : benefits2,
    },
    {
      title: t("benefits.item3.title"),
      description: isMobile ? t("benefits.item3.descriptionSp") : t("benefits.item3.description"),
      image: isMobile ? benefits3Sp : benefits3,
    },
  ];
  return (
    <div>
      <h1 className="heading-2-36 text-cream block text-center whitespace-pre-line md:hidden">
        NK <span className="text-red-primary">C</span>
        onsulting{t("benefits.titleSp")}
      </h1>

      <h1 className="heading-2-36 text-cream hidden text-center whitespace-pre-line md:block">
        {t.rich("benefits.title", {
          highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
        })}
      </h1>
      <div className="gap-spacing-lg mt-12 flex flex-wrap md:mt-16">
        {data.map((item, index) => (
          <BenefitsItem key={index} image={item.image} title={item.title} description={item.description} />
        ))}
      </div>
    </div>
  );
};

export default MemberBenefits;
