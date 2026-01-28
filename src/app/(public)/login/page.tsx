import { ReactElement } from "react";
import LayoutBackground from "@/components/layout/LayoutBackground";
import { getTranslations } from "next-intl/server";
import LoginPage from "@/features/login/LoginPage";
import { headers } from "next/headers";
import { userAgentFromString } from "next/server";
import backgroundTopSp from "../../../../public/assets/images/background_sp_2.png";

export async function generateMetadata() {
  const t = await getTranslations("login");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default async function Login(): Promise<ReactElement> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const { device } = userAgentFromString(userAgent || undefined);
  const isMobile = device?.type === "mobile";

  return (
    <LayoutBackground zIndex="md:z-10" isShowFooter={false} minHeight="" backgroundSp={backgroundTopSp}>
      <LoginPage isMobile={isMobile} />
    </LayoutBackground>
  );
}
