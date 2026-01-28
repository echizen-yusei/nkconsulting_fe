import SectionHeader from "@/components/atoms/SectionHeader";
import MembershipOnlyServiceList from "../../../molecules/MemberOnlyServiceList";
import MemberOnlyBenefitList from "../../../molecules/MemberOnlyBenefitList";
import { useTranslations } from "next-intl";
import { isEmpty } from "@/libs/utils";
import { useUserMemberOnlyDetailContext } from "@/components/providers/MemberOnlyDetailProvider";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";

const MemberBenefitsAndServices = () => {
  const t = useTranslations("memberOnlyBenefitsDetail");

  const {
    serviceData,
    postData,
    isLoadingMemberOnlyPosts,
    hasLoadMoreServices,
    hasLoadMorePosts,
    handleLoadMoreServices,
    handleLoadMorePosts,
    isLoadingConsultingServices,
    isLoadMoreServices,
    isLoadMorePosts,
    isMemberOnlyServiceDetailPage,
    isMemberOnlyBenefitDetailPage,
  } = useUserMemberOnlyDetailContext();

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {!isEmpty(serviceData) && (!isMemberOnlyServiceDetailPage || (isMemberOnlyServiceDetailPage && serviceData.length > 1)) && (
        <div className="flex flex-col gap-4 md:gap-8">
          <SectionHeader title={t("consultingServices")} textStyle="heading-5" titleClassName="md:ml-2!" />
          <div>
            <MembershipOnlyServiceList memberOnlyServices={serviceData} />
            {isLoadMoreServices ? (
              <div className="relative mt-6 md:mt-5">
                <LoadingAtoms height="h-6" width="w-6" />
              </div>
            ) : (
              hasLoadMoreServices &&
              !isLoadingConsultingServices && (
                <button className="text-cream text-1 mt-3 cursor-pointer hover:opacity-80" onClick={handleLoadMoreServices}>
                  {t("loadMore")}
                </button>
              )
            )}
          </div>
        </div>
      )}
      {!isEmpty(postData) && (!isMemberOnlyBenefitDetailPage || (isMemberOnlyBenefitDetailPage && postData.length > 1)) && (
        <div className="flex flex-col gap-4 md:gap-8">
          <SectionHeader title={t("memberOnlyBenefits")} textStyle="heading-5" titleClassName="md:ml-2!" />
          <div>
            <MemberOnlyBenefitList memberOnlyPosts={postData} />
            {isLoadMorePosts ? (
              <div className="relative mt-6 md:mt-5">
                <LoadingAtoms height="h-6" width="w-6" />
              </div>
            ) : (
              hasLoadMorePosts &&
              !isLoadingMemberOnlyPosts && (
                <button className="text-cream text-1 mt-3 cursor-pointer hover:opacity-80" onClick={handleLoadMorePosts}>
                  {t("loadMore")}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberBenefitsAndServices;
