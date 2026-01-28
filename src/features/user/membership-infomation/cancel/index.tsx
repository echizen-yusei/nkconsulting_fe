"use client";

import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { FieldErrors, FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/atoms/Button/Button";
import SectionHeader from "@/components/atoms/SectionHeader";
import { FormControl } from "@/components/atoms/FormField";
import ErrorMsg from "@/components/atoms/ErrorMsg";
import { PAGE } from "@/constants/page";
import { MemberCancellationFormData, memberCancellationSchema } from "@/schemas/member-cancellation";
import { useMemberCancellation } from "@/services/member-cancellation";
import { ReasonCancellationType } from "@/types/member-cancellation";
import { CANCELLATION_REASON_KEYS } from "@/constants";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { AxiosError } from "axios";
import CompleteModal from "@/components/atoms/CompleteModal";
import useModal from "@/hooks/useModal";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import LoadingDots from "@/components/atoms/LoadingDots";
import LoadingSpinner from "@/components/atoms/Loading";
import DynamicLayout from "@/components/layout/DynamicLayout";
import { formatDate } from "@/libs/utils";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/atoms/user-atoms";

const MemberCancellation = () => {
  const t = useTranslations("cancellationPage");
  const tValidation = useTranslations("Validation");
  const router = useRouter();
  const { mutate: cancelMembership, isPending } = useMemberCancellation();

  const handleShowError = useErrorHandler();
  const { isOpen, openModal, closeModal } = useModal();

  const methods = useForm<MemberCancellationFormData>({
    resolver: zodResolver(memberCancellationSchema(t, tValidation)),
    defaultValues: {
      infrequently: false,
      little_demand: false,
      different_expected: false,
      not_cost_effective: false,
      budgetary: false,
      not_easy_to_use: false,
      other: false,
      other_reason: "",
      desired_services: "",
      feedback: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleCancel = useCallback(() => {
    router.push(PAGE.MEMBERSHIP_INFORMATION);
  }, [router]);

  const onSubmit = (data: MemberCancellationFormData) => {
    if (isPending) return;
    const reasonKeys: ReasonCancellationType[] = Object.values(ReasonCancellationType);
    const selectedReasonsForCancellation = reasonKeys.filter((reason) => data[reason] === true);

    cancelMembership(
      {
        membership_cancellation: {
          desired_services_or_benefits: data.desired_services,
          feedback_during_usage: data.feedback,
          reasons_attributes: selectedReasonsForCancellation.map((reason) => ({
            reason_type: reason,
            other_reason: reason === ReasonCancellationType.OTHER ? data.other_reason : "",
          })),
        },
      },
      {
        onSuccess: () => {
          methods.reset();
          openModal();
        },
        onError: (error) => {
          handleShowError({ error: error as AxiosError<ErrorResponseData> });
        },
      },
    );
  };

  const handleCloseModal = () => {
    closeModal();
    router.push(PAGE.MEMBERSHIP_INFORMATION);
  };
  const onError = useFormErrorHandler(methods, { customErrorFields: ["reason_checkbox_group"] });

  return (
    <div className="max-w-xxl mx-auto">
      {isPending && <LoadingSpinner />}
      <DynamicLayout title={t("title")} onBack={handleCancel}>
        <MemberCancellationForm methods={methods} onSubmit={onSubmit} onError={onError} isPending={isPending} handleCancel={handleCancel} />
      </DynamicLayout>
      <CompleteModal
        contentClassName="h-full justify-center text-center"
        descriptionClassName="sm:whitespace-normal whitespace-pre-line font-noto-serif-jp md:text-[30px] font-semibold text-[20px]"
        description={t("form.cancelSuccess")}
        isOpen={isOpen}
        closeModal={handleCloseModal}
      />
    </div>
  );
};

const MemberCancellationForm = ({
  methods,
  onSubmit,
  onError,
  isPending,
  handleCancel,
}: {
  methods: UseFormReturn<MemberCancellationFormData>;
  onSubmit: (data: MemberCancellationFormData) => void;
  onError: (errors: FieldErrors<MemberCancellationFormData>) => void;
  isPending: boolean;
  handleCancel: () => void;
}) => {
  const [userInfo] = useAtom(userInfoAtom);
  const nextDueOn = userInfo?.next_due_on ?? "";

  const reasonCheckboxError = (methods.formState.errors as Record<string, { message?: string }>)?.reason_checkbox_group?.message;
  const t = useTranslations("cancellationPage");
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="flex flex-col gap-6 md:gap-12">
        <SectionHeader title={t("title")} />
        <div className="flex flex-col gap-6 md:gap-12 md:rounded-[8px]">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-wrap items-center justify-between gap-2 md:justify-start">
              <div className="text-cream heading-5 hidden whitespace-pre-line md:block md:whitespace-normal">1. {t("form.question1.label")}</div>
              <div className="text-cream text-1 whitespace-pre-line md:hidden md:whitespace-normal">1. {t("form.question1.label")}</div>
              <div className="bg-red-primary text-cream text-3 flex h-[20px] min-w-[29px] items-center justify-center text-center">{t("form.required")}</div>
            </div>
            <div>
              <div className="flex flex-col gap-2">
                {reasonCheckboxError && <ErrorMsg message={reasonCheckboxError} name="reason_checkbox_group" />}
                {CANCELLATION_REASON_KEYS.map((reasonKey) => (
                  <FormControl
                    key={reasonKey}
                    name={reasonKey}
                    label={t(`form.question1.reasons.${reasonKey}`)}
                    type="checkbox"
                    className="pointer-events-auto"
                    isShowLabel={true}
                    showRequiredLabel={false}
                  />
                ))}
              </div>
              <div className="mt-2">
                <FormControl
                  name="other_reason"
                  label={t("form.question1.detailLabel")}
                  placeholder={t("form.detailPlaceholder")}
                  className="pointer-events-auto gap-2 rounded-md"
                  isShowLabel={false}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between gap-2 md:justify-start">
              <div className="text-cream heading-5 hidden whitespace-pre-line sm:block sm:whitespace-normal">2. {t("form.question2.title")}</div>
              <div className="text-cream text-1 whitespace-pre-line sm:hidden sm:whitespace-normal">2. {t("form.question2.title")}</div>
              <div className="bg-red-primary text-cream text-3 flex h-[20px] min-w-[29px] items-center justify-center text-center">{t("form.required")}</div>
            </div>

            <FormControl
              type="textarea"
              name="desired_services"
              label={t("form.question2.label")}
              placeholder={t("form.detailPlaceholder")}
              className="pointer-events-auto gap-2 rounded-md"
              required
              isShowLabel={false}
              heightInput="h-[224px]"
            />
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between gap-2 md:justify-start">
              <div className="text-cream heading-5 hidden whitespace-pre-line sm:block sm:whitespace-normal">3. {t("form.question3.title")}</div>
              <div className="text-cream text-1 whitespace-pre-line sm:hidden sm:whitespace-normal">3. {t("form.question3.title")}</div>
              <div className="bg-red-primary text-cream text-3 flex h-[20px] min-w-[29px] items-center justify-center text-center">{t("form.required")}</div>
            </div>
            <FormControl
              name="feedback"
              label={t("form.question3.label")}
              type="textarea"
              placeholder={t("form.detailPlaceholder")}
              className="pointer-events-auto gap-2 rounded-md"
              required
              isShowLabel={false}
              heightInput="h-[224px]"
            />
          </div>

          <p className="text-cream text-1 whitespace-pre-line">
            {t("form.notes", {
              nextDueOn: formatDate(nextDueOn, "YYYY年MM月DD日"),
            })}
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <Button type="submit" buttonType="secondary" className="heading-5 pointer-events-auto h-14! w-full py-0! md:flex-1">
              {isPending ? <LoadingDots /> : t("form.submitButton")}
            </Button>
            <Button type="button" onClick={handleCancel} buttonType="white" className="heading-5 pointer-events-auto h-14! w-full py-0! md:flex-1">
              {t("form.cancelButton")}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default MemberCancellation;
