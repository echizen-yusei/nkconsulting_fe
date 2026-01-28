"use client";

import { useEffect, useMemo } from "react";
import DynamicLayout from "@/components/layout/DynamicLayout";
import { PLAN_CAN_UPGRADE, PLAN_TYPE } from "@/constants";
import { cn, isEmpty } from "@/libs/utils";
import { useMemberPlanMe } from "@/services/membership-infomation";
import { useTranslations } from "next-intl";
import usePayment from "@/hooks/usePayment";
import { PaymentTab } from "@/types/payment";
import useNavigation from "@/hooks/useNavigation";
import { PAGE } from "@/constants/page";
import CurrentPlanSkeleton from "@/components/molecules/CurrentPlanSkeleton";
import UpgradeablePlanInfo from "@/components/molecules/UpgradeablePlanInfo";
import CurrentPlanInfo from "@/components/molecules/CurrentPlanInfo";
import BillingUpgradePlanInfo from "@/components/molecules/BillingUpgradePlanInfo";
import UpgradePlanPaymentSection from "@/components/molecules/UpgradePlanPaymentSection";
import { useMemberInfoContext } from "@/components/providers/MemberInfoProvider";
import { useSetAtom } from "jotai";
import { customEventTabTitleAtom } from "@/atoms/user-atoms";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";

export const UpgradePlan = () => {
  const t = useTranslations("upgradePlan");
  const { router } = useNavigation();
  const { setBreadcrumbCustom } = useMemberInfoContext();
  const setCustomEventTabTitle = useSetAtom(customEventTabTitleAtom);
  const handleShowError = useErrorHandler();

  const { data: memberPlanMe, isLoading: isLoadingMemberPlanMe, refetch: refetchMemberPlanMe, error } = useMemberPlanMe();
  const { setPaymentTab, setPaymentData, paymentTab, paymentData } = usePayment();

  const existingCard = memberPlanMe?.member_plan?.card;

  const handleSelectPaymentMethod = (useExistingCard: boolean) => {
    setPaymentTab(useExistingCard ? PaymentTab.create : PaymentTab.addNewCard);
  };

  const upgradeablePlans = memberPlanMe?.member_plan?.upgradeable_plans;
  const currentPlanType = memberPlanMe?.member_plan?.current_plan?.plan_type;

  const isCanUpgrade = useMemo(() => {
    return !isEmpty(upgradeablePlans) && PLAN_CAN_UPGRADE.includes(currentPlanType as keyof typeof PLAN_TYPE);
  }, [upgradeablePlans, currentPlanType]);

  const handleBackToCreate = () => {
    setPaymentTab(PaymentTab.addNewCard);
  };

  const isRootPaymentTab = [PaymentTab.create, PaymentTab.addNewCard].includes(paymentTab);
  const isConfirmPaymentTab = paymentTab === PaymentTab.confirm;

  const handleBack = () => {
    if (isRootPaymentTab) {
      router.push(PAGE.MEMBERSHIP_INFORMATION);
    } else {
      setPaymentTab(PaymentTab.addNewCard);
    }
  };

  const upgradeMemberPlan = memberPlanMe?.member_plan?.upgradeable_plans?.[0];
  const planUpgradeData = {
    plan_type: upgradeMemberPlan?.plan_type ?? "",
    plan_fee: upgradeMemberPlan?.upgrade_fee ?? 0,
  };

  const currentPlan = memberPlanMe?.member_plan?.current_plan;
  const isLoadingUpgradePlanStatus = !!memberPlanMe?.member_plan?.is_pending_upgrade;

  useEffect(() => {
    if (!isLoadingUpgradePlanStatus) return;

    const interval = setInterval(refetchMemberPlanMe, 1000);

    return () => clearInterval(interval);
  }, [isLoadingUpgradePlanStatus, refetchMemberPlanMe]);

  useEffect(() => {
    if (isRootPaymentTab) {
      setCustomEventTabTitle(t("planChange"));
      setBreadcrumbCustom([
        { label: t("membershipInformation"), href: PAGE.MEMBERSHIP_INFORMATION },
        { label: t("planChange"), href: PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN, isActive: true },
      ]);
    }
    return () => {
      setCustomEventTabTitle(null);
    };
  }, [isConfirmPaymentTab, isRootPaymentTab, setBreadcrumbCustom, setCustomEventTabTitle, setPaymentTab, t]);

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData> });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <DynamicLayout title={t("title")} onBack={handleBack} isLoading={isLoadingUpgradePlanStatus} isBackCurentTab={paymentTab === PaymentTab.confirm}>
      <div className="flex flex-col gap-6 md:flex-row md:gap-12">
        {isConfirmPaymentTab && <div className="text-1 text-cream flex-1 whitespace-pre-line">{t("confirmPayment.description")}</div>}
        {isRootPaymentTab && (
          <div className="flex flex-1 flex-col gap-6 md:gap-12">
            {isLoadingMemberPlanMe ? <CurrentPlanSkeleton /> : currentPlan && <CurrentPlanInfo currentPlan={currentPlan} />}
            {upgradeMemberPlan && <UpgradeablePlanInfo key={upgradeMemberPlan?.plan_type} plan={upgradeMemberPlan} />}
            {isCanUpgrade && <BillingUpgradePlanInfo planFee={upgradeMemberPlan?.upgrade_fee ?? 0} />}
          </div>
        )}
        {isLoadingMemberPlanMe ? (
          <div
            className={cn(
              "h-fit w-full rounded-md",
              isConfirmPaymentTab ? "flex-1 2xl:w-1/3 2xl:min-w-[432px]" : "bg-gray333 min-h-[452px] p-6 md:w-1/3 md:min-w-[432px]",
            )}
          >
            <div className={cn("bg-cream/20 h-6 w-32 animate-pulse rounded", isConfirmPaymentTab ? "w-full" : "w-1/3")}></div>
          </div>
        ) : (
          <UpgradePlanPaymentSection
            isLoading={isLoadingMemberPlanMe}
            isCanUpgrade={isCanUpgrade}
            paymentTab={paymentTab}
            existingCard={existingCard}
            planUpgradeData={planUpgradeData}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            setPaymentTab={setPaymentTab}
            onSelectPaymentMethod={handleSelectPaymentMethod}
            onBackToCreate={handleBackToCreate}
            t={t}
            setCustomEventTabTitle={setCustomEventTabTitle}
            setBreadcrumbCustom={setBreadcrumbCustom}
          />
        )}
      </div>
    </DynamicLayout>
  );
};
