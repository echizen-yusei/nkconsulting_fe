import { ReactElement } from "react";
import LayoutBackground from "@/components/layout/LayoutBackground";
import { getTranslations } from "next-intl/server";
import ResetPasswordCompletePage from "@/features/reset-password/complete/ResetPasswordCompletePage";
import backgroundTopSp from "../../../../../public/assets/images/background_sp_2.png";

export async function generateMetadata() {
  const t = await getTranslations("resetPasswordCompletePage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function ResetPasswordComplete(): ReactElement {
  return (
    <LayoutBackground zIndex="md:z-30" pointerEvents="pointer-events-none" isShowFooter={false} backgroundSp={backgroundTopSp}>
      <ResetPasswordCompletePage />
    </LayoutBackground>
  );
}
