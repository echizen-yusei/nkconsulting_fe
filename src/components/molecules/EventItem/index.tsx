import Button from "@/components/atoms/Button/Button";
import { formatTime12Hour, handleCurrency } from "@/libs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import Link from "next/link";
import { EventInfo } from "@/types/event-information";
import NoImage from "../../../../public/assets/images/no-image.jpg";
import { convertHtmlToText } from "@/libs/utils";

type EventItemProps = {
  data: EventInfo;
};

const EventItem = ({ data }: EventItemProps) => {
  const t = useTranslations("eventInformation");
  const { router } = useNavigation();
  const nextRequest = `?prev=${encodeURIComponent(location.pathname + location.search)}`;
  const handleDetail = () => {
    router.push(`${PAGE.EVENT_INFORMATION}/${data.id}${nextRequest}`);
  };

  return (
    <>
      <div className="bg-gray333 hidden rounded-md md:flex">
        <div className="relative aspect-video h-auto min-h-[385px] w-full max-w-[340px]">
          <Image
            src={data.thumbnail || NoImage}
            alt={data.title}
            fill
            quality={80}
            className="min-h-[385px] max-w-[340px] min-w-[340px] rounded-l-md object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88/JhPQAItgM3IS9KegAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="flex-1 p-4 lg:p-6">
          <div className="border-cream flex flex-wrap items-start justify-between gap-4 border-b pb-4 lg:flex-nowrap">
            <div className="flex items-start gap-6">
              <p className="heading-5 text-cream whitespace-nowrap">{data.target_date}</p>
              <p className="heading-5 text-cream whitespace-nowrap">{formatTime12Hour(data.start_time, data.end_time)}</p>
            </div>
            <p className="heading-5 text-cream break-all whitespace-pre-wrap">@{data.venue_name}</p>
          </div>
          <div className="mt-6 flex gap-4">
            <div className="bg-gradient-linear-2 w-[4px] self-stretch" />
            <div className="flex-1">
              <p className="heading-3-30 text-cream break-all whitespace-pre-wrap">{data.title}</p>
              <p className="text-1 text-cream truncate-3 mt-6" dangerouslySetInnerHTML={{ __html: convertHtmlToText(data.content) }} />
            </div>
          </div>
          <div className="mt-6 flex gap-6">
            <p className="heading-5 text-cream whitespace-pre">{t("capacity", { capacity: data.capacity })}</p>
            <p className="heading-5 text-cream whitespace-pre">{t("participants", { participants: data.excepted_number_of_participants })}</p>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <p className="heading-5 text-cream items-center">{t("fee", { fee: handleCurrency(Number(data.participant_fee)) || "" })}</p>
            <Button buttonType="secondary" className="heading-5 px-4 lg:px-[90]" onClick={() => handleDetail()}>
              {t("detail")}
            </Button>
          </div>
        </div>
      </div>
      <Link href={`${PAGE.EVENT_INFORMATION}/${data.id}${nextRequest}`} className="bg-gray333 border-gradient-gold-not-rounded w-full p-6 md:hidden">
        <div className="relative aspect-video h-fit max-h-[340px] min-h-60 w-full">
          <Image
            src={data.thumbnail || NoImage}
            quality={80}
            alt={data.title}
            fill
            className="max-h-[340px] min-h-60 rounded-md object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88/JhPQAItgM3IS9KegAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="border-cream mt-4 flex items-start justify-between border-b pb-1">
          <div className="flex items-center gap-6">
            <p className="text-2 text-cream whitespace-nowrap">{data.target_date}</p>
            <p className="text-2 text-cream whitespace-nowrap">{formatTime12Hour(data.start_time, data.end_time)}</p>
          </div>
          <p className="text-2 text-cream ml-2 break-all whitespace-pre-wrap">@{data.venue_name}</p>
        </div>
        <p className="heading-3-30 text-cream mt-4 break-all whitespace-pre-wrap">{data.title}</p>
        <p className="text-2 text-cream truncate-3 mt-2" dangerouslySetInnerHTML={{ __html: convertHtmlToText(data.content) }} />
        <div className="mt-4 flex gap-4">
          <p className="text-1 text-cream whitespace-pre">{t("capacity", { capacity: data.capacity })}</p>
          <p className="text-1 text-cream whitespace-pre">{t("participants", { participants: data.excepted_number_of_participants })}</p>
        </div>
      </Link>
    </>
  );
};

export default EventItem;
