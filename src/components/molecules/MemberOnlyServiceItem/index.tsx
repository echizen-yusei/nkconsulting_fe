import { PAGE } from "@/constants/page";
import { ConsultingService } from "@/types/membership-content";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MemberOnlyServiceItem = ({ consultingService }: { consultingService: ConsultingService }) => {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`${PAGE.USER_MEMBER_ONLY_SERVICE}/${id}`);
  };
  return (
    <div
      className="group bg-gray333 border-gradient-gold-not-rounded text-cream hover:bg-cream flex flex-1 flex-col p-6 transition-colors duration-500 hover:cursor-pointer hover:text-black hover:shadow-lg md:max-w-[calc(50%-12px)] md:min-w-[calc(50%-12px)] md:rounded-[8px]"
      onClick={() => handleClick(consultingService.id)}
      key={consultingService.id}
    >
      <div className="flex items-center gap-4">
        {consultingService?.thumbnail && (
          <Image src={consultingService?.thumbnail} alt={consultingService.title} width={32} height={32} className="h-8 w-8 object-cover" />
        )}
        <div className="heading-3-30 transition-colors duration-500 group-hover:text-black">{consultingService.title}</div>
      </div>
      <div className="mt-6">
        <div className="text-1 transition-colors duration-500 group-hover:text-black">{consultingService.description}</div>
      </div>
      <div className="mt-6 flex cursor-pointer items-center justify-end gap-2 md:justify-between">
        <span className="heading-5-20 transition-colors duration-500 group-hover:text-black">詳しく見る</span>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:[&_path]:fill-black">
          <g clipPath="url(#clip0_3080_193)">
            <path
              d="M11.0605 9.88L17.1672 16L11.0605 22.12L12.9405 24L20.9405 16L12.9405 8L11.0605 9.88Z"
              fill="#F2F2F2"
              className="transition-colors duration-500"
            />
          </g>
          <defs>
            <clipPath id="clip0_3080_193">
              <rect width="32" height="32" fill="white" transform="matrix(0 -1 1 0 0 32)" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default MemberOnlyServiceItem;
