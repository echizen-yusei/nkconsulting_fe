import UserLayout from "@/components/layout/UserLayout";
import MemberCancellation from "@/features/user/membership-infomation/cancel";

const Cancel = () => {
  return (
    <UserLayout zIndex="z-60">
      <MemberCancellation />
    </UserLayout>
  );
};

export default Cancel;
