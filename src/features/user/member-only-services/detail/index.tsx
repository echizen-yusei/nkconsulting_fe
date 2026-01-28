"use client";
import SectionHeader from "@/components/atoms/SectionHeader";
import FixedMobileLayout from "@/components/layout/FixedMobileLayout";
import { MEMBER_ONLY_CONTENT_TAB } from "@/constants";
import { PAGE } from "@/constants/page";
import { isEmpty } from "@/libs/utils";
import { useGetMemberOnlyServicesDetail, useSendMemberOnlyServiceContactForm } from "@/services/membership-content";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";

import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import { useUserContext } from "@/components/providers/UserProvider";
import { useSetAtom } from "jotai";
import { customEventTabTitleAtom } from "@/atoms/user-atoms";
import { FieldValues } from "react-hook-form";
import { AxiosError } from "axios";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { toast } from "sonner";
import RenderHtml from "@/components/atoms/RenderHtml";
import Nodata from "@/components/atoms/Nodata";
import MemberBenefitsAndServices from "@/components/organisms/user/MemberBenefitsAndServices";
import InquiryForm from "@/components/molecules/InquiryForm";

const MemberOnlyServicesDetail = () => {
  const t = useTranslations("memberOnlyServicesDetail");
  const handleShowError = useErrorHandler();
  const { isLoadingUserInfo } = useUserContext();
  const setCustomEventTabTitle = useSetAtom(customEventTabTitleAtom);
  const { id } = useParams();
  const router = useRouter();

  const { mutate: sendMemberOnlyServiceContactForm, isPending } = useSendMemberOnlyServiceContactForm();

  const onSendInquiries = useCallback(
    (data: FieldValues, callbacks?: { onSuccess?: () => void; onError?: (error: unknown) => void }) => {
      if (isPending) return;
      sendMemberOnlyServiceContactForm(
        { id: Number(id).toString(), data },
        {
          onSuccess: () => {
            toast.success(t("contactSuccess"));
            callbacks?.onSuccess?.();
          },
          onError: (error) => {
            handleShowError({ error: error as AxiosError<ErrorResponseData> });
            callbacks?.onError?.(error);
          },
        },
      );
    },
    [handleShowError, id, isPending, sendMemberOnlyServiceContactForm, t],
  );

  const { data: consultingServicesDetail, isLoading: isLoadingDetail, error } = useGetMemberOnlyServicesDetail(Number(id));

  const consultingServicesDetailData = consultingServicesDetail?.consulting_service;

  useEffect(() => {
    if (consultingServicesDetailData?.title) {
      setCustomEventTabTitle(consultingServicesDetailData.title);
    }

    return () => {
      setCustomEventTabTitle(null);
    };
  }, [consultingServicesDetailData?.title, setCustomEventTabTitle]);

  const onBack = () => {
    router.push(`${PAGE.USER}?tab=${MEMBER_ONLY_CONTENT_TAB.memberOnlyServices}`);
  };

  const renderContent = useCallback((): React.ReactNode => {
    return (
      <>
        <div className="text-cream mt-8 flex flex-col gap-6 md:mt-16 md:gap-12">
          {isEmpty(consultingServicesDetailData) && !isLoadingDetail ? (
            <div>
              <SectionHeader title={t("serviceDetails")} />
              <Nodata className="md:text-start" />
            </div>
          ) : (
            <>
              <div className="heading-1 block md:hidden">{consultingServicesDetailData?.title}</div>
              <div>
                <SectionHeader title={t("serviceDetails")} />
                {isLoadingDetail && !isLoadingUserInfo ? (
                  <div className="relative mt-12 mb-6 flex h-full items-center justify-center">
                    <LoadingAtoms />
                  </div>
                ) : (
                  <RenderHtml content={consultingServicesDetailData?.content} className="text-cream text-1 mt-4 md:mt-6" />
                )}
              </div>
            </>
          )}
          <div className="flex flex-col gap-4 md:gap-6">
            <SectionHeader title={t("contact")} />
            <div className="text-1 whitespace-pre-line">{t("contactDescription")}</div>
            <InquiryForm onSendInquiries={onSendInquiries} isLoading={isPending} />
          </div>
        </div>
        <div className="mt-12 block md:hidden">
          <MemberBenefitsAndServices />
        </div>
      </>
    );
  }, [consultingServicesDetailData, onSendInquiries, isLoadingDetail, isLoadingUserInfo, isPending, t]);

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData>, isHandle404: false });
    }
  }, [error, handleShowError]);

  return (
    <div className="mx-12 flex flex-col gap-6 md:flex-row lg:gap-12">
      <div className="xxl:w-[69.87%] flex-6">
        <FixedMobileLayout title={t("title")} onBack={onBack}>
          {renderContent()}
        </FixedMobileLayout>
        <div className="hidden md:block">{renderContent()}</div>
      </div>
      <div className="mt-16 hidden w-[30.12%] md:block">
        <MemberBenefitsAndServices />
      </div>
    </div>
  );
};

export default MemberOnlyServicesDetail;
