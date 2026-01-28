import { ReactElement } from "react";
import LayoutBackground from "@/components/layout/LayoutBackground";
import { getTranslations } from "next-intl/server";
import backgroundTopSp from "../../../../public/assets/images/background_sp_2.png";
import PaymentPage from "@/features/payment/PaymentPage";

export async function generateMetadata() {
  const t = await getTranslations("payment");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default async function Payment(): Promise<ReactElement> {
  return (
    <LayoutBackground zIndex="md:z-10" isShowFooter={false} backgroundSp={backgroundTopSp} minHeight="">
      <PaymentPage />
    </LayoutBackground>
  );
}
