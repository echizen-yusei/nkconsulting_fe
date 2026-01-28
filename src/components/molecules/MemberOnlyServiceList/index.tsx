"use client";
import { useUserMemberOnlyDetailContext } from "@/components/providers/MemberOnlyDetailProvider";
import { PAGE } from "@/constants/page";
import { ConsultingService } from "@/types/membership-content";
import { useParams, useRouter } from "next/navigation";

const MembershipOnlyServiceList = ({ memberOnlyServices }: { memberOnlyServices: ConsultingService[] }) => {
  const router = useRouter();
  const { id } = useParams();
  const { isMemberOnlyServiceDetailPage } = useUserMemberOnlyDetailContext();
  const onClick = (id: number) => {
    router.push(`${PAGE.USER_MEMBER_ONLY_SERVICE}/${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {memberOnlyServices?.map((service) => {
        if (isMemberOnlyServiceDetailPage && service.id === Number(id)) {
          return null;
        }
        return (
          <div
            className="heading-5 bg-gray333 text-cream hover:bg-cream rounded-md px-4 py-6 text-center hover:cursor-pointer hover:text-black!"
            onClick={() => onClick(service.id)}
            key={service.id}
          >
            {service.title}
          </div>
        );
      })}
    </div>
  );
};

export default MembershipOnlyServiceList;
