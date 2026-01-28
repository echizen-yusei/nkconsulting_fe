import { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
import UserLayout from "@/components/layout/UserLayout";
import { UserPage } from "@/features/user";
export async function generateMetadata() {
  const t = await getTranslations("userPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function User(): ReactElement {
  return (
    <UserLayout mobilePaddingBottom="pb-0">
      <UserPage />
    </UserLayout>
  );
}
