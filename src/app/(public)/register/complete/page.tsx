import { ReactElement } from "react";
import RegisterCompletePage from "@/features/register/complete/RegisterComplete";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("registerCompletePage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function RegisterComplete(): ReactElement {
  return <RegisterCompletePage />;
}
