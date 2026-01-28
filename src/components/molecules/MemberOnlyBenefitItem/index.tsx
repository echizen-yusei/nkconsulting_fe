import { PAGE } from "@/constants/page";
import { MemberOnlyPost } from "@/types/membership-content";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MemberOnlyBenefitItem = ({ memberOnlyPost }: { memberOnlyPost: MemberOnlyPost }) => {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`${PAGE.USER_MEMBER_ONLY_BENEFIT}/${id}`);
  };
  return (
    <div
      className="bg-gray333 border-gradient-gold-not-rounded heading-5 text-cream group relative flex flex-1 items-center justify-center px-6 py-12 text-center whitespace-pre-line transition-colors duration-300 hover:cursor-pointer md:rounded-[8px]"
      onClick={() => handleClick(memberOnlyPost.id)}
      key={memberOnlyPost.id}
    >
      <Image src={memberOnlyPost.thumbnail} quality={70} alt={memberOnlyPost.title} fill className="rounded-none object-cover md:rounded-[8px]" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex items-center gap-4">
        <div>{memberOnlyPost.title}</div>
      </div>
    </div>
  );
};

export default MemberOnlyBenefitItem;
