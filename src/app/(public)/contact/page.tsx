import { ReactElement } from "react";
import ContactPage from "@/features/contact/Contact";
import LayoutBackground from "@/components/layout/LayoutBackground";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ContactPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function Contact(): ReactElement {
  return (
    <LayoutBackground>
      <ContactPage />
    </LayoutBackground>
  );
}
