"use client";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import Nodata from "@/components/atoms/Nodata";
import Pagination from "@/components/atoms/Pagination";
import SectionHeader from "@/components/atoms/SectionHeader";
import MemberOnlyServiceItem from "@/components/molecules/MemberOnlyServiceItem";
import { useUserContext } from "@/components/providers/UserProvider";
import { isEmpty } from "@/libs/utils";
import { useGetMemberOnlyServices } from "@/services/membership-content";
import { ConsultingService } from "@/types/membership-content";
import { useSearchParams } from "next/navigation";

const PAGE_KEY = "service_page";

const MemberOnlyServices = () => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get(PAGE_KEY) || "1");
  const { isLoadingUserInfo } = useUserContext();
  const { data: consultingServices, isLoading: isLoadingConsultingServices } = useGetMemberOnlyServices(currentPage);

  return (
    <div className="mb-8 md:mb-16">
      <SectionHeader title="各種コンサルティングサービス" className="hidden md:block" />
      {!isLoadingConsultingServices && !isLoadingUserInfo && isEmpty(consultingServices?.consulting_services) && (
        <Nodata className="my-8 mt-0 md:my-12 md:text-start" />
      )}
      {isLoadingConsultingServices && !isLoadingUserInfo ? (
        <div className="relative mt-15 mb-6 flex h-full items-center justify-center">
          <LoadingAtoms />
        </div>
      ) : (
        !isEmpty(consultingServices?.consulting_services) && (
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="mx-3 flex flex-col gap-6 md:mx-0 md:mt-12 md:flex-row md:flex-wrap">
              {consultingServices?.consulting_services?.map((service: ConsultingService) => (
                <MemberOnlyServiceItem key={service.id} consultingService={service} />
              ))}
            </div>
            <Pagination totalPages={consultingServices?.pagination?.total_pages ?? 0} pageKey={PAGE_KEY} maxVisiblePages={3} />
          </div>
        )
      )}
    </div>
  );
};
export default MemberOnlyServices;
