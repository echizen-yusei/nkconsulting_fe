"use client";

import { Card } from "@/types/membership-infomation";
import { useTranslations } from "next-intl";
import Button from "@/components/atoms/Button/Button";
import { useGetUpgradePlanStatus, useUpgradeMemberPlan, useUpgradeMemberPlanWithNewBank } from "@/services/membership-infomation";
import { PLAN_TYPE } from "@/constants";
import { LoadingSpinnerPortal } from "@/components/atoms/Loading";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";
import useNavigation from "@/hooks/useNavigation";
import { PAGE } from "@/constants/page";
import CardInfoItem from "@/components/atoms/CardInfoItem";
import { formatCurrencyWithUnit } from "@/libs/utils";
import { useState } from "react";

type PaymentMethodSelectorProps = {
  card: Card & { paymentMethodId?: string };
  updateWithPlanType?: string;
  planUpgrade: {
    plan_type: string;
    plan_fee: number;
  };
  isNewBankUpgrade: boolean;
  isExistingCard?: boolean;
  onBack: () => void;
  onConfirmCreditCardForm?: (onSuccess: () => void) => void;
  buttonText?: {
    confirm: string;
    back: string;
  };
};

export const CurrentPaymentCard = ({
  card,
  updateWithPlanType = PLAN_TYPE.keieisha,
  planUpgrade,
  isNewBankUpgrade = false,
  onBack,
  onConfirmCreditCardForm,
  isExistingCard,
  buttonText,
}: PaymentMethodSelectorProps) => {
  const t = useTranslations("upgradePlan.paymentMethod");
  const { router } = useNavigation();
  const { mutate: upgradeMemberPlan, isPending: isLoadingUpgradeMemberPlan } = useUpgradeMemberPlan();
  const { mutate: upgradeMemberPlanWithNewBank, isPending: isLoadingUpgradeMemberPlanWithNewBank } = useUpgradeMemberPlanWithNewBank();
  const { mutate: getUpgradePlanStatus } = useGetUpgradePlanStatus();
  const [isLoading, setIsLoading] = useState(false);

  const handleShowError = useErrorHandler();

  const pollUpgradeStatus = () => {
    getUpgradePlanStatus(undefined, {
      onSuccess: (res) => {
        if (!res) return;

        if (res.data.is_pending_upgrade) {
          setTimeout(pollUpgradeStatus, 1000);
        } else {
          setIsLoading(false);
          router.push(PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN_COMPLETE);
        }
      },
      onError: (error) => {
        handleShowError({ error: error as AxiosError<ErrorResponseData> });
        setIsLoading(false);
      },
    });
  };

  const handleUpgradeMemberPlan = () => {
    setIsLoading(true);
    if (isExistingCard) {
      upgradeMemberPlan(
        { plan_type: updateWithPlanType },
        {
          onSuccess: () => {
            pollUpgradeStatus();
          },
          onError: (error) => {
            handleShowError({ error: error as AxiosError<ErrorResponseData> });
            setIsLoading(false);
          },
        },
      );
      return;
    }
    upgradeMemberPlanWithNewBank(
      { plan_type: updateWithPlanType },
      {
        onSuccess: () => {
          pollUpgradeStatus();
        },
        onError: (error) => {
          handleShowError({ error: error as AxiosError<ErrorResponseData> });
          setIsLoading(false);
        },
      },
    );
  };

  const handleConfirmCreditCardForm = () => {
    if (onConfirmCreditCardForm && isNewBankUpgrade) {
      onConfirmCreditCardForm(handleUpgradeMemberPlan);
      return;
    }
    handleUpgradeMemberPlan();
  };

  const cardInfoItems = [
    { label: t("usageAmount"), value: formatCurrencyWithUnit({ value: planUpgrade.plan_fee ?? 0, unit: "(税込)", style: "currency" }) },
    { label: t("cardBrand"), value: card.card_holder_name },
    { label: t("cardNumber"), value: `**** **** **** ${card.last4}` },
    { label: t("expirationDate"), value: `${card.exp_month}/${card.exp_year}` },
    { label: t("securityCode"), value: t("securityCodePlaceholder") },
  ];

  return (
    <div className="flex flex-col gap-4">
      {(isLoadingUpgradeMemberPlan || isLoadingUpgradeMemberPlanWithNewBank || isLoading) && <LoadingSpinnerPortal />}
      <div className="flex flex-col gap-6 rounded-md">
        {cardInfoItems.map((item) => (
          <CardInfoItem key={item.label} label={item.label} value={item.value} />
        ))}
        <Button buttonType="secondary" className="heading-5 h-14! w-full py-0!" onClick={handleConfirmCreditCardForm} isDisabled={isLoadingUpgradeMemberPlan}>
          {buttonText?.confirm}
        </Button>
        <Button buttonType="outline" className="heading-5 h-14! w-full py-0!" onClick={onBack}>
          {buttonText?.back}
        </Button>
      </div>
    </div>
  );
};

export default CurrentPaymentCard;
