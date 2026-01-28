import { formatCurrency } from "@/libs/utils";
import { useTranslations } from "next-intl";

const BillingUpgradePlanInfo = ({ planFee }: { planFee: number }) => {
  const t = useTranslations("upgradePlan");
  return (
    <div>
      <h3 className="text-cream heading-3-30-20">
        {t("billingAmountLabel")}
        <span className="hidden md:inline">：</span>
        <span className="block md:inline">{formatCurrency(planFee, "currency")}</span>
      </h3>
      <div className="text-1 text-cream mt-6 whitespace-pre-line">{t("feeDescription")}</div>
    </div>
  );
};

export default BillingUpgradePlanInfo;
