import { ReactElement } from "react";
import CompletePage from "@/features/contact/complete/Complete";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ContactPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function ContactComplete(): ReactElement {
  return <CompletePage />;
}
