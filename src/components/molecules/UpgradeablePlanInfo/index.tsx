import { planName2 } from "@/constants";
import { formatCurrencyWithUnit } from "@/libs/utils";
import { UpgradeablePlan } from "@/types/membership-infomation";
import { useTranslations } from "next-intl";

const UpgradeablePlanInfo = ({ plan }: { plan: UpgradeablePlan }) => {
  const t = useTranslations("upgradePlan");
  return (
    <div className="border-gradient-linear flex flex-col gap-4 p-6" key={plan.plan_type}>
      <div className="text-cream heading-5">{t("changeablePlan")}</div>
      <div className="text-cream heading-3-30-20">{planName2[plan.plan_type as keyof typeof planName2]}</div>
      <div className="text-1 text-cream whitespace-pre-line">{t("planBenefits")}</div>
      <div className="heading-3-30-20 text-cream text-end">{formatCurrencyWithUnit({ value: plan.plan_fee, style: "currency" })}</div>
    </div>
  );
};

export default UpgradeablePlanInfo;
