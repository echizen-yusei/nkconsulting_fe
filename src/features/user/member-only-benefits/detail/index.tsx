"use client";
import { customEventTabTitleAtom } from "@/atoms/user-atoms";
import InquiryForm from "@/components/molecules/InquiryForm";
import LoadingAtoms from "@/components/atoms/LoadingAtoms";
import Nodata from "@/components/atoms/Nodata";
import RenderHtml from "@/components/atoms/RenderHtml";
import SectionHeader from "@/components/atoms/SectionHeader";
import FixedMobileLayout from "@/components/layout/FixedMobileLayout";
import MemberBenefitsAndServices from "@/components/organisms/user/MemberBenefitsAndServices";
import { useUserContext } from "@/components/providers/UserProvider";
import { MEMBER_ONLY_CONTENT_TAB } from "@/constants";
import { PAGE } from "@/constants/page";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { isEmpty } from "@/libs/utils";
import { useGetMemberOnlyPostDetail, useSendMemberOnlyPostContactForm } from "@/services/membership-content";
import { AxiosError } from "axios";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const MemberOnlyBenefitsDetail = () => {
  const { id } = useParams();
  const { isLoadingUserInfo } = useUserContext();
  const setCustomEventTabTitle = useSetAtom(customEventTabTitleAtom);
  const t = useTranslations("memberOnlyBenefitsDetail");
  const handleShowError = useErrorHandler();
  const router = useRouter();
  const { mutate: sendMemberOnlyPostContactForm, isPending } = useSendMemberOnlyPostContactForm();

  const { data: memberOnlyPostData, isLoading: isLoadingDetail, error } = useGetMemberOnlyPostDetail(Number(id));
  const memberOnlyPostDetail = memberOnlyPostData?.member_only_post;

  const onBack = () => {
    router.push(`${PAGE.USER}?tab=${MEMBER_ONLY_CONTENT_TAB.memberOnlyBenefits}`);
  };

  const onSendInquiries = useCallback(
    (data: FieldValues, callbacks?: { onSuccess?: () => void; onError?: (error: unknown) => void }) => {
      sendMemberOnlyPostContactForm(
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
    [handleShowError, id, sendMemberOnlyPostContactForm, t],
  );

  useEffect(() => {
    if (memberOnlyPostDetail?.title) {
      setCustomEventTabTitle(memberOnlyPostDetail?.title);
    }
    return () => {
      setCustomEventTabTitle(null);
    };
  }, [memberOnlyPostDetail?.title, setCustomEventTabTitle]);

  const contentServices = (
    <>
      <div className="text-cream mt-8 flex flex-col gap-6 md:mt-16 md:gap-12">
        <div className="heading-1 block md:hidden">{memberOnlyPostDetail?.title}</div>
        <div>
          <SectionHeader title={t("serviceDetails")} />
          {isEmpty(memberOnlyPostDetail) && !isLoadingDetail ? (
            <Nodata className="md:text-start" />
          ) : isLoadingDetail && !isLoadingUserInfo ? (
            <div className="relative mt-12 mb-6 flex h-full items-center justify-center">
              <LoadingAtoms />
            </div>
          ) : (
            <RenderHtml content={memberOnlyPostDetail?.content} className="text-cream text-1 mt-4 md:mt-6" />
          )}
        </div>
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

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData>, isHandle404: false });
    }
  }, [error, handleShowError]);

  return (
    <div className="mx-12 flex flex-col gap-6 md:flex-row lg:gap-12">
      <div className="xxl:w-[69.87%] flex-6">
        <FixedMobileLayout title={t("title")} onBack={onBack}>
          {contentServices}
        </FixedMobileLayout>
        <div className="hidden md:block">{contentServices}</div>
      </div>
      <div className="mt-16 hidden w-[30.12%] md:block">
        <MemberBenefitsAndServices />
      </div>
    </div>
  );
};

export default MemberOnlyBenefitsDetail;
