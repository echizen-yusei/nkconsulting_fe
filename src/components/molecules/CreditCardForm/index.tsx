import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FormControl } from "@/components/atoms/FormField";
import FormLabel from "@/components/atoms/FormLabel";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { PaymentFormDataType, PaymentTab } from "@/types/payment";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import Button from "@/components/atoms/Button/Button";
import { LoadingSpinnerPortal } from "@/components/atoms/Loading";
import { useGetPaymentMethodId } from "@/services/membership-infomation";
import { actionScrollToTop } from "@/libs";

export type PaymentCreatePageProps = {
  setPaymentData: (paymentData: PaymentFormDataType) => void;
  setPaymentTab: (tabIndex: PaymentTab) => void;
  containerClassName?: string;
  cvcLabel?: string;
  clientSecret: string;
  isExistingCard: boolean;
  setUseExistingCard: (useExistingCard: boolean) => void;
};

export const paymentSchema = (t: ReturnType<typeof useTranslations>, cvcLabel?: string) =>
  z.object({
    name: z
      .string()
      .max(255, { message: t("Validation.maxLength", { field: t("upgradePlan.paymentMethod.form.label.name"), length: 255 }) })
      .trim()
      .min(1, { message: t("Validation.required", { field: t("upgradePlan.paymentMethod.form.label.name") }) }),
    creditCardNumber: z.string().min(1, { message: t("Validation.required", { field: t("upgradePlan.paymentMethod.form.label.creditCardNumber") }) }),
    expirationDate: z.string().min(1, { message: t("Validation.required", { field: t("upgradePlan.paymentMethod.form.label.expirationDate") }) }),
    cvv: z.string().min(1, { message: t("Validation.required", { field: cvcLabel ?? t("upgradePlan.paymentMethod.form.label.cvvSp") }) }),
  });

type PaymentFormSchemaType = z.infer<ReturnType<typeof paymentSchema>>;

const CreditCardForm = ({
  setPaymentData,
  setPaymentTab,
  containerClassName = "relative flex w-full max-w-full flex-col md:max-w-[494px]",
  cvcLabel,
  clientSecret,
  isExistingCard,
  setUseExistingCard,
}: PaymentCreatePageProps) => {
  const tSchema = useTranslations("");
  const t = useTranslations("upgradePlan.paymentMethod");
  const methods = useForm({
    resolver: zodResolver(paymentSchema(tSchema, cvcLabel)),
    defaultValues: {
      name: "",
      creditCardNumber: "",
      expirationDate: "",
      cvv: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { setValue } = methods;

  const stripe = useStripe();
  const elements = useElements();
  const handleShowError = useErrorHandler();
  const [isConfirmSetupIntent, setIsConfirmSetupIntent] = useState<boolean>(false);

  const { mutate: getPaymentMethodId, isPending: isLoadingPaymentMethod } = useGetPaymentMethodId();

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

  const isSubmitting = isConfirmSetupIntent || isLoadingPaymentMethod;

  const onSubmit = async (data: PaymentFormSchemaType) => {
    if (isSubmitting) return;
    if (!stripe || !elements || !clientSecret) {
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    setIsConfirmSetupIntent(true);
    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
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
      getPaymentMethodId(setupIntent?.payment_method as string, {
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
      });
    }
  };

  useEffect(() => {
    actionScrollToTop();
  }, []);

  return (
    <FormProvider {...methods}>
      {(isLoadingPaymentMethod || isConfirmSetupIntent) && <LoadingSpinnerPortal />}
      <form className={containerClassName} onSubmit={methods.handleSubmit(onSubmit)}>
        <FormLabel isRequired className="mb-2 md:mb-4" fontSize="heading-5-20">
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
        <FormLabel isRequired className="mt-6 mb-2 md:mb-4" fontSize="heading-5-20">
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
        <FormLabel isRequired className="mt-6 mb-2 md:mb-4" fontSize="heading-5-20">
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
        <FormLabel isRequired className="mt-6 mb-2 whitespace-pre-line md:mb-4" fontSize="heading-5-20">
          {cvcLabel ?? t("form.label.cvvSp")}
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
        <div className="mt-6 flex flex-col gap-6">
          <Button type="submit" buttonType="secondary" className="heading-5 h-14! w-full py-0!" isDisabled={isSubmitting}>
            {t("submit")}
          </Button>
          {isExistingCard && (
            <Button buttonType="outline" className="heading-5 h-14! w-full py-0!" onClick={() => setUseExistingCard(true)}>
              {t("useExistingCard")}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default CreditCardForm;
