import { useTranslations } from "next-intl";

const Nodata = ({ className }: { className?: string }) => {
  const t = useTranslations("components");
  return <div className={`text-cream text-1 my-8 flex-1 text-center ${className}`}>{t("nodata")}</div>;
};

export default Nodata;
