import { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
import MembershipTermsPage from "@/features/membership-terms/MembershipTermsPage";
import { headers } from "next/headers";
import { userAgentFromString } from "next/server";

export async function generateMetadata() {
  const t = await getTranslations("membershipTerms");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default async function MembershipTerms(): Promise<ReactElement> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const { device } = userAgentFromString(userAgent || undefined);
  const isMobile = device?.type === "mobile";

  return <MembershipTermsPage initialIsMobile={isMobile} />;
}
