import { planName } from "@/constants";
import { formatCurrencyWithUnit, formatDate } from "@/libs/utils";
import { CurrentPlan } from "@/types/membership-infomation";
import { useTranslations } from "next-intl";

const CurrentPlanInfo = ({ currentPlan }: { currentPlan: CurrentPlan }) => {
  const t = useTranslations("upgradePlan");
  return (
    <div className="bg-gray333 flex flex-col gap-4 rounded-md p-6">
      <div className="text-cream heading-5">{t("currentPlan")}</div>
      <div className="text-cream heading-3-30-20">{planName[currentPlan.plan_type as keyof typeof planName]}</div>
      <div className="text-1 text-cream">{formatDate(currentPlan.expiry_date ?? "")}</div>
      <div className="heading-3-30-20 text-cream text-end">{formatCurrencyWithUnit({ value: currentPlan.plan_fee ?? 0, style: "currency" })}</div>
    </div>
  );
};
export default CurrentPlanInfo;
