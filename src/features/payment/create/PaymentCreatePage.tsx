"use client";

import { FormProvider, useForm } from "react-hook-form";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";
import Button from "@/components/atoms/Button/Button";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import SectionHeader from "@/components/atoms/SectionHeader";
import FormLabel from "@/components/atoms/FormLabel";
import { FormControl } from "@/components/atoms/FormField";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { PaymentFormDataType, PaymentTab } from "@/types/payment";
import { useEffect, useState } from "react";
import { actionScrollToTop } from "@/libs";
import useAutoFocus from "@/hooks/useAutoFocus";
import { AxiosError } from "axios";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { toast } from "sonner";
import LoadingSpinner from "@/components/atoms/Loading";
import { usePaymentBank, usePaymentMethodId } from "@/services/payment";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStripeContext } from "../StripeProvider";

type PaymentCreatePageProps = {
  setPaymentData: (paymentData: PaymentFormDataType) => void;
  setPaymentTab: (tabIndex: PaymentTab) => void;
};

const paymentSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z
      .string()
      .max(255, { message: t("Validation.maxLength", { field: t("payment.form.label.name"), length: 255 }) })
      .trim()
      .min(1, { message: t("Validation.required", { field: t("payment.form.label.name") }) }),
    creditCardNumber: z.string().min(1, { message: t("Validation.required", { field: t("payment.form.label.creditCardNumber") }) }),
    expirationDate: z.string().min(1, { message: t("Validation.required", { field: t("payment.form.label.expirationDate") }) }),
    cvv: z.string().min(1, { message: t("Validation.required", { field: t("payment.form.label.cvv") }) }),
  });

type PaymentFormSchemaType = z.infer<ReturnType<typeof paymentSchema>>;

export default function PaymentCreatePage({ setPaymentData, setPaymentTab }: PaymentCreatePageProps) {
  const t = useTranslations("payment");
  const { clientSecret, user_id } = useStripeContext();
  const tSchema = useTranslations("");
  const tBreadcrumb = useTranslations("breadcrumb");
  const { router } = useNavigation();
  const stripe = useStripe();
  const elements = useElements();
  const handleShowError = useErrorHandler();
  const [isConfirmSetupIntent, setIsConfirmSetupIntent] = useState<boolean>(false);
  const { mutate: getPaymentMethodId, isPending: isLoadingPaymentMethod } = usePaymentMethodId();
  const { mutate: paymentBank, isPending: isLoadingPaymentBank } = usePaymentBank();

  const methods = useForm({
    resolver: zodResolver(paymentSchema(tSchema)),
    defaultValues: {
      name: "",
      creditCardNumber: "",
      expirationDate: "",
      cvv: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { setValue, reset } = methods;
  const onSubmit = async (data: PaymentFormSchemaType) => {
    if (isConfirmSetupIntent || isLoadingPaymentMethod) return;
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    setIsConfirmSetupIntent(true);
    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret!, {
      payment_method: {
        card: cardElement!,
        billing_details: {
          name: data.name,
        },
      },
    });
    setIsConfirmSetupIntent(false);
    if (error) {
      if (error.message) {
        toast.error(error.message);
      }
    } else {
      getPaymentMethodId(
        { user_id: user_id ?? "", payment_method_id: setupIntent?.payment_method as string },
        {
          onSuccess: (res) => {
            setPaymentData({
              paymentMethodId: setupIntent?.payment_method as string,
              name: data.name,
              creditCardNumber: `**** **** **** ${res.data.card?.last4}`,
              expirationDate: res.data.card.exp_month + "/" + res.data.card.exp_year,
              cvv: "***",
              user_id: res?.data?.user.uuid ?? "",
              plan_type: res?.data?.user.plan_type ?? "",
            });
            setPaymentTab(PaymentTab.confirm);
          },
          onError: (error) => {
            handleShowError({ error: error as AxiosError<ErrorResponseData> });
          },
        },
      );
    }
  };

  const handleRegister = () => {
    reset();
    paymentBank(
      { user_id: user_id ?? "" },
      {
        onSuccess: () => {
          router.push(PAGE.REGISTER_MEMBER_COMPLETE);
        },
        onError: (error) => {
          handleShowError({ error: error as AxiosError<ErrorResponseData> });
        },
      },
    );
  };

  const breadcrumbItems = [
    { label: tBreadcrumb("home"), href: PAGE.HOME },
    { label: tBreadcrumb("login"), href: PAGE.LOGIN },
    { label: tBreadcrumb("registerMember"), href: PAGE.REGISTER_MEMBER },
    { label: tBreadcrumb("payment"), href: PAGE.PAYMENT, isActive: true },
  ];

  const stripeStyle = (isError: boolean, placeholder: string) => ({
    style: {
      base: {
        fontSize: "16px",
        color: "#1a1a1a",
        backgroundColor: "#fff",
        fontFamily: "Noto Sans JP, sans-serif",
        "::placeholder": { color: "#A1A1A1" },
        lineHeight: isError ? "52px" : "56px",
        border: "1px solid green",
      },
      invalid: { color: "#e3342f" },
    },
    placeholder: placeholder,
  });

  useAutoFocus();
  useEffect(() => {
    actionScrollToTop();
  }, []);

  return (
    <>
      {(isConfirmSetupIntent || isLoadingPaymentMethod || isLoadingPaymentBank) && <LoadingSpinner />}
      <div className="mt-[123px] mb-6 ml-0 flex flex-col justify-center sm:ml-4 md:mt-32 md:mb-24 md:ml-8 md:block md:min-h-auto lg:mt-44 lg:mb-16 lg:ml-[162px]">
        <div className="flex flex-col">
          <span className="heading-1 text-cream noto-serif-jp w-auto gap-4 md:text-left">
            {t.rich("title", {
              highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
            })}
          </span>
          <Breadcrumb items={breadcrumbItems} className="mt-6 md:mt-10" renderAsString />
        </div>
        <div className="md:hidden">
          <SectionHeader title={t("titleSp")} className="heading-1 text-cream noto-serif-jp mt-8 w-auto gap-4 md:text-left" />
          <p className="text-cream text-2 mt-6">{t("creditCardDescription")}</p>
        </div>
      </div>

      <FormProvider {...methods}>
        <div className="bg-cream/0 md:bg-cream/20 mx-0 mb-8 block justify-between gap-12 rounded-md px-0 py-0 backdrop-blur-[0] sm:mx-4 md:mb-16 md:flex md:px-16 md:py-16 md:backdrop-blur-xs lg:mx-12 lg:px-[114px]">
          <form className="relative flex w-full max-w-full flex-col md:max-w-[494px]" onSubmit={methods.handleSubmit(onSubmit)}>
            <SectionHeader className="hidden md:block" title={t("creditCard")} />
            <p className="text-cream text-1 my-8 hidden md:block">{t("creditCardDescription")}</p>
            <FormLabel isRequired className="mb-2 md:mb-4">
              {t("form.label.name")}
            </FormLabel>
            <FormControl
              name="name"
              label={t("form.label.name")}
              placeholder={t("form.placeholder.name")}
              required
              isShowLabel={false}
              heightInput="h-[56px]"
              isInvalidField
            />
            <FormLabel isRequired className="mt-6 mb-2 md:mb-4">
              {t("form.label.creditCardNumber")}
            </FormLabel>
            <div className={`${methods.formState.errors["creditCardNumber"]?.message ? "border-red-light h-14 border-2" : ""} rounded-lg bg-white px-4`}>
              <CardNumberElement
                options={stripeStyle(!!methods.formState.errors["creditCardNumber"]?.message, t("form.placeholder.creditCardNumber"))}
                onChange={(e) => {
                  if (e.complete) {
                    setValue("creditCardNumber", "filled", { shouldValidate: false });
                  } else if (e.empty) {
                    setValue("creditCardNumber", "", { shouldValidate: false });
                  }
                }}
              />
            </div>
            <ErrorMessage errors={methods.formState.errors} name="creditCardNumber" />
            <FormLabel isRequired className="mt-6 mb-2 md:mb-4">
              {t("form.label.expirationDate")}
            </FormLabel>
            <div className={`${methods.formState.errors["expirationDate"]?.message ? "border-red-light h-14 border-2" : ""} rounded-lg bg-white px-4`}>
              <CardExpiryElement
                options={stripeStyle(!!methods.formState.errors["expirationDate"]?.message, t("form.placeholder.expirationDate"))}
                onChange={(e) => {
                  if (e.complete) {
                    setValue("expirationDate", "filled", { shouldValidate: false });
                  } else if (e.empty) {
                    setValue("expirationDate", "", { shouldValidate: false });
                  }
                }}
              />
            </div>
            <ErrorMessage errors={methods.formState.errors} name="expirationDate" />
            <FormLabel isRequired className="mt-6 mb-2 whitespace-pre-line md:mb-4">
              {t("form.label.cvvSp")}
            </FormLabel>
            <div className={`${methods.formState.errors["cvv"]?.message ? "border-red-light h-14 border-2" : ""} rounded-lg bg-white px-4`}>
              <CardCvcElement
                options={stripeStyle(!!methods.formState.errors["cvv"]?.message, t("form.placeholder.cvv"))}
                onChange={(e) => {
                  if (e.complete) {
                    setValue("cvv", "filled", { shouldValidate: false });
                  } else if (e.empty) {
                    setValue("cvv", "", { shouldValidate: false });
                  }
                }}
              />
            </div>
            <ErrorMessage errors={methods.formState.errors} name="cvv" />
            <Button type="submit" buttonType="secondary" className="heading-5 mt-6" isDisabled={isConfirmSetupIntent || isLoadingPaymentMethod}>
              {t("submit")}
            </Button>
          </form>

          <div className="bg-cream mt-8 h-px w-full self-stretch md:mt-0 md:h-auto md:w-px" />

          <div className="mt-8 flex w-full max-w-full flex-col justify-between md:mt-0 md:max-w-[494px]">
            <div>
              <SectionHeader title={t("bankTransfer")} />
              <p className="text-cream text-1 my-6 whitespace-pre-line md:my-8">{t("bankTransferDescription")}</p>
            </div>

            <Button buttonType="secondary" type="button" className="heading-5 mt-0 w-full md:mt-8" onClick={handleRegister}>
              {t("register")}
            </Button>
          </div>
        </div>
      </FormProvider>
    </>
  );
}
