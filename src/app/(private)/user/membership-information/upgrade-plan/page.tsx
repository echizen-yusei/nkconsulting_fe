"use client";

import UserLayout from "@/components/layout/UserLayout";
import { useMemberInfoContext } from "@/components/providers/MemberInfoProvider";
import { UpgradePlan } from "@/features/user/membership-infomation/upgrade-plan";

const ChangePlanPage = () => {
  const { breadcrumbCustom } = useMemberInfoContext();

  return (
    <UserLayout zIndex="z-60" breadcrumbCustom={breadcrumbCustom}>
      <UpgradePlan />
    </UserLayout>
  );
};

export default ChangePlanPage;
