import UserLayout from "@/components/layout/UserLayout";
import MemberOnlyBenefitsDetail from "@/features/user/member-only-benefits/detail";

const MemberOnlyBenefitsDetailPage = () => {
  return (
    <UserLayout zIndex="z-60" mobilePaddingBottom="pb-0">
      <MemberOnlyBenefitsDetail />
    </UserLayout>
  );
};

export default MemberOnlyBenefitsDetailPage;
