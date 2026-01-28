import { ReactElement } from "react";
import ResetPasswordPage from "@/features/reset-password/ResetPasswordPage";
import LayoutBackground from "@/components/layout/LayoutBackground";
import { getTranslations } from "next-intl/server";
import backgroundTopSp from "../../../../public/assets/images/background_sp_2.png";

export async function generateMetadata() {
  const t = await getTranslations("resetPassword");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function ResetPassword(): ReactElement {
  return (
    <LayoutBackground zIndex="md:z-30" pointerEvents="pointer-events-none" isShowFooter={false} backgroundSp={backgroundTopSp}>
      <ResetPasswordPage />
    </LayoutBackground>
  );
}
