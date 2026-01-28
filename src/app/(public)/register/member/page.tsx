import { ReactElement } from "react";
import LayoutBackground from "@/components/layout/LayoutBackground";
import { getTranslations } from "next-intl/server";
import RegisterMemberPage from "@/features/register/member/RegisterMember";
import backgroundTopSp from "../../../../../public/assets/images/background_sp_2.png";
import { userAgentFromString } from "next/server";
import { headers } from "next/headers";

export async function generateMetadata() {
  const t = await getTranslations("registerMemberPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default async function RegisterMember(): Promise<ReactElement> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const { device } = userAgentFromString(userAgent || undefined);
  const isMobile = device?.type === "mobile";

  return (
    <LayoutBackground zIndex="md:z-10" isShowFooter={false} backgroundSp={backgroundTopSp}>
      <RegisterMemberPage isMobile={isMobile} />
    </LayoutBackground>
  );
}
