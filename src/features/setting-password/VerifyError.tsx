import Button from "@/components/atoms/Button/Button";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { useTranslations } from "next-intl";

export default function VerifyError() {
  const t = useTranslations("settingPasswordPage");
  const { router } = useNavigation();
  return (
    <div className="md:bg-cream/20 pointer-events-auto relative mb-16 flex flex-col gap-2 rounded-md px-4 py-16 sm:mb-16 sm:px-8 md:mb-24 md:gap-8 md:px-16 md:backdrop-blur-xs lg:mb-30 lg:px-[114px]">
      <p className="text-cream text-1 text-center whitespace-pre-line">{t("message.urlExpired")}</p>
      <Button type="button" buttonType="outline" className="heading-5 pointer-events-auto mt-3 w-full md:mt-8" onClick={() => router.push(PAGE.LOGIN)}>
        {t("backToLogin")}
      </Button>
    </div>
  );
}
