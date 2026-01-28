"use client";
import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import SectionHeader from "@/components/atoms/SectionHeader";
import { useEffect } from "react";
import { actionScrollToTop } from "@/libs";
import Button from "@/components/atoms/Button/Button";
import useNavigation from "@/hooks/useNavigation";
import { PAGE } from "@/constants/page";
import { PaymentFormDataType, PaymentTab } from "@/types/payment";
import { useConfirmSetupIntent } from "@/services/payment";
import LoadingSpinner from "@/components/atoms/Loading";
import { AxiosError } from "axios";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { useStripeContext } from "../StripeProvider";

type PaymentConfirmPageProps = {
  paymentData: PaymentFormDataType;
  setPaymentTab: (paymentTab: PaymentTab) => void;
};

const PaymentConfirmPage = ({ paymentData, setPaymentTab }: PaymentConfirmPageProps) => {
  const t = useTranslations("paymentConfirm");
  const tBreadcrumb = useTranslations("breadcrumb");
  const { router } = useNavigation();
  const { mutate: confirmSetupIntent, isPending: isLoadingConfirmSetupIntent } = useConfirmSetupIntent();
  const { loadStripeData } = useStripeContext();
  const handleShowError = useErrorHandler();

  const renderItem = (label: string, value: string) => {
    return (
      <div className="border-cream flex w-full items-start justify-between gap-8 border-b pb-1.5">
        <span className="heading-5 text-cream whitespace-nowrap">{label}</span>
        <span className="heading-5 text-cream break-all whitespace-pre-wrap">{value}</span>
      </div>
    );
  };
  const handleSubmit = () => {
    if (!paymentData.name || !paymentData.paymentMethodId || !paymentData.user_id) {
      return;
    }
    const data = {
      user: { user_id: paymentData.user_id ?? "" },
      setup_intent: {
        payment_method_id: paymentData.paymentMethodId as string,
        card_holder_name: paymentData.name as string,
      },
    };
    confirmSetupIntent(data, {
      onSuccess: () => {
        router.push(PAGE.REGISTER_MEMBER_COMPLETE);
      },
      onError: (error) => {
        handleShowError({ error: error as AxiosError<ErrorResponseData> });
      },
    });
  };

  const handleBack = () => {
    loadStripeData();
    setPaymentTab(PaymentTab.create);
  };

  const breadcrumbItems = [
    {
      label: tBreadcrumb("home"),
      href: PAGE.HOME,
    },
    {
      label: tBreadcrumb("login"),
      href: PAGE.LOGIN,
    },
    {
      label: tBreadcrumb("registerMember"),
      href: PAGE.REGISTER_MEMBER,
    },
    {
      label: tBreadcrumb("payment"),
      href: PAGE.PAYMENT,
      onClick: handleBack,
    },
    {
      label: tBreadcrumb("paymentConfirm"),
      href: PAGE.PAYMENT,
      isActive: true,
    },
  ];

  useEffect(() => {
    actionScrollToTop();
  }, []);

  return (
    <div>
      {isLoadingConfirmSetupIntent && <LoadingSpinner />}
      <div className="mt-[123px] mb-8 ml-0 flex flex-col justify-center sm:ml-4 md:mt-32 md:mb-24 md:ml-8 md:block md:min-h-auto lg:mt-44 lg:mb-16 lg:ml-[162px]">
        <div className="flex flex-col">
          <span className="heading-1 text-cream noto-serif-jp w-auto gap-4 md:text-left">
            {t.rich("title", {
              highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
            })}
          </span>
          <Breadcrumb items={breadcrumbItems} className="mt-6 md:mt-10" renderAsString />
        </div>
        <div className="md:hidden">
          <SectionHeader title={t("titleSp")} className="heading-1 text-cream noto-serif-jp mt-6 w-auto gap-4 md:text-left" />
          <p className="text-cream text-2 mt-6">{t("descriptionSp")}</p>
        </div>
      </div>
      <div className="bg-cream/0 md:bg-cream/20 mx-0 mb-8 block justify-between gap-12 rounded-md px-0 py-0 backdrop-blur-[0] sm:mx-4 md:mb-16 md:px-16 md:py-16 md:backdrop-blur-xs lg:mx-12 lg:px-[114px]">
        <div className="flex w-full flex-col gap-8">
          {!!paymentData.plan_type && renderItem(t("usageAmount"), t(`usageAmountWithPlanType.${paymentData.plan_type}`))}
          {renderItem(t("name"), paymentData.name || "")}
          {renderItem(t("creditCardNumber"), paymentData.creditCardNumber || "")}
          {renderItem(t("expirationDate"), paymentData.expirationDate || "")}
          {renderItem(t("cvv"), paymentData.cvv || "")}
        </div>
        <Button type="button" buttonType="secondary" className="heading-5 mt-8 w-full" onClick={handleSubmit}>
          {t("submit")}
        </Button>
        <Button type="button" buttonType="outline" className="heading-5 mt-8 w-full" onClick={handleBack}>
          {t("back")}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmPage;
