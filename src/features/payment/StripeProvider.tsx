"use client";

import Button from "@/components/atoms/Button/Button";
import LoadingSpinner from "@/components/atoms/Loading";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import envConfig from "@/libs/env";
import { useSetupIntents } from "@/services/payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type StripeContextType = {
  stripePromise: Stripe | null;
  isLoading: boolean;
  stripeError: Error | null;
  clientSecret: string | null;
  user_id: string | null;
  loadStripeData: () => void;
};

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error("useStripeContext must be used within a StripeProvider");
  }
  return context;
};

export default function StripeProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("payment");
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const { router } = useNavigation();
  const [stripeError, setStripeError] = useState<Error | null>(null);
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { mutate: setupIntents, isPending: isLoadingGetSetupIntents, error: errorSetupIntents } = useSetupIntents();

  const loadStripeData = () => {
    if (!envConfig.STRIPE_PUBLISHABLE_KEY) {
      setStripeError(new Error("Error loading stripe publishable key"));
      setIsLoading(false);
      return;
    }
    loadStripe(envConfig.STRIPE_PUBLISHABLE_KEY ?? "")
      .catch((error) => {
        setStripeError(error);
      })
      .then((stripe) => {
        setStripePromise(stripe ?? null);
        setupIntents(
          { user_id: user_id ?? "" },
          {
            onSuccess: (data) => {
              setClientSecret(data.data.client_secret);
            },
          },
        );
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
    user_id,
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
    <StripeContext.Provider value={contextValue}>
      <Elements stripe={stripePromise} options={elementsOptions}>
        <div className={`${!isLoading && !isLoadingGetSetupIntents ? "block" : "hidden"}`}>{children}</div>
        <div className={`${isLoading || isLoadingGetSetupIntents ? "block" : "hidden"}`}>
          <LoadingSpinner />
        </div>
      </Elements>
    </StripeContext.Provider>
  );
}
