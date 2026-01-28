"use client";
import { useEffect, useState } from "react";
import { PaymentFormDataType, PaymentTab } from "@/types/payment";
import PaymentCreatePage from "./create/PaymentCreatePage";
import PaymentConfirmPage from "./confirm/PaymentConfirmPage";
import { actionScrollToTop } from "@/libs";

export default function PaymentPageInner() {
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

  return (
    <div className="max-w-xxl pointer-events-auto mx-auto px-6 md:px-0">
      <div className={`${paymentTab === PaymentTab.create ? "block" : "hidden"} transition-all duration-300`}>
        <PaymentCreatePage setPaymentData={setPaymentData} setPaymentTab={setPaymentTab} />
      </div>
      <div className={`${paymentTab === PaymentTab.confirm ? "block" : "hidden"} transition-all duration-300`}>
        <PaymentConfirmPage setPaymentTab={setPaymentTab} paymentData={paymentData} />
      </div>
    </div>
  );
}
