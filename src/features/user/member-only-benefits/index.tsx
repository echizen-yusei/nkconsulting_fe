import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import Nodata from "@/components/atoms/Nodata";
import Pagination from "@/components/atoms/Pagination";
import SectionHeader from "@/components/atoms/SectionHeader";
import MemberOnlyBenefitItem from "@/components/molecules/MemberOnlyBenefitItem";
import { useUserContext } from "@/components/providers/UserProvider";
import { isEmpty } from "@/libs/utils";
import { useGetMemberOnlyPost } from "@/services/membership-content";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const PAGE_KEY = "post_page";

const MemberOnlyBenefits = () => {
  const t = useTranslations("memberOnlyBenefitsDetail");
  const searchParams = useSearchParams();
  const { isLoadingUserInfo } = useUserContext();

  const currentPage = parseInt(searchParams.get(PAGE_KEY) || "1");

  const { data: memberOnlyPosts, isLoading: isLoadingMemberOnlyPosts } = useGetMemberOnlyPost(currentPage);

  const memberOnlyPostList = memberOnlyPosts?.member_only_posts.map((post) => <MemberOnlyBenefitItem key={post.id} memberOnlyPost={post} />) ?? [];

  const isLoading = !isLoadingUserInfo && isLoadingMemberOnlyPosts;

  return (
    <div className="mb-8 lg:mb-0">
      <SectionHeader title={t("title")} className="hidden md:block" />
      {!isLoadingMemberOnlyPosts && !isLoadingUserInfo && isEmpty(memberOnlyPostList) && <Nodata className="my-8 mt-0 md:my-12 md:text-start" />}
      {isLoading ? (
        <div className="relative mt-12 mb-6 flex h-full items-center justify-center">
          <LoadingAtoms />
        </div>
      ) : (
        !isEmpty(memberOnlyPostList) && (
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="mx-3 grid grid-cols-1 gap-6 md:mx-0 md:mt-12 lg:grid-cols-2 xl:grid-cols-3">{memberOnlyPostList}</div>
            <Pagination totalPages={memberOnlyPosts?.pagination?.total_pages ?? 0} pageKey={PAGE_KEY} maxVisiblePages={3} />
          </div>
        )
      )}
    </div>
  );
};
export default MemberOnlyBenefits;
