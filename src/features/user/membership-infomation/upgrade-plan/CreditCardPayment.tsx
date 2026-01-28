"use client";

import CreditCardForm from "@/components/molecules/CreditCardForm";
import { PaymentFormDataType, PaymentTab } from "@/types/payment";
import MemberPlanStripeProvider, { useMemberPlanStripeContext } from "@/components/providers/MemberPlanStripeProvider";

import CurrentPaymentCard from "@/components/molecules/CurrentPaymentCard";
import { useSetupIntentsConfirm } from "@/services/membership-infomation";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";
import { LoadingSpinnerPortal } from "@/components/atoms/Loading";
import { useTranslations } from "next-intl";
import { BreadcrumbItem } from "@/components/molecules/Breadcrumb";
import { PAGE } from "@/constants/page";
import { useEffect } from "react";

type CreditCardPaymentProps = {
  containerClassName?: string;
  cvcLabel?: string;
  isExistingCard: boolean;
  setUseExistingCard: (useExistingCard: boolean) => void;
  planUpgrade: {
    plan_type: string;
    plan_fee: number;
  };
  paymentTab: PaymentTab;
  paymentData: PaymentFormDataType;
  setPaymentData: (paymentData: PaymentFormDataType) => void;
  setPaymentTab: (tabIndex: PaymentTab) => void;
  setCustomEventTabTitle: (title: string | null) => void;
  setBreadcrumbCustom: (breadcrumb: BreadcrumbItem[]) => void;
};

const CreditCardFormContent = ({
  containerClassName,
  cvcLabel,
  isExistingCard,
  setUseExistingCard,
  planUpgrade,
  paymentTab,
  paymentData,
  setPaymentData,
  setPaymentTab,
  setCustomEventTabTitle,
  setBreadcrumbCustom,
}: CreditCardPaymentProps) => {
  const t = useTranslations("upgradePlan.paymentMethod");
  const t2 = useTranslations("upgradePlan");
  const { clientSecret, loadStripeData } = useMemberPlanStripeContext();
  const { mutate: confirmSetupIntents, isPending: isLoadingConfirmSetupIntents } = useSetupIntentsConfirm();
  const handleShowError = useErrorHandler();

  const handleBack = () => {
    loadStripeData();
    setPaymentTab(PaymentTab.addNewCard);
  };

  const handleConfirmCreditCardForm = (onSuccess: () => void) => {
    confirmSetupIntents(
      {
        setup_intent_id: paymentData?.paymentMethodId ?? "",
        card_holder_name: paymentData?.name ?? "",
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error) => {
          handleShowError({ error: error as AxiosError<ErrorResponseData> });
        },
      },
    );
  };

  const isRootPaymentTab = [PaymentTab.create, PaymentTab.addNewCard].includes(paymentTab);
  const isConfirmPaymentTab = paymentTab === PaymentTab.confirm;

  useEffect(() => {
    if (isConfirmPaymentTab) {
      setCustomEventTabTitle(t2("additionalFeePaymentConfirmation"));
      setBreadcrumbCustom([
        { label: t2("membershipInformation"), href: PAGE.MEMBERSHIP_INFORMATION },
        {
          label: t2("planChange"),
          href: PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN,
          onClick: () => {
            loadStripeData();
            setPaymentTab(PaymentTab.addNewCard);
          },
        },
        { label: t2("paymentConfirmation"), href: PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN, isActive: true },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmPaymentTab, t2]);

  return (
    <div>
      {isLoadingConfirmSetupIntents && <LoadingSpinnerPortal />}
      <div className={isConfirmPaymentTab ? "block" : "hidden"}>
        <CurrentPaymentCard
          card={{
            card_holder_name: paymentData?.name ?? "",
            last4: paymentData?.creditCardNumber?.slice(-4) ?? "",
            exp_month: parseInt(paymentData?.expirationDate?.split("/")[0] ?? ""),
            exp_year: parseInt(paymentData?.expirationDate?.split("/")[1] ?? ""),
            paymentMethodId: paymentData?.paymentMethodId ?? "",
          }}
          planUpgrade={planUpgrade}
          isNewBankUpgrade={true}
          isExistingCard={isExistingCard}
          onBack={handleBack}
          onConfirmCreditCardForm={handleConfirmCreditCardForm}
          buttonText={{
            confirm: t("pay"),
            back: t("modify"),
          }}
        />
      </div>
      <div className={isRootPaymentTab ? "block" : "hidden"}>
        <CreditCardForm
          setPaymentData={setPaymentData}
          setPaymentTab={setPaymentTab}
          containerClassName={containerClassName}
          cvcLabel={cvcLabel}
          clientSecret={clientSecret ?? ""}
          isExistingCard={isExistingCard}
          setUseExistingCard={setUseExistingCard}
        />
      </div>
    </div>
  );
};

export const CreditCardPayment = (props: CreditCardPaymentProps) => {
  return (
    <MemberPlanStripeProvider>
      <CreditCardFormContent {...props} />
    </MemberPlanStripeProvider>
  );
};
