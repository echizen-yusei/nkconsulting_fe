import { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
// import ProtectedForSp from "@/components/layout/ProtectedForSp";
import PrivacyPage from "@/features/privacy/PrivacyPage";
import { userAgentFromString } from "next/server";
import { headers } from "next/headers";

export async function generateMetadata() {
  const t = await getTranslations("privacy");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default async function Privacy(): Promise<ReactElement> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const { device } = userAgentFromString(userAgent || undefined);
  const isMobile = device?.type === "mobile";

  return <PrivacyPage initialIsMobile={isMobile} />;
}
