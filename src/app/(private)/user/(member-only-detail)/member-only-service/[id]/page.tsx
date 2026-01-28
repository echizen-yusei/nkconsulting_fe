import UserLayout from "@/components/layout/UserLayout";
import MemberOnlyServicesDetail from "@/features/user/member-only-services/detail";

const VariousConsultingServicesDetailPage = () => {
  return (
    <UserLayout zIndex="z-60" mobilePaddingBottom="pb-0">
      <MemberOnlyServicesDetail />
    </UserLayout>
  );
};

export default VariousConsultingServicesDetailPage;
