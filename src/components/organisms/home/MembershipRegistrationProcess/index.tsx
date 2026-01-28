"use client";
import React from "react";
import MembershipRegistrationProcessItem from "@/components/molecules/MembershipRegistrationProcessItem";
import { useTranslations } from "next-intl";
import useScreen from "@/hooks/useScreen";

const MembershipRegistrationProcess = () => {
  const t = useTranslations("HomePage");
  const { isMobile } = useScreen();
  const data = [
    {
      title: t("membershipRegistrationProcess.item1.title"),
      description: t("membershipRegistrationProcess.item1.description"),
      image: "/assets/images/icon-list-1.png",
    },
    {
      title: t("membershipRegistrationProcess.item2.title"),
      description: isMobile ? t("membershipRegistrationProcess.item2.descriptionSp") : t("membershipRegistrationProcess.item2.description"),
      image: "/assets/images/icon-list-2.png",
    },
    {
      title: t("membershipRegistrationProcess.item3.title"),
      description: isMobile ? t("membershipRegistrationProcess.item3.descriptionSp") : t("membershipRegistrationProcess.item3.description"),
      image: "/assets/images/icon-list-3.png",
    },
    {
      title: t("membershipRegistrationProcess.item4.title"),
      description: t("membershipRegistrationProcess.item4.description"),
      image: "/assets/images/icon-list-4.png",
    },
  ];
  return (
    <div>
      <h1 className="heading-2-36 text-cream text-center">
        {t.rich("membershipRegistrationProcess.title", {
          highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
        })}
      </h1>
      <div className="gap-spacing-lg mt-12 flex flex-wrap md:mt-16">
        {data.map((item, index) => (
          <MembershipRegistrationProcessItem key={index} image={item.image} title={item.title} description={item.description} />
        ))}
      </div>
    </div>
  );
};

export default MembershipRegistrationProcess;
