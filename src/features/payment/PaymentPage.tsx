import PaymentPageInner from "./PaymentPageInner";
import StripeProvider from "./StripeProvider";

export default function PaymentPage() {
  return (
    <StripeProvider>
      <PaymentPageInner />
    </StripeProvider>
  );
}
