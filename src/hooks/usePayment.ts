"use client";
import { useEffect, useState } from "react";
import { PaymentFormDataType, PaymentTab } from "@/types/payment";
import { actionScrollToTop } from "@/libs";

export default function usePayment() {
  const [paymentTab, setPaymentTab] = useState<PaymentTab>(PaymentTab.create);
  const [paymentData, setPaymentData] = useState<PaymentFormDataType>({
    creditCardNumber: "",
    expirationDate: "",
    cvv: "",
    paymentMethodId: "",
  });

  useEffect(() => {
    actionScrollToTop();
  }, []);

  return {
    paymentTab,
    setPaymentTab,
    paymentData,
    setPaymentData,
  };
}
