"use client";

import Button from "@/components/atoms/Button/Button";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import envConfig from "@/libs/env";
import { useMemberPlanSetupIntents } from "@/services/membership-infomation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type StripeContextType = {
  stripePromise: Stripe | null;
  isLoading: boolean;
  stripeError: Error | null;
  clientSecret: string | null;
  loadStripeData: () => void;
};

const MemberPlanStripeContext = createContext<StripeContextType | undefined>(undefined);

export const useMemberPlanStripeContext = () => {
  const context = useContext(MemberPlanStripeContext);
  if (context === undefined) {
    throw new Error("useMemberPlanStripeContext must be used within a MemberPlanStripeContext");
  }
  return context;
};

export default function MemberPlanStripeProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("payment");
  const { router } = useNavigation();
  const [stripeError, setStripeError] = useState<Error | null>(null);
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { mutate: memberPlanSetupIntents, isPending: isLoadingGetSetupIntents, error: errorSetupIntents } = useMemberPlanSetupIntents();

  const loadStripeData = () => {
    if (!envConfig.STRIPE_PUBLISHABLE_KEY) {
      setStripeError(new Error("Error loading stripe publishable key"));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    loadStripe(envConfig.STRIPE_PUBLISHABLE_KEY ?? "")
      .catch((error) => {
        setStripeError(error);
      })
      .then((stripe) => {
        setStripePromise(stripe ?? null);
        memberPlanSetupIntents(undefined, {
          onSuccess: (data) => {
            setClientSecret(data.data.client_secret);
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadStripeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: StripeContextType = {
    stripePromise,
    isLoading,
    stripeError,
    clientSecret,
    loadStripeData,
  };

  if (stripeError) {
    return (
      <div className="text-red-primary flex h-screen flex-col items-center justify-center p-4">
        <div className="bg-gray333 flex flex-col items-center justify-center rounded-md p-8">
          <p className="text-1 text-cream text-center whitespace-pre-line">{t("error")}</p>
          <Button buttonType="primary" onClick={() => window.location.reload()} className="mt-10 w-full">
            {t("errorButton")}
          </Button>
        </div>
      </div>
    );
  }

  if (errorSetupIntents) {
    return (
      <div className="text-red-primary flex h-screen flex-col items-center justify-center p-4">
        <div className="bg-gray333 flex flex-col items-center justify-center rounded-md p-8">
          <p className="text-1 text-cream text-center whitespace-pre-line">{t("accountNotFoundError")}</p>
          <Button buttonType="primary" onClick={() => router.push(PAGE.LOGIN)} className="mt-10 w-full">
            {t("button.loginAndRegister")}
          </Button>
        </div>
      </div>
    );
  }

  const elementsOptions: StripeElementsOptions = { locale: "ja" };

  return (
    <MemberPlanStripeContext.Provider value={contextValue}>
      <Elements stripe={stripePromise} options={elementsOptions}>
        <div className={`${!isLoading && !isLoadingGetSetupIntents ? "block" : "hidden"}`}>{children}</div>
        <div className={`${isLoading || isLoadingGetSetupIntents ? "block" : "hidden"}`}>
          <CreditCardFormSkeleton containerClassName="relative flex w-full max-w-full flex-col md:max-w-[494px]" isExistingCard={false} />
        </div>
      </Elements>
    </MemberPlanStripeContext.Provider>
  );
}

const CreditCardFormSkeleton = ({ containerClassName, isExistingCard }: { containerClassName?: string; isExistingCard: boolean }) => {
  return (
    <div className={containerClassName || "relative flex w-full max-w-full flex-col md:max-w-[494px]"}>
      <div className="mb-2 md:mb-4">
        <div className="bg-cream/20 h-5 w-24 animate-pulse rounded"></div>
      </div>
      <div className="bg-cream/20 h-14 w-full animate-pulse rounded"></div>
      <div className="mt-6 mb-2 md:mb-4">
        <div className="bg-cream/20 h-5 w-32 animate-pulse rounded"></div>
      </div>
      <div className="bg-cream/20 h-14 w-full animate-pulse rounded"></div>
      <div className="mt-6 mb-2 md:mb-4">
        <div className="bg-cream/20 h-5 w-28 animate-pulse rounded"></div>
      </div>
      <div className="bg-cream/20 h-14 w-full animate-pulse rounded"></div>
      <div className="mt-6 mb-2 md:mb-4">
        <div className="bg-cream/20 h-10 w-48 animate-pulse rounded"></div>
      </div>
      <div className="bg-cream/20 h-14 w-full animate-pulse rounded"></div>
      <div className="mt-6">
        <div className="bg-cream/20 h-14 w-full animate-pulse rounded"></div>
      </div>
      <div className="mt-6">
        <div className="bg-cream/20 h-14 w-full animate-pulse rounded"></div>
      </div>
      {isExistingCard && (
        <div className="mt-6">
          <div className="bg-cream/20 h-14 w-full animate-pulse rounded"></div>
        </div>
      )}
    </div>
  );
};
