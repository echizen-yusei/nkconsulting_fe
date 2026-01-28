import Tag from "@/components/atoms/Tag";
import { NotificationInfo } from "@/types/notification";
import NewIcon from "../../../../public/assets/images/new-icon.png";
import RightIcon from "../../../../public/assets/images/right-icon.png";
import Image from "next/image";
import Link from "next/link";
import { PAGE } from "@/constants/page";
import { useSearchParams } from "next/navigation";
import { cn } from "@/libs/utils";

type MessageItemProps = {
  data: NotificationInfo;
  isRead?: { [key: number]: boolean };
  onSelect?: (id: number) => void;
};

const MessageItem = ({ data, onSelect, isRead }: MessageItemProps) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const page = parseInt(searchParams.get("page") || "1");
  const isActive = Number(id) === data.id;
  const isNew = !isActive && !isRead?.[data.id] && data.unread;
  return (
    <Link
      href={`${PAGE.MESSAGES}/?id=${data.id}&page=${page}`}
      className={cn("flex cursor-pointer items-center justify-between gap-4 border-b p-6", isActive && "bg-black", !isActive && "hover:bg-[#666666]")}
      onClick={() => onSelect?.(data.id)}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Tag text={data.tag} />
            <span className="text-2 text-cream">{data.created_at}</span>
          </div>
          {isNew && <Image src={NewIcon} alt="new-icon" className="h-auto w-[30px] object-cover" />}
        </div>
        <p className="font-noto-serif-jp text-cream truncate-1 mt-2 text-[20px] font-semibold break-all whitespace-pre-wrap">{data.title}</p>
      </div>
      <Image src={RightIcon} alt="right-icon" width={32} height={32} />
    </Link>
  );
};

export default MessageItem;
