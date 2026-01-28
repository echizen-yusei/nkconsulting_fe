"use client";

import Button from "@/components/atoms/Button/Button";
import SectionHeader from "@/components/atoms/SectionHeader";
import DynamicLayout from "@/components/layout/DynamicLayout";
import { planName } from "@/constants";
import { PAGE } from "@/constants/page";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import useNavigation from "@/hooks/useNavigation";
import { formatDate } from "@/libs/utils";
import { useGetUpgradePlanStatusQuery } from "@/services/membership-infomation";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const UpgradePlanComplete = () => {
  const t = useTranslations("upgradePlanComplete");
  const handleShowError = useErrorHandler();
  const { router } = useNavigation();

  const { data: upgradePlanStatus, isLoading: isLoadingUpgradePlanStatus, error } = useGetUpgradePlanStatusQuery();

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData> });
    }
  }, [error, handleShowError]);

  return (
    <DynamicLayout title={t("title")} isLoading={isLoadingUpgradePlanStatus}>
      <div>
        <SectionHeader title={t("sectionHeader")} />
        <div className="mt-6 flex flex-col gap-6 md:mt-12">
          <div className="text-cream text-1 whitespace-pre-line">{t("description")}</div>
          <div>
            <div className="text-cream text-1 whitespace-pre-line">
              {t("changes", {
                planName: planName[upgradePlanStatus?.data.plan_type as keyof typeof planName],
                startDate: formatDate(upgradePlanStatus?.data.current_period_change_date ?? ""),
                nextDueOn: formatDate(upgradePlanStatus?.data.current_period_end_date ?? ""),
              })}
            </div>
          </div>
          <div className="text-cream text-1 whitespace-pre-line">{t("paymentDescription")}</div>
          <div className="text-cream text-1 whitespace-pre-line">{t("usageDescription")}</div>
        </div>
        <Button
          type="button"
          buttonType="outline"
          className="heading-5 mt-6 h-14! w-full max-w-[527px] py-0!"
          onClick={() => router.push(PAGE.MEMBERSHIP_INFORMATION)}
        >
          {t("backToMembershipInfo")}
        </Button>
      </div>
    </DynamicLayout>
  );
};

export default UpgradePlanComplete;
