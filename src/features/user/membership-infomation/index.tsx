"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormControl } from "@/components/atoms/FormField";
import Button from "@/components/atoms/Button/Button";
import SectionHeader from "@/components/atoms/SectionHeader";
import { useDatePicker } from "@/hooks/useDataPicker";
import FormLabel from "@/components/atoms/FormLabel";
import WorkHistoryItem from "@/components/molecules/WorkHistoryItem";
import { PAGE } from "@/constants/page";
import { actionScrollToTop } from "@/libs";
import { RegisterFormDataType, SchoolType } from "@/types/register";
import { MemberFormSelectFields, PLAN_CAN_UPGRADE, planName } from "@/constants";
import { AxiosError } from "axios";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import {
  cleanArray,
  createSearchHandlerWithNoneOption,
  formatPhoneNumber,
  handleSearchSchool,
  isEmpty,
  onError,
  parseDate,
  resolveBoolean,
} from "@/libs/utils";
import LoadingSpinner from "@/components/atoms/Loading";
import useBlock from "@/hooks/useBlock";
import { useWorkHistory } from "@/hooks/useWorkHistoryValidation";
import ErrorMsg from "@/components/atoms/ErrorMsg";
import { useGetProfile, useUpdateProfile } from "@/services/membership-infomation";
import { useMembershipInfo } from "@/hooks/useMembershipInfo";
import { useMembershipInformationFormChanges } from "@/hooks/useMembershipInformationFormChanges";
import { toast } from "sonner";
import useActionAuth from "@/hooks/useAuth";
import { userInfoAtom } from "@/atoms/user-atoms";
import { useAtom } from "jotai";
import useModal from "@/hooks/useModal";
import ConfirmDialog from "@/components/atoms/ConfirmDialog";
import { useRouter } from "next/navigation";
import EditEmailModal from "@/components/molecules/EditEmailModal";
import CompleteModal from "@/components/atoms/CompleteModal";
import { useUserContext } from "@/components/providers/UserProvider";
import { MembershipInformationFormData, membershipInformationSchema } from "@/schemas/membership-info";

const MembershipInfomation = () => {
  const { handleLogout, isLoadingLogout } = useActionAuth();
  const { isLoadingUserInfo } = useUserContext();
  const { data: profileInfo, isPending: isLoadingProfile, error: profileError } = useGetProfile();
  const profileData = profileInfo?.data?.user;
  const { closeModal, openModal, isOpen } = useModal();
  const { openModal: openEditEmailModal, closeModal: closeEditEmailModal, isOpen: isOpenEditEmailModal } = useModal();
  const { openModal: openCompleteModal, closeModal: closeCompleteModal, isOpen: isOpenCompleteModal } = useModal();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const t = useTranslations("profilePage");
  const tValidation = useTranslations("Validation");

  const router = useRouter();
  const [initialFormData, setInitialFormData] = useState<Partial<RegisterFormDataType> | null>(null);
  const [initialWorkHistoryItems, setInitialWorkHistoryItems] = useState<number[]>([1]);

  const methods = useForm<MembershipInformationFormData>({
    resolver: zodResolver(membershipInformationSchema(t, tValidation, initialWorkHistoryItems)),
    defaultValues: {
      year_of_birth: "",
      month_of_birth: "",
      day_of_birth: "",
      plan_type: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  // Birthday date picker
  const birthdayDatePicker = useDatePicker();
  // Graduation date pickers
  const elementaryDatePicker = useDatePicker();
  const juniorHighDatePicker = useDatePicker();
  const highSchoolDatePicker = useDatePicker();
  const universityDatePicker = useDatePicker();

  const { addWorkHistory, getWorkHistoryFields, removeWorkHistory, workHistoryItems, setWorkHistoryItems, getWorkHistoryDefaultValues } =
    useWorkHistory(methods);
  const { mapProfileToFormData } = useMembershipInfo(getWorkHistoryDefaultValues);

  // Initialize form with profile data
  useEffect(() => {
    if (profileData) {
      const { formData, workHistoryIndices } = mapProfileToFormData(profileData);
      // Update workHistoryItems
      setWorkHistoryItems(workHistoryIndices);
      setInitialWorkHistoryItems(workHistoryIndices);
      // Set form values
      Object.entries(formData).forEach(([key, value]) => {
        methods.setValue(key as keyof RegisterFormDataType, value as never, { shouldValidate: false, shouldDirty: false });
      });
      // Save initial form data for comparison
      setInitialFormData(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, mapProfileToFormData, methods]);

  useBlock(methods.formState.isDirty);

  // Generate work history field names dynamically
  const workHistoryFieldNames = useMemo(() => {
    const fields: string[] = [];
    workHistoryItems.forEach((index) => {
      fields.push(...getWorkHistoryFields(index));
    });
    return fields;
  }, [workHistoryItems, getWorkHistoryFields]);

  // Watch all form values at once to reduce re-renders
  const watchedValues = useWatch({
    control: methods.control,
    name: [
      "month_of_birth",
      "year_of_birth",
      "elementary_graduation_month",
      "elementary_graduation_year",
      "junior_high_graduation_month",
      "junior_high_graduation_year",
      "high_school_graduation_month",
      "high_school_graduation_year",
      "university_graduation_month",
      "university_graduation_year",
      "high_school",
      "university",
      "company_postal_code_1",
      "company_postal_code_2",
      ...workHistoryFieldNames,
    ] as Array<keyof RegisterFormDataType>,
  });

  // Watch checkbox values for radio-like behavior
  const allergiesTrue = useWatch({ control: methods.control, name: "is_allergies_or_conditions_true" as keyof RegisterFormDataType }) as boolean;
  const allergiesFalse = useWatch({ control: methods.control, name: "is_allergies_or_conditions_false" as keyof RegisterFormDataType }) as boolean;
  const smokingTrue = useWatch({ control: methods.control, name: "is_smoking_preference_true" as keyof RegisterFormDataType }) as boolean;
  const smokingFalse = useWatch({ control: methods.control, name: "is_smoking_preference_false" as keyof RegisterFormDataType }) as boolean;
  const drinkingTrue = useWatch({ control: methods.control, name: "is_drinking_alcohol_true" as keyof RegisterFormDataType }) as boolean;
  const drinkingFalse = useWatch({ control: methods.control, name: "is_drinking_alcohol_false" as keyof RegisterFormDataType }) as boolean;

  // Ensure radio-like behavior for checkbox groups
  useEffect(() => {
    if (allergiesTrue) {
      methods.setValue("is_allergies_or_conditions_false" as keyof RegisterFormDataType, false, { shouldValidate: false });
    }
  }, [allergiesTrue, methods]);

  useEffect(() => {
    if (allergiesFalse) {
      methods.setValue("is_allergies_or_conditions_true" as keyof RegisterFormDataType, false, { shouldValidate: false });
    }
  }, [allergiesFalse, methods]);

  useEffect(() => {
    if (smokingTrue) {
      methods.setValue("is_smoking_preference_false" as keyof RegisterFormDataType, false, { shouldValidate: false });
    }
  }, [smokingTrue, methods]);

  useEffect(() => {
    if (smokingFalse) {
      methods.setValue("is_smoking_preference_true" as keyof RegisterFormDataType, false, { shouldValidate: false });
    }
  }, [smokingFalse, methods]);

  useEffect(() => {
    if (drinkingTrue) {
      methods.setValue("is_drinking_alcohol_false" as keyof RegisterFormDataType, false, { shouldValidate: false });
    }
  }, [drinkingTrue, methods]);

  useEffect(() => {
    if (drinkingFalse) {
      methods.setValue("is_drinking_alcohol_true" as keyof RegisterFormDataType, false, { shouldValidate: false });
    }
  }, [drinkingFalse, methods]);

  const isCanUpgradePlan = (PLAN_CAN_UPGRADE as readonly string[]).includes(profileData?.plan_type as string) && !profileData?.is_membership_cancellation;

  const [
    monthOfBirthValue,
    yearOfBirthValue,
    elementaryMonthValue,
    elementaryYearValue,
    juniorHighMonthValue,
    juniorHighYearValue,
    highSchoolMonthValue,
    highSchoolYearValue,
    universityMonthValue,
    universityYearValue,
  ] = watchedValues;

  // Update all date pickers in a single effect to reduce re-renders
  useEffect(() => {
    if (monthOfBirthValue) {
      birthdayDatePicker.setMonth(Number(monthOfBirthValue));
    }
    if (yearOfBirthValue) {
      birthdayDatePicker.setYear(Number(yearOfBirthValue));
    }
    if (elementaryMonthValue) {
      elementaryDatePicker.setMonth(Number(elementaryMonthValue));
    }
    if (elementaryYearValue) {
      elementaryDatePicker.setYear(Number(elementaryYearValue));
    }
    if (juniorHighMonthValue) {
      juniorHighDatePicker.setMonth(Number(juniorHighMonthValue));
    }
    if (juniorHighYearValue) {
      juniorHighDatePicker.setYear(Number(juniorHighYearValue));
    }
    if (highSchoolMonthValue) {
      highSchoolDatePicker.setMonth(Number(highSchoolMonthValue));
    }
    if (highSchoolYearValue) {
      highSchoolDatePicker.setYear(Number(highSchoolYearValue));
    }
    if (universityMonthValue) {
      universityDatePicker.setMonth(Number(universityMonthValue));
    }
    if (universityYearValue) {
      universityDatePicker.setYear(Number(universityYearValue));
    }
  }, [
    monthOfBirthValue,
    yearOfBirthValue,
    elementaryMonthValue,
    elementaryYearValue,
    juniorHighMonthValue,
    juniorHighYearValue,
    highSchoolMonthValue,
    highSchoolYearValue,
    universityMonthValue,
    universityYearValue,
    birthdayDatePicker,
    elementaryDatePicker,
    juniorHighDatePicker,
    highSchoolDatePicker,
    universityDatePicker,
  ]);

  const { mutate: updateProfile, isPending: isLoadingUpdateProfile } = useUpdateProfile();
  const handleShowError = useErrorHandler();

  const selectFields: Array<keyof RegisterFormDataType> = useMemo(
    () => [...MemberFormSelectFields, ...workHistoryFieldNames.map((fieldName) => fieldName as keyof RegisterFormDataType)],
    [workHistoryFieldNames],
  );

  // Compare current form data with initial data using custom hook
  const hasFormChanges = useMembershipInformationFormChanges({
    // @ts-expect-error - Methods type is compatible with RegisterFormDataType
    methods,
    initialFormData,
    workHistoryItems,
    initialWorkHistoryItems,
    getWorkHistoryFields,
  });

  const onSubmit = useCallback(
    (data: MembershipInformationFormData) => {
      // Check if form has changes, return null if no changes
      if (!hasFormChanges) {
        toast.warning(t("messages.noChanges"));
        return;
      }

      const user = {
        user: {
          email: data.email,
          member_information_attributes: {
            age: data.year_old,
            birthday: parseDate({ year: data.year_of_birth, month: data.month_of_birth, day: data.day_of_birth }),
            full_name: data.full_name,
            full_name_kana: data.full_name_kana,
            phone_number: formatPhoneNumber(data.phone_number),
          },
          profile_attributes: {
            allergies_or_conditions: data.is_allergies_or_conditions_true ? data.allergies_or_conditions : undefined,
            drinking_frequency: data.is_drinking_alcohol_true ? data.drinking_frequency : undefined,
            smoking_preference: data.is_smoking_preference_true ? data.smoking_preference : undefined,
            is_allergies_or_conditions: resolveBoolean(data.is_allergies_or_conditions_true, data.is_allergies_or_conditions_false),
            is_smoking_preference: resolveBoolean(data.is_smoking_preference_true, data.is_smoking_preference_false),
            is_drinking_alcohol: resolveBoolean(data.is_drinking_alcohol_true, data.is_drinking_alcohol_false),
            hobbies_and_skill_1: data.hobbies_and_skills_1 ? data.hobbies_and_skills_1 : undefined,
            hobbies_and_skill_2: data.hobbies_and_skills_2 ? data.hobbies_and_skills_2 : undefined,
            hobbies_and_skill_3: data.hobbies_and_skills_3 ? data.hobbies_and_skills_3 : undefined,
          },
          member_plan_attributes: {
            plan_type: data.plan_type,
            purpose_of_joining: data.purpose_of_joining,
          },
          career_histories_attributes: [
            {
              name: data.elementary_school ? data.elementary_school : null,
              education_level: SchoolType.SHOUGAKKOU,
              target_date: parseDate({ year: data.elementary_graduation_year || "", month: data.elementary_graduation_month || "", day: "01" }),
            },
            {
              name: data.junior_high_school ? data.junior_high_school : null,
              education_level: SchoolType.CHUUGAKKOU,
              target_date: parseDate({ year: data.junior_high_graduation_year || "", month: data.junior_high_graduation_month || "", day: "01" }),
            },
            {
              name: data.high_school ? data.high_school : null,
              education_level: SchoolType.KOUKOU,
              target_date: parseDate({ year: data.high_school_graduation_year || "", month: data.high_school_graduation_month || "", day: "01" }),
            },
            {
              name: data.university ? data.university : null,
              education_level: SchoolType.DAIGAKU_OR_SENMON,
              target_date: parseDate({ year: data.university_graduation_year || "", month: data.university_graduation_month || "", day: "01" }),
            },
          ],
          company_histories_attributes: cleanArray(
            workHistoryItems
              .map((index) => {
                const companyName = (data[`work_history_${index}_company_name` as keyof RegisterFormDataType] as string) || "";
                const position = (data[`work_history_${index}_position` as keyof RegisterFormDataType] as string) || "";
                const yearJoined = data[`work_history_${index}_year_joined` as keyof RegisterFormDataType] || "";
                const monthJoined = data[`work_history_${index}_month_joined` as keyof RegisterFormDataType] || "";
                const yearLefted = data[`work_history_${index}_year_lefted` as keyof RegisterFormDataType] || "";
                const monthLefted = data[`work_history_${index}_month_lefted` as keyof RegisterFormDataType] || "";
                const isCurrentCompany = (data[`work_history_${index}_in_service` as keyof RegisterFormDataType] as string) === "true";

                if (!companyName && !position && !yearJoined && !monthJoined && !yearLefted && !monthLefted) {
                  return null;
                }

                const result: {
                  company_name: string;
                  position: string;
                  is_current_company: boolean;
                  start_date: string;
                  end_date?: string;
                } = {
                  company_name: companyName,
                  position: position,
                  is_current_company: isCurrentCompany,
                  start_date: parseDate({
                    year: String(yearJoined),
                    month: String(monthJoined),
                    day: "01",
                  }) as string,
                };

                if (!isCurrentCompany) {
                  result.end_date = parseDate({
                    year: String(yearLefted),
                    month: String(monthLefted),
                    day: "01",
                  }) as string;
                }

                return result;
              })
              .filter((item): item is NonNullable<typeof item> => item !== null)
              .map((item, orderIndex) => ({
                company_name: item.company_name ? item.company_name : undefined,
                position: item.position ? item.position : undefined,
                is_current_company: item.is_current_company,
                start_date: item.start_date ? item.start_date : undefined,
                end_date: item.end_date ? item.end_date : undefined,
                order: orderIndex + 1,
              })),
          ),
        },
      };

      updateProfile(user, {
        onSuccess: (res) => {
          const { formData, workHistoryIndices } = mapProfileToFormData(res?.data?.user ?? null);
          setWorkHistoryItems(workHistoryIndices);
          setInitialWorkHistoryItems(workHistoryIndices);
          Object.entries(formData).forEach(([key, value]) => {
            methods.setValue(key as keyof RegisterFormDataType, value as never, { shouldValidate: false, shouldDirty: false });
          });
          // Update initial form data after successful submit
          setInitialFormData(formData);
          const user = { ...userInfo, email: res.data.user.email, plan_type_key: res.data.user.plan_type, full_name: res.data.user.full_name };
          setUserInfo(user);
          toast.success(t("messages.updateSuccess"));
        },
        onError: (err) => {
          handleShowError({ error: err as AxiosError<ErrorResponseData> });
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workHistoryItems, updateProfile, methods, hasFormChanges],
  );

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const currentSchema = membershipInformationSchema(t, tValidation, workHistoryItems);
      const formValues = methods.getValues();

      const result = currentSchema.safeParse(formValues);

      if (!result.success) {
        methods.clearErrors();

        const errors: Record<string, { message?: string }> = {};
        result.error.errors.forEach((error) => {
          const path = error.path.join(".");
          methods.setError(path, {
            type: "validation",
            message: error.message,
          });
          errors[path] = { message: error.message };
        });

        const errorFields = result.error.errors.map((err) => err.path.join("."));
        onError(errors, methods, errorFields.length > 0 ? errorFields : selectFields);
        return;
      }

      methods.handleSubmit(onSubmit, (errors) => onError(errors as Record<string, { message?: string }>, methods, selectFields))(e);
    },
    [methods, onSubmit, selectFields, t, tValidation, workHistoryItems],
  );

  const handleCancelMembership = useCallback(() => {
    if (profileData?.is_membership_cancellation) {
      return;
    }
    router.push(PAGE.MEMBERSHIP_INFORMATION_CANCEL);
    closeModal();
  }, [closeModal, profileData?.is_membership_cancellation, router]);

  useEffect(() => {
    actionScrollToTop();
  }, []);

  const handleSearchHighSchool = useMemo(() => createSearchHandlerWithNoneOption(SchoolType.KOUKOU, t("form.educationWorkHistory.highSchool.none")), [t]);

  const handleSearchUniversity = useMemo(
    () => createSearchHandlerWithNoneOption(SchoolType.DAIGAKU_OR_SENMON, t("form.educationWorkHistory.university.none")),
    [t],
  );

  useEffect(() => {
    if (profileError) {
      handleShowError({ error: profileError as AxiosError<ErrorResponseData> });
    }
  }, [handleShowError, profileError]);

  return (
    <div className="max-w-xxl mx-auto">
      {(isLoadingProfile || isLoadingLogout || isLoadingUpdateProfile) && !isLoadingUserInfo && <LoadingSpinner />}
      <div className="mt-8 flex flex-col justify-center md:mx-6 md:mt-16 lg:flex-row lg:gap-8 xl:mx-12 xl:gap-12">
        <div className="flex-1">
          <FormProvider {...methods}>
            <div className="relative flex-1">
              <form id="membership-information-form" className="flex flex-col gap-8 rounded-md sm:relative md:gap-12" onSubmit={handleFormSubmit}>
                {/* 基本情報 Section */}
                <div className="flex flex-col gap-4 md:gap-12">
                  <SectionHeader className="ml-6 md:ml-0" title={t("form.basicInformation.title")} />
                  <div className="bg-gray333 border-gradient-gold-not-rounded flex flex-col gap-6 p-6 md:rounded-[8px] md:py-12">
                    <div className="flex flex-col gap-6">
                      {!isEmpty(profileData?.next_due_on) && (
                        <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:gap-4">
                          <div className="flex items-center justify-between">
                            <FormLabel className="flex-1">{t("form.basicInformation.nextDueOn")}</FormLabel>
                          </div>
                          <div className="text-cream heading-5-20 pointer-events-auto flex flex-1 items-center justify-between gap-2 rounded-md md:gap-4 xl:max-w-[634px]">
                            {profileData?.next_due_on}
                          </div>
                        </div>
                      )}
                      <FormControl
                        name="full_name"
                        label={t("form.basicInformation.name.label")}
                        placeholder={t("form.basicInformation.name.fullName")}
                        className="pointer-events-auto gap-2 rounded-md md:gap-4"
                        required
                        maxLength={255}
                        inputClassName="xl:max-w-[634px]"
                        showRequiredLabel={false}
                      />
                      <FormControl
                        name="full_name_kana"
                        label="ふりがな"
                        placeholder={t("form.basicInformation.name.furigana")}
                        className="pointer-events-auto gap-2 rounded-md md:gap-4"
                        required
                        maxLength={255}
                        inputClassName="xl:max-w-[634px]"
                        showRequiredLabel={false}
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-2 md:gap-4 xl:flex-row">
                      <FormLabel>{t("form.basicInformation.birthday.label")}</FormLabel>
                      <div className="flex w-full flex-1 justify-end gap-2 md:gap-4 xl:max-w-[634px]">
                        <div className="flex w-full gap-2 md:gap-4">
                          <FormControl
                            name="year_of_birth"
                            type="select"
                            label={t("form.basicInformation.birthday.year")}
                            placeholder={t("form.basicInformation.birthday.year")}
                            options={birthdayDatePicker.yearOptions}
                            className="pointer-events-auto flex-1 gap-4 rounded-md"
                            isShowLabel={false}
                            isSelectRequired
                          />
                          <FormControl
                            name="month_of_birth"
                            type="select"
                            label={t("form.basicInformation.birthday.month")}
                            placeholder={t("form.basicInformation.birthday.month")}
                            options={birthdayDatePicker.monthOptions}
                            className="pointer-events-auto flex-1 gap-4 rounded-md"
                            isShowLabel={false}
                            isSelectRequired
                          />
                          <FormControl
                            name="day_of_birth"
                            type="select"
                            label={t("form.basicInformation.birthday.day")}
                            placeholder={t("form.basicInformation.birthday.day")}
                            options={birthdayDatePicker.dayOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isShowLabel={false}
                            isSelectRequired
                          />
                        </div>
                      </div>
                    </div>
                    <FormControl
                      name="year_old"
                      label={t("form.basicInformation.yearOld.label")}
                      placeholder={t("form.basicInformation.yearOld.placeholder")}
                      className="pointer-events-auto w-full gap-2 rounded-md md:gap-4"
                      isNumber
                      isYearOld
                      required
                      inputClassName="xl:max-w-[634px]"
                      showRequiredLabel={false}
                    />
                    <div className="flex justify-end">
                      <div className="flex w-full flex-col justify-between gap-2 md:gap-4 xl:flex-row">
                        <div className="flex items-center justify-between">
                          <FormLabel className="flex-1">{t("form.basicInformation.email.label")}</FormLabel>
                          <Button
                            type="button"
                            onClick={openEditEmailModal}
                            buttonType="underline"
                            className="heading-5 text-cream cursor-pointer underline hover:opacity-70 xl:hidden"
                          >
                            {t("button.change")}
                          </Button>
                        </div>
                        <div className="text-cream heading-5-20 pointer-events-auto flex flex-1 justify-between gap-2 rounded-md md:gap-4 xl:max-w-[634px]">
                          {userInfo?.email || methods.watch("email")}
                          <div className="hidden xl:block">
                            <Button
                              type="button"
                              onClick={openEditEmailModal}
                              buttonType="underline"
                              className="heading-5 text-cream cursor-pointer underline hover:opacity-70"
                            >
                              {t("button.change")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormControl
                      name="phone_number"
                      label={t("form.basicInformation.phone.label")}
                      placeholder={t("form.basicInformation.phone.placeholder")}
                      className="pointer-events-auto gap-2 rounded-md md:gap-4"
                      isPhone
                      isNumber
                      required
                      maxLength={20}
                      inputClassName="xl:max-w-[634px]"
                      showRequiredLabel={false}
                    />
                  </div>
                </div>

                {/* 会員プラン Section */}
                <div className="flex flex-col gap-4 md:gap-12">
                  <SectionHeader className="ml-6 md:ml-0" title={t("form.membershipPurpose.title")} />
                  <div className="bg-gray333 border-gradient-gold-not-rounded flex flex-col gap-6 p-6 md:rounded-[8px] md:py-12">
                    <div className="flex flex-col gap-2 md:gap-4 xl:flex-row">
                      <div className="min-w-[161px] flex-1">
                        <FormLabel className="w-full">{t("form.membershipPurpose.membershipPlan")}</FormLabel>
                      </div>
                      <div className="text-cream heading-5 pointer-events-auto w-full gap-2 rounded-md md:gap-4 xl:max-w-[634px]">
                        {planName[methods.watch("plan_type") as keyof typeof planName]}
                      </div>
                    </div>
                    <FormControl
                      name="purpose_of_joining"
                      label={t("form.membershipPurpose.instruction")}
                      placeholder={t("form.membershipPurpose.placeholderSp")}
                      className="pointer-events-auto gap-2 rounded-md md:gap-4"
                      required
                      maxLength={255}
                      inputClassName="xl:max-w-[634px]"
                      showRequiredLabel={false}
                    />
                  </div>
                </div>

                {/* 職歴 Section */}
                <div className="flex flex-col gap-4 md:gap-12">
                  <SectionHeader className="ml-6 md:ml-0" title={t("form.educationWorkHistory.title")} />
                  <div className="bg-gray333 border-gradient-gold-not-rounded flex flex-col gap-6 p-6 md:rounded-[8px] md:py-12">
                    {/* 小学校 */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:flex-1">
                        <div className="md:mt-2">
                          <FormLabel>{t("form.educationWorkHistory.elementarySchool.label")}</FormLabel>
                        </div>
                        <div className="flex-1 xl:max-w-[634px]">
                          <FormControl
                            type="search"
                            name="elementary_school"
                            label={t("form.educationWorkHistory.elementarySchool.label")}
                            placeholder={t("form.educationWorkHistory.elementarySchool.placeholder")}
                            onSearch={(searchTerm, page) => handleSearchSchool(SchoolType.SHOUGAKKOU, searchTerm, page)}
                            debounceMs={500}
                            initialLoad={true}
                            className="pointer-events-auto gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                            maxLength={255}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:flex-1">
                        <div className="md:mt-2">
                          <FormLabel>{t("form.educationWorkHistory.elementarySchool.graduationDate")}</FormLabel>
                        </div>
                        <div className="flex flex-1 gap-2 md:gap-4 xl:max-w-[634px]">
                          <FormControl
                            name="elementary_graduation_year"
                            type="select"
                            label={t("form.basicInformation.birthday.year")}
                            placeholder={t("form.basicInformation.birthday.year")}
                            options={elementaryDatePicker.yearOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                          />
                          <FormControl
                            name="elementary_graduation_month"
                            type="select"
                            label={t("form.basicInformation.birthday.month")}
                            placeholder={t("form.basicInformation.birthday.month")}
                            options={elementaryDatePicker.monthOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 中学校 */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:flex-1">
                        <div className="md:mt-2">
                          <FormLabel>{t("form.educationWorkHistory.juniorHighSchool.label")}</FormLabel>
                        </div>
                        <div className="flex-1 xl:max-w-[634px]">
                          <FormControl
                            type="search"
                            name="junior_high_school"
                            label={t("form.educationWorkHistory.juniorHighSchool.label")}
                            placeholder={t("form.educationWorkHistory.juniorHighSchool.placeholder")}
                            className="pointer-events-auto gap-4 rounded-md"
                            onSearch={(searchTerm, page) => handleSearchSchool(SchoolType.CHUUGAKKOU, searchTerm, page)}
                            debounceMs={500}
                            initialLoad={true}
                            isColumn
                            isShowLabel={false}
                            maxLength={255}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:flex-1">
                        <div className="md:mt-2">
                          <FormLabel>{t("form.educationWorkHistory.juniorHighSchool.graduationDate")}</FormLabel>
                        </div>
                        <div className="flex flex-1 gap-2 md:gap-4 xl:max-w-[634px]">
                          <FormControl
                            name="junior_high_graduation_year"
                            type="select"
                            label={t("form.basicInformation.birthday.year")}
                            placeholder={t("form.basicInformation.birthday.year")}
                            options={juniorHighDatePicker.yearOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                          />
                          <FormControl
                            name="junior_high_graduation_month"
                            type="select"
                            label={t("form.basicInformation.birthday.month")}
                            placeholder={t("form.basicInformation.birthday.month")}
                            options={juniorHighDatePicker.monthOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 高校 */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:flex-1">
                        <div className="md:mt-2">
                          <FormLabel>{t("form.educationWorkHistory.highSchool.label")}</FormLabel>
                        </div>
                        <div className="flex-1 xl:max-w-[634px]">
                          <FormControl
                            type="search"
                            name="high_school"
                            label={t("form.educationWorkHistory.highSchool.label")}
                            placeholder={t("form.educationWorkHistory.highSchool.placeholder")}
                            className="pointer-events-auto gap-4 rounded-md"
                            isShowLabel={false}
                            maxLength={255}
                            onSearch={handleSearchHighSchool}
                            debounceMs={500}
                            initialLoad={true}
                            isColumn
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:flex-1">
                        <div className="md:mt-2">
                          <FormLabel className="h-[39px]">{t("form.educationWorkHistory.highSchool.graduationDate")}</FormLabel>
                        </div>
                        <div className="flex flex-1 gap-2 md:gap-4 xl:max-w-[634px]">
                          <FormControl
                            name="high_school_graduation_year"
                            type="select"
                            label={t("form.basicInformation.birthday.year")}
                            placeholder={t("form.basicInformation.birthday.year")}
                            options={highSchoolDatePicker.yearOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                          />
                          <FormControl
                            name="high_school_graduation_month"
                            type="select"
                            label={t("form.basicInformation.birthday.month")}
                            placeholder={t("form.basicInformation.birthday.month")}
                            options={highSchoolDatePicker.monthOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 大学または専門学校 */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:flex-1">
                        <div className="md:mt-2">
                          <FormLabel>{t("form.educationWorkHistory.university.label")}</FormLabel>
                        </div>
                        <div className="flex-1 xl:max-w-[634px]">
                          <FormControl
                            type="search"
                            name="university"
                            label={t("form.educationWorkHistory.university.label")}
                            placeholder={t("form.educationWorkHistory.university.placeholder")}
                            onSearch={handleSearchUniversity}
                            debounceMs={500}
                            initialLoad={true}
                            className="pointer-events-auto gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                            maxLength={255}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:gap-4 lg:flex-1">
                        <div className="md:mt-2">
                          <FormLabel className="h-[39px]">{t("form.educationWorkHistory.university.graduationDate")}</FormLabel>
                        </div>
                        <div className="flex flex-1 gap-2 md:gap-4 xl:max-w-[634px]">
                          <FormControl
                            name="university_graduation_year"
                            type="select"
                            label={t("form.basicInformation.birthday.year")}
                            placeholder={t("form.basicInformation.birthday.year")}
                            options={universityDatePicker.yearOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                          />
                          <FormControl
                            name="university_graduation_month"
                            type="select"
                            label={t("form.basicInformation.birthday.month")}
                            placeholder={t("form.basicInformation.birthday.month")}
                            options={universityDatePicker.monthOptions}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isColumn
                            isShowLabel={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:gap-12">
                  <div>
                    <div className="flex flex-col gap-2 md:gap-4 xl:flex-row xl:items-end">
                      <SectionHeader className="ml-6 md:ml-0" title={t("form.workHistory.title")} />
                    </div>
                  </div>
                  <div className="bg-gray333 border-gradient-gold-not-rounded flex flex-col gap-6 p-6 md:gap-12 md:rounded-[8px] md:py-12">
                    {workHistoryItems.map((index, orderIndex) => (
                      <div key={index} className="relative">
                        <WorkHistoryItem
                          isEdit={true}
                          isBorderTop={orderIndex != 0}
                          index={index}
                          displayIndex={orderIndex + 1}
                          yearJoinedField={`work_history_${index}_year_joined`}
                          monthJoinedField={`work_history_${index}_month_joined`}
                          yearLeftedField={`work_history_${index}_year_lefted`}
                          monthLeftedField={`work_history_${index}_month_lefted`}
                          companyNameField={`work_history_${index}_company_name`}
                          positionField={`work_history_${index}_position`}
                          inServiceField={`work_history_${index}_in_service`}
                          removeWorkHistory={removeWorkHistory}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addWorkHistory}
                      className="text-cream text-1 pointer-events-auto w-fit cursor-pointer underline hover:opacity-70 md:ml-0"
                    >
                      {t("form.workHistory.addWorkHistoryMobile")}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:gap-12">
                  <div>
                    <SectionHeader className="ml-6 md:ml-0" title={t("form.profileInformation.title")} />
                  </div>
                  <div className="bg-gray333 border-gradient-gold-not-rounded flex flex-col gap-6 p-6 md:mb-16 md:rounded-[8px] md:py-12">
                    <div className="flex flex-col gap-2 md:gap-4">
                      <FormLabel className="hidden md:flex">{t("form.profileInformation.hobbies.label")}</FormLabel>
                      <FormLabel className="md:hidden">{t("form.profileInformation.hobbies.labelSp")}</FormLabel>
                      <div className="flex flex-col gap-2 md:gap-4 xl:flex-row">
                        <FormControl
                          name="hobbies_and_skills_1"
                          label={t("form.profileInformation.hobbies.label1")}
                          placeholder={t("form.profileInformation.hobbies.placeholder")}
                          className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                          isColumn
                          maxLength={255}
                          isShowLabel={false}
                        />
                        <FormControl
                          name="hobbies_and_skills_2"
                          label={t("form.profileInformation.hobbies.label2")}
                          placeholder={t("form.profileInformation.hobbies.placeholder")}
                          className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                          isColumn
                          maxLength={255}
                          isShowLabel={false}
                        />
                        <FormControl
                          name="hobbies_and_skills_3"
                          label={t("form.profileInformation.hobbies.label3")}
                          placeholder={t("form.profileInformation.hobbies.placeholder")}
                          className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                          isColumn
                          maxLength={255}
                          isShowLabel={false}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-4">
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center justify-between gap-2 md:justify-start md:gap-8">
                          <FormLabel>{t("form.profileInformation.allergies.label")}</FormLabel>
                          <div className="pointer-events-auto flex items-center gap-6 md:gap-4">
                            <FormControl
                              name="is_allergies_or_conditions_true"
                              label={t("form.profileInformation.allergies.yes")}
                              type="checkbox"
                              className="pointer-events-auto"
                              isShowLabel={true}
                              showRequiredLabel={false}
                            />
                            <FormControl
                              name="is_allergies_or_conditions_false"
                              label={t("form.profileInformation.allergies.no")}
                              type="checkbox"
                              className="pointer-events-auto"
                              isShowLabel={true}
                              showRequiredLabel={false}
                            />
                          </div>
                        </div>
                        {!!methods.formState.errors.is_allergies_or_conditions_true && !!methods.formState.errors.is_allergies_or_conditions_false && (
                          <ErrorMsg
                            message={tValidation("requiredCheckbox", { field: t("form.profileInformation.allergies.label") })}
                            name="is_allergies_or_conditions_true"
                          />
                        )}
                      </div>
                      {allergiesTrue && (
                        <div className="flex items-start gap-2 md:gap-4">
                          <FormLabel className="mt-3 md:mt-2.5">{t("form.profileInformation.allergies.content")}</FormLabel>
                          <FormControl
                            name="allergies_or_conditions"
                            label={t("form.profileInformation.allergies.content")}
                            placeholder={t("form.profileInformation.allergies.contentPlaceholder")}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            maxLength={255}
                            isShowLabel={false}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 md:gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-2 md:justify-start md:gap-8">
                          <FormLabel>{t("form.profileInformation.smoking.label")}</FormLabel>
                          <div className="pointer-events-auto flex items-center gap-6 md:gap-4">
                            <FormControl
                              name="is_smoking_preference_true"
                              label={t("form.profileInformation.smoking.yes")}
                              type="checkbox"
                              className="pointer-events-auto"
                              showRequiredLabel={false}
                              isShowLabel={true}
                            />
                            <FormControl
                              name="is_smoking_preference_false"
                              label={t("form.profileInformation.smoking.no")}
                              type="checkbox"
                              className="pointer-events-auto"
                              showRequiredLabel={false}
                              isShowLabel={true}
                            />
                          </div>
                        </div>
                        {!!methods.formState.errors.is_smoking_preference_true && !!methods.formState.errors.is_smoking_preference_false && (
                          <ErrorMsg
                            message={tValidation("requiredCheckbox", { field: t("form.profileInformation.smoking.label") })}
                            name="is_smoking_preference_true"
                          />
                        )}
                      </div>
                      {smokingTrue && (
                        <div className="flex items-start gap-2 md:gap-4">
                          <FormLabel className="mt-3 md:mt-2.5">{t("form.profileInformation.smoking.frequency")}</FormLabel>
                          <FormControl
                            name="smoking_preference"
                            label={t("form.profileInformation.smoking.frequency")}
                            placeholder={t("form.profileInformation.smoking.frequencyPlaceholder")}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            maxLength={255}
                            isShowLabel={false}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 md:gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-2 md:justify-start md:gap-8">
                          <FormLabel>{t("form.profileInformation.drinking.label")}</FormLabel>
                          <div className="pointer-events-auto flex items-center gap-6 md:gap-4">
                            <FormControl
                              name="is_drinking_alcohol_true"
                              label={t("form.profileInformation.drinking.yes")}
                              type="checkbox"
                              className="pointer-events-auto"
                              isShowLabel={true}
                              showRequiredLabel={false}
                            />
                            <FormControl
                              name="is_drinking_alcohol_false"
                              label={t("form.profileInformation.drinking.no")}
                              type="checkbox"
                              className="pointer-events-auto"
                              isShowLabel={true}
                              showRequiredLabel={false}
                            />
                          </div>
                        </div>
                        {!!methods.formState.errors.is_drinking_alcohol_true && !!methods.formState.errors.is_drinking_alcohol_false && (
                          <ErrorMsg
                            message={tValidation("requiredCheckbox", { field: t("form.profileInformation.drinking.label") })}
                            name="is_drinking_alcohol_true"
                          />
                        )}
                      </div>
                      {drinkingTrue && (
                        <div className="flex items-start gap-2 md:gap-4">
                          <FormLabel className="mt-3 md:mt-2.5">{t("form.profileInformation.drinking.frequency")}</FormLabel>
                          <FormControl
                            name="drinking_frequency"
                            label={t("form.profileInformation.drinking.frequency")}
                            placeholder={t("form.profileInformation.drinking.frequencyPlaceholder")}
                            className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                            isShowLabel={false}
                            maxLength={255}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </FormProvider>
        </div>

        <div className="bg-gray333 mt-8 flex h-fit flex-col gap-6 p-6 md:sticky md:top-[140px] md:mt-0 md:rounded-[8px] lg:min-w-[390px]">
          <Button
            type="submit"
            form="membership-information-form"
            buttonType="white"
            className="heading-5 pointer-events-auto h-14! w-full py-0!"
            isDisabled={isLoadingUpdateProfile}
          >
            {t("button.saveChanges")}
          </Button>
          {isCanUpgradePlan && (
            <Button
              type="button"
              onClick={() => router.push(PAGE.MEMBERSHIP_INFORMATION_UPGRADE_PLAN)}
              buttonType="white"
              tooltip={t("button.planChangeApplicationTooltip")}
              className="heading-5 pointer-events-auto h-14! w-full py-0!"
            >
              {t("button.planChangeApplication")}
            </Button>
          )}
          <Button type="button" onClick={handleLogout} buttonType="white" className="heading-5 pointer-events-auto hidden h-14! w-full py-0! md:block">
            {t("button.logout")}
          </Button>
          <Button
            type="button"
            isDisabled={profileData?.is_membership_cancellation}
            className="heading-5 pointer-events-auto h-14! w-full py-0!"
            onClick={openModal}
          >
            {profileData?.is_membership_cancellation ? t("button.canceledMembership") : t("button.cancelYourMembership")}
          </Button>
        </div>
      </div>
      <ConfirmDialog
        closeModal={closeModal}
        openModal={openModal}
        description={t("modal.cancelYourMembership.description")}
        onConfirm={handleCancelMembership}
        onCancel={closeModal}
        isOpen={isOpen}
        onClose={closeModal}
        cancelButtonType="outline"
        descriptionClassName="md:text-[30px] text-[20px]"
      />
      <EditEmailModal isOpen={isOpenEditEmailModal} onClose={closeEditEmailModal} onComplete={openCompleteModal} />
      <CompleteModal
        isOpen={isOpenCompleteModal}
        closeModal={closeCompleteModal}
        contentClassName="gap-6 md:gap-12 w-full sm:w-[513px]"
        containerClassName="p-6 md:p-12"
        title={t("emailChange.success.title")}
        description={t("emailChange.success.message")}
        titleClassName="text-[20px] md:text-[30px]"
        descriptionClassName="text-1"
      />
    </div>
  );
};

export default MembershipInfomation;
