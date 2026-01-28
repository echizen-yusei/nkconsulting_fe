"use client";
import { useUserMemberOnlyDetailContext } from "@/components/providers/MemberOnlyDetailProvider";
import { PAGE } from "@/constants/page";
import { MemberOnlyPost } from "@/types/membership-content";
import { useParams, useRouter } from "next/navigation";

const MemberOnlyBenefitList = ({ memberOnlyPosts }: { memberOnlyPosts: MemberOnlyPost[] }) => {
  const router = useRouter();
  const { id } = useParams();
  const { isMemberOnlyBenefitDetailPage } = useUserMemberOnlyDetailContext();
  const onClickBenefit = (id: number) => {
    router.push(`${PAGE.USER_MEMBER_ONLY_BENEFIT}/${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {memberOnlyPosts?.map((post) => {
        if (isMemberOnlyBenefitDetailPage && post.id === Number(id)) {
          return null;
        }
        return (
          <div
            className="heading-5 bg-gray333 text-cream hover:bg-cream rounded-md px-4 py-6 text-center hover:cursor-pointer hover:text-black!"
            onClick={() => onClickBenefit(post.id)}
            key={post.id}
          >
            {post.title}
          </div>
        );
      })}
    </div>
  );
};

export default MemberOnlyBenefitList;
