"use client";
import { useTranslations } from "next-intl";
import useWindowSize from "@/hooks/useWindowSize";
import useScreen from "@/hooks/useScreen";

const MembershipFees = () => {
  const t = useTranslations("HomePage");
  const { width } = useWindowSize();
  const isMinWidth = width <= 1136;
  const { isMobile } = useScreen();

  const renderContent = () => {
    if (isMobile) {
      return (
        <div>
          <h1 className="heading-2-36 text-cream text-left">
            {t.rich("membershipFees.title", {
              highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
            })}
          </h1>
          <div className="mt-12">
            <p className="text-1 text-cream text-left">{t("membershipFees.price")}</p>
            <p className="text-cream text-1 mt-2 text-left">{t("membershipFees.payment")}</p>
          </div>
        </div>
      );
    }
    return (
      <>
        <h1 className="heading-2-36 text-cream text-center">
          {t.rich("membershipFees.title", {
            highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
          })}
        </h1>
        <div className="gap-spacing-lg flex items-center">
          <p className="text-1 text-cream text-center">{t("membershipFees.price")}</p>
          <p className="text-cream text-1 text-center">{t("membershipFees.payment")}</p>
        </div>
      </>
    );
  };
  return (
    <div
      className={`${
        isMinWidth ? "mx-[20px] md:mx-12" : "mx-[152px]"
      } bg-cream/20 flex w-full items-center justify-between rounded-md px-6 py-16 backdrop-blur-xs md:p-16`}
    >
      {renderContent()}
    </div>
  );
};

export default MembershipFees;
