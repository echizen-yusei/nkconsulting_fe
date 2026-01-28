"use client";

import { CreditCardPayment } from "@/features/user/membership-infomation/upgrade-plan/CreditCardPayment";
import { cn } from "@/libs/utils";
import CurrentPaymentCard from "../CurrentPaymentCard";
import { PaymentFormDataType, PaymentTab } from "@/types/payment";
import { Card } from "@/types/membership-infomation";
import { BreadcrumbItem } from "../Breadcrumb";

type Props = {
  isLoading: boolean;
  isCanUpgrade: boolean;
  paymentTab: PaymentTab;
  existingCard?: Card | null;
  planUpgradeData: {
    plan_type: string;
    plan_fee: number;
  };
  paymentData: PaymentFormDataType;
  setPaymentData: (data: PaymentFormDataType) => void;
  setPaymentTab: (tab: PaymentTab) => void;
  onSelectPaymentMethod: (useExistingCard: boolean) => void;
  onBackToCreate: () => void;
  t: (key: string) => string;
  setCustomEventTabTitle: (title: string | null) => void;
  setBreadcrumbCustom: (breadcrumb: BreadcrumbItem[]) => void;
};

const UpgradePlanPaymentSection = ({
  isLoading,
  isCanUpgrade,
  paymentTab,
  existingCard,
  planUpgradeData,
  paymentData,
  setPaymentData,
  setPaymentTab,
  onSelectPaymentMethod,
  onBackToCreate,
  setCustomEventTabTitle,
  setBreadcrumbCustom,
  t,
}: Props) => {
  const isConfirmTab = paymentTab === PaymentTab.confirm;
  const isAddNewCardTab = paymentTab === PaymentTab.addNewCard;
  const isCreateWithoutCard = paymentTab === PaymentTab.create && !existingCard;
  const shouldShowCreditCardPayment = isConfirmTab || isAddNewCardTab || isCreateWithoutCard;
  const shouldShowCurrentPaymentCard = paymentTab === PaymentTab.create && existingCard;

  if (isLoading) {
    return (
      <div className="bg-gray333 min-h-[452px] w-full rounded-md p-6 md:w-1/3 md:min-w-[432px]">
        <div className="bg-cream/20 h-6 w-32 animate-pulse rounded" />
      </div>
    );
  }

  if (!isCanUpgrade) {
    return <div className="min-h-[452px] w-full p-6 md:w-1/3 md:min-w-[432px]" />;
  }

  return (
    <div
      className={cn(
        "h-fit w-full rounded-md md:sticky md:top-[141px]",
        isConfirmTab ? "flex-1 2xl:w-1/3 2xl:min-w-[432px]" : "bg-gray333 min-h-[452px] p-6 md:w-1/3 md:min-w-[432px]",
      )}
    >
      {shouldShowCreditCardPayment && (
        <CreditCardPayment
          containerClassName="w-full"
          cvcLabel={t("form.label.cvvSp")}
          isExistingCard={paymentTab !== PaymentTab.create && !!existingCard}
          setUseExistingCard={onSelectPaymentMethod}
          planUpgrade={planUpgradeData}
          paymentTab={paymentTab}
          paymentData={paymentData}
          setPaymentData={setPaymentData}
          setPaymentTab={setPaymentTab}
          setCustomEventTabTitle={setCustomEventTabTitle}
          setBreadcrumbCustom={setBreadcrumbCustom}
        />
      )}

      {shouldShowCurrentPaymentCard && (
        <CurrentPaymentCard
          isNewBankUpgrade={false}
          card={existingCard}
          planUpgrade={planUpgradeData}
          onBack={onBackToCreate}
          isExistingCard
          buttonText={{
            confirm: t("paymentMethod.processPayment"),
            back: t("paymentMethod.changeRegisteredCard"),
          }}
        />
      )}
    </div>
  );
};

export default UpgradePlanPaymentSection;
