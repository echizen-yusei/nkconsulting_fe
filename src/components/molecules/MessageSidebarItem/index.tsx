import Tag from "@/components/atoms/Tag";
import NewIcon from "../../../../public/assets/images/new-icon.png";
import Image from "next/image";
import Link from "next/link";
import { NotificationInfo } from "@/types/notification";
import { PAGE } from "@/constants/page";

type MessageSidebarItemProps = {
  data: NotificationInfo;
};

const MessageSidebarItem = ({ data }: MessageSidebarItemProps) => {
  const nextRequest = `&prev=${encodeURIComponent(location.pathname + location.search)}`;

  return (
    <Link href={`${PAGE.MESSAGES}/?id=${data.id}${nextRequest}`} className="border-cream cursor-pointer border-b px-2 pb-2 hover:bg-[#666666]">
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tag text={data.tag} />
          <span className="text-2 text-cream">{data.created_at}</span>
        </div>
        {data.unread && <Image src={NewIcon} alt="new-icon" className="h-auto w-[30px] object-cover" />}
      </div>
      <p className="font-noto-serif-jp text-cream truncate-1 reak-all mt-2 text-[20px] font-semibold whitespace-pre-wrap">{data.title}</p>
    </Link>
  );
};

export default MessageSidebarItem;
