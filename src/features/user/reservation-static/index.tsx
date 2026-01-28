import { useTranslations } from "next-intl";
import Image from "next/image";

import phoneIcon from "../../../../public/assets/images/phone_android.png";
import lineQRIcon from "../../../../public/assets/images/line_qr.png";

import SectionHeader from "@/components/atoms/SectionHeader";
import MessageSidebar from "@/components/organisms/user/MessageSiderbar";
import LoungeGallery from "@/components/molecules/LoungeGallery";

const ReservationStaticPage = () => {
  const t = useTranslations("loungeReservation");

  const systemList = [
    {
      label: t("system.charge"),
      value: "10,000円",
    },
    {
      label: t("system.ice"),
      value: "1,000円",
    },
    {
      label: t("system.water"),
      value: "500円",
    },
    {
      label: t("system.companion"),
      value: "3,000円",
    },
    {
      label: t("system.bottle"),
      value: t("system.bottlePrice"),
    },
  ];
  return (
    <div className="mx-6 my-8 flex flex-col gap-12 md:mx-12 md:my-16 xl:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-12 md:gap-16">
        <div>
          <SectionHeader title={t("loungeLieChill.title")} />
          <p className="text-1 text-cream mt-6 hidden whitespace-pre-line md:block">{t("loungeLieChill.description")}</p>
          <p className="text-1 text-cream mt-6 whitespace-pre-line md:hidden">{t("loungeLieChill.descriptionSp")}</p>
          <LoungeGallery />
        </div>
        <div>
          <SectionHeader title={t("system.title")} />
          <div className="mt-6 sm:w-fit">
            {systemList.map((item) => (
              <div key={item.label} className="border-cream flex items-start gap-6 border-b py-2 sm:pr-12 md:gap-12">
                <div className="text-cream heading-5-20-16 min-w-[119px] md:min-w-[150px]">{item.label}</div>
                <div className="text-cream heading-5-20-16 whitespace-pre-line">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader title={t("reservation.title")} />
          <p className="text-cream text-1 mt-6 whitespace-pre-line md:hidden">{t("reservation.description")}</p>
          <p className="text-cream heading-5 mt-6 hidden whitespace-pre-line md:block">{t("reservation.description")}</p>
          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <div className="border-cream flex items-center justify-center gap-6 rounded-[8px] border py-6 md:px-16">
              <div className="relative h-[71px] w-[43px] md:h-[66px] md:w-[39.97px]">
                <Image src={phoneIcon} alt="phone" fill />
              </div>
              <div className="flex flex-col justify-between gap-4">
                <p className="text-cream text-1">{t("reservation.phoneReservation.title")}</p>
                <a href={t("reservation.phoneReservation.phoneLink")} className="text-cream heading-5">
                  {t("reservation.phoneReservation.phone")}
                </a>
              </div>
            </div>
            <div className="border-cream flex items-center justify-center gap-6 rounded-[8px] border py-6 md:px-16">
              <div className="relative aspect-square w-[71px] md:w-[66px]">
                <Image src={lineQRIcon} alt="line" fill />
              </div>
              <div className="flex flex-col justify-between gap-4">
                <div className="text-cream text-1">{t("reservation.lineReservation.title")}</div>
                <div className="text-cream heading-5">{t("reservation.lineReservation.line")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <MessageSidebar />
      </div>
    </div>
  );
};

export default ReservationStaticPage;
