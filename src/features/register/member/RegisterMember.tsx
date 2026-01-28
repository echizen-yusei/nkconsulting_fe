"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { FormControl } from "@/components/atoms/FormField";
import Button from "@/components/atoms/Button/Button";
import SectionHeader from "@/components/atoms/SectionHeader";
import { useDatePicker } from "@/hooks/useDataPicker";
import FormLabel from "@/components/atoms/FormLabel";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import WorkHistoryItem from "@/components/molecules/WorkHistoryItem";
import useNavigation from "@/hooks/useNavigation";
import { PAGE } from "@/constants/page";
import { actionScrollToTop } from "@/libs";
import { RegisterFormDataType, SchoolType } from "@/types/register";
import { MemberFormSelectFields, MEMBERSHIP_PLANS_OPTIONS } from "@/constants";
import { useRegisterMember } from "@/services/register-member";
import { AxiosError } from "axios";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import {
  buildApiUrl,
  cleanArray,
  createSearchHandlerWithNoneOption,
  formatPhoneNumber,
  handleSearchSchool,
  onError,
  parseDate,
  resolveBoolean,
} from "@/libs/utils";
import LoadingSpinner from "@/components/atoms/Loading";
import useBlock from "@/hooks/useBlock";
import { useWorkHistory } from "@/hooks/useWorkHistoryValidation";
import ButtonUnderline from "@/components/atoms/ButtonUnderline/ButtonUnderline";
import ErrorMsg from "@/components/atoms/ErrorMsg";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import useAutoFocus from "@/hooks/useAutoFocus";
import { MembershipInformationFormData, membershipInformationSchema } from "@/schemas/membership-info";
import { zodResolver } from "@hookform/resolvers/zod";

type RegisterMemberPageProps = {
  isMobile: boolean;
};

const RegisterMemberPage = ({ isMobile: initialIsMobile }: RegisterMemberPageProps) => {
  const isMobile = useResponsiveScreen(initialIsMobile);
  const t = useTranslations("registerMemberPage");
  const tValidation = useTranslations("Validation");
  const { router } = useNavigation();
  // Birthday date picker
  const birthdayDatePicker = useDatePicker();

  // Graduation date pickers
  const elementaryDatePicker = useDatePicker();
  const juniorHighDatePicker = useDatePicker();
  const highSchoolDatePicker = useDatePicker();
  const universityDatePicker = useDatePicker();

  const methods = useForm<MembershipInformationFormData>({
    defaultValues: {
      year_of_birth: "",
      month_of_birth: "",
      day_of_birth: "",
      plan_type: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(membershipInformationSchema(t, tValidation, [])),
  });

  const { getWorkHistoryFields, workHistoryItems, removeWorkHistory, addWorkHistory } = useWorkHistory(methods);
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
      ...workHistoryFieldNames,
    ] as Array<keyof RegisterFormDataType>,
  });

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

  // Watch checkbox values for radio-like behavior
  const allergiesTrue = useWatch({ control: methods.control, name: "is_allergies_or_conditions_true" as keyof RegisterFormDataType }) as boolean;
  const allergiesFalse = useWatch({ control: methods.control, name: "is_allergies_or_conditions_false" as keyof RegisterFormDataType }) as boolean;
  const smokingTrue = useWatch({ control: methods.control, name: "is_smoking_preference_true" as keyof RegisterFormDataType }) as boolean;
  const smokingFalse = useWatch({ control: methods.control, name: "is_smoking_preference_false" as keyof RegisterFormDataType }) as boolean;
  const drinkingTrue = useWatch({ control: methods.control, name: "is_drinking_alcohol_true" as keyof RegisterFormDataType }) as boolean;
  const drinkingFalse = useWatch({ control: methods.control, name: "is_drinking_alcohol_false" as keyof RegisterFormDataType }) as boolean;
  const confirmAgreement = useWatch({ control: methods.control, name: "confirm_agreement" as keyof RegisterFormDataType }) as boolean;

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

  const { mutate, isPending } = useRegisterMember();
  const handleShowError = useErrorHandler();

  const selectFields: Array<keyof RegisterFormDataType> = useMemo(
    () => [...MemberFormSelectFields, ...workHistoryFieldNames.map((fieldName) => fieldName as keyof RegisterFormDataType)],
    [workHistoryFieldNames],
  );

  const onSubmit = useCallback(
    (data: MembershipInformationFormData) => {
      if (isPending) return;
      const user = {
        user: {
          email: data.email,
          member_information_attributes: {
            age: data.year_old,
            birthday: parseDate({ year: data.year_of_birth || "", month: data.month_of_birth || "", day: data.day_of_birth || "" }),
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

      mutate(user, {
        onSuccess: (res) => {
          const queryParams = buildApiUrl({
            user_id: res.data.user.uuid,
          });
          methods.reset();
          router.push(`${PAGE.PAYMENT}${queryParams}`);
        },
        onError: (err) => {
          handleShowError({ error: err as AxiosError<ErrorResponseData> });
        },
      });
    },
    [mutate, methods, router, handleShowError, workHistoryItems, isPending],
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

  const handleBackToLogin = useCallback(() => {
    router.push(PAGE.LOGIN);
  }, [router]);

  useEffect(() => {
    actionScrollToTop();
  }, []);

  const handleSearchHighSchool = useMemo(() => createSearchHandlerWithNoneOption(SchoolType.KOUKOU, t("form.educationWorkHistory.highSchool.none")), [t]);

  const handleSearchUniversity = useMemo(
    () => createSearchHandlerWithNoneOption(SchoolType.DAIGAKU_OR_SENMON, t("form.educationWorkHistory.university.none")),
    [t],
  );
  useAutoFocus();
  return (
    <div className="max-w-xxl mx-auto mt-[123px] px-6 md:px-12">
      {isPending && <LoadingSpinner />}
      <div className="mb-4 ml-0 hidden min-h-dvh flex-col justify-center sm:ml-4 md:mt-32 md:mb-16 md:ml-8 md:flex md:min-h-auto lg:mt-44 lg:ml-[162px]">
        <h1 className="heading-1 text-cream noto-serif-jp pointer-events-auto gap-4 md:text-left">
          {t.rich("title", {
            highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
          })}
        </h1>
        <Breadcrumb autoGenerate className="pointer-events-auto mt-6 md:mt-10" />
      </div>
      <FormProvider {...methods}>
        <div className="relative">
          <form
            className="md:bg-cream/20 mb-8 flex flex-col gap-8 rounded-md sm:relative md:mb-16 md:gap-12 md:px-4 md:py-8 md:backdrop-blur-xs lg:px-[114px] lg:py-16"
            onSubmit={handleFormSubmit}
          >
            <p className="text-cream text-1 pointer-events-auto hidden font-light md:block">{t("form.note")}</p>
            {/* 基本情報 Section */}
            <div className="flex flex-col gap-6 md:gap-8">
              <SectionHeader title={t("form.basicInformation.title")} />
              <div className="flex flex-col gap-2 md:gap-4">
                <FormControl
                  name="full_name"
                  label={t("form.basicInformation.name.label")}
                  placeholder={t("form.basicInformation.name.fullName")}
                  className="pointer-events-auto gap-2 rounded-md md:gap-4"
                  isColumn
                  required
                  maxLength={255}
                />
                <FormControl
                  name="full_name_kana"
                  label={t("form.basicInformation.name.label")}
                  placeholder={t("form.basicInformation.name.furigana")}
                  className="pointer-events-auto gap-2 rounded-md md:gap-4"
                  isShowLabel={false}
                  required
                  maxLength={255}
                />
              </div>
              <div className="flex flex-col gap-4">
                <FormLabel isRequired>{t("form.basicInformation.birthday.label")}</FormLabel>
                <div className="flex gap-2 md:gap-4">
                  <FormControl
                    name="year_of_birth"
                    type="select"
                    label={t("form.basicInformation.birthday.year")}
                    placeholder={t("form.basicInformation.birthday.year")}
                    options={birthdayDatePicker.yearOptions}
                    className="pointer-events-auto flex-1 gap-4 rounded-md"
                    isColumn
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
                    isColumn
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
                    isColumn
                    isShowLabel={false}
                    isSelectRequired
                  />
                </div>
              </div>
              <FormControl
                name="year_old"
                label={t("form.basicInformation.yearOld.label")}
                placeholder={t("form.basicInformation.yearOld.placeholder")}
                className="pointer-events-auto w-full gap-2 rounded-md md:w-[calc(100%/3-8px)] md:gap-4"
                isColumn
                isNumber
                isYearOld
                required
              />
              <div className="flex flex-col gap-2 md:gap-4">
                <FormLabel isRequired>{t("form.basicInformation.email.label")}</FormLabel>
                <p className="text-cream text-2 whitespace-pre-line md:whitespace-normal">{t("form.basicInformation.email.instruction")}</p>
                <FormControl
                  name="email"
                  label={t("form.basicInformation.email.label")}
                  placeholder={t("form.basicInformation.email.placeholder")}
                  className="pointer-events-auto gap-2 rounded-md md:gap-4"
                  isColumn
                  isInvalidField
                  isShowLabel={false}
                  required
                  maxLength={255}
                />
              </div>
              <FormControl
                name="phone_number"
                label={t("form.basicInformation.phone.label")}
                placeholder={t("form.basicInformation.phone.placeholder")}
                className="pointer-events-auto gap-2 rounded-md md:gap-4"
                isColumn
                isPhone
                isNumber
                required
                maxLength={20}
              />
            </div>

            {/* 会員プラン Section */}
            <div className="flex flex-col gap-6">
              <SectionHeader title={t("form.membershipPurpose.title")} />
              <FormControl
                type="select"
                name="plan_type"
                label={isMobile ? t("form.membershipPurpose.membershipPlanSp") : t("form.membershipPurpose.membershipPlan")}
                className="pointer-events-auto gap-2 rounded-md md:gap-4"
                isColumn
                options={MEMBERSHIP_PLANS_OPTIONS}
                requiredMsg={t("form.membershipPurpose.required")}
                isSelectRequired
              />
              <FormControl
                name="purpose_of_joining"
                label={t("form.membershipPurpose.instruction")}
                placeholder={t("form.membershipPurpose.placeholder")}
                className="pointer-events-auto gap-2 rounded-md md:gap-4"
                isColumn
                required
                maxLength={255}
              />
            </div>

            {/* 学歴・職歴 Section */}
            <div className="flex flex-col gap-6 md:gap-8">
              <SectionHeader title={t("form.educationWorkHistory.title")} />
              {/* 小学校 */}
              <div className="flex flex-col gap-4 md:gap-8 lg:flex-row">
                <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
                  <FormLabel>{t("form.educationWorkHistory.elementarySchool.label")}</FormLabel>
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
                <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
                  <FormLabel>{t("form.educationWorkHistory.elementarySchool.graduationDate")}</FormLabel>
                  <div className="flex gap-2 md:gap-4">
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
              <div className="flex flex-col gap-6 md:gap-8 lg:flex-row">
                <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
                  <FormLabel>{t("form.educationWorkHistory.juniorHighSchool.label")}</FormLabel>
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
                <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
                  <FormLabel>{t("form.educationWorkHistory.juniorHighSchool.graduationDate")}</FormLabel>
                  <div className="flex gap-2 md:gap-4">
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
              <div className="flex flex-col gap-6 md:gap-8 lg:flex-row">
                <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
                  <FormLabel>{t("form.educationWorkHistory.highSchool.label")}</FormLabel>
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
                <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
                  <FormLabel>{t("form.educationWorkHistory.highSchool.graduationDate")}</FormLabel>
                  <div className="flex gap-2 md:gap-4">
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
              <div className="flex flex-col gap-6 md:gap-8 lg:flex-row">
                <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
                  <FormLabel>{t("form.educationWorkHistory.university.label")}</FormLabel>
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
                <div className="flex flex-col gap-2 md:gap-4 lg:flex-1">
                  <FormLabel>{t("form.educationWorkHistory.university.graduationDate")}</FormLabel>
                  <div className="flex gap-2 md:gap-4">
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

            <div className="flex flex-col gap-4 md:gap-8">
              <div>
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-4">
                  <SectionHeader title={t("form.workHistory.title")} />
                  <p className="text-cream text-1 pointer-events-auto font-light">{t("form.workHistory.instruction")}</p>
                </div>
              </div>
              <div className="flex flex-col border-b md:gap-6 md:border-b-0 md:pb-0">
                {workHistoryItems.map((index, orderIndex) => (
                  <div key={index} className="relative">
                    <WorkHistoryItem
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
              </div>
              <button type="button" onClick={addWorkHistory} className="text-cream text-1 pointer-events-auto w-fit cursor-pointer underline hover:opacity-70">
                {isMobile ? t("form.workHistory.addWorkHistoryMobile") : t("form.workHistory.addWorkHistory")}
              </button>
            </div>
            <div className="flex flex-col gap-4 md:gap-8">
              <div>
                <SectionHeader title={t("form.profileInformation.title")} />
              </div>
              <div className="flex flex-col gap-4">
                <FormLabel>{t("form.profileInformation.hobbies.label")}</FormLabel>
                <div className="flex flex-col gap-4 md:flex-row">
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
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-2 md:justify-start md:gap-8">
                    <FormLabel>{t("form.profileInformation.allergies.label")}</FormLabel>
                    <div className="pointer-events-auto flex items-center gap-6 md:gap-4">
                      <FormControl
                        name="is_allergies_or_conditions_true"
                        label={t("form.profileInformation.allergies.yes")}
                        type="checkbox"
                        className="pointer-events-auto"
                      />
                      <FormControl
                        name="is_allergies_or_conditions_false"
                        label={t("form.profileInformation.allergies.no")}
                        type="checkbox"
                        className="pointer-events-auto"
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
                  <div className="flex items-start gap-2 md:gap-6">
                    <FormLabel className="mt-3 md:mt-2.5">{t("form.profileInformation.allergies.content")}</FormLabel>
                    <FormControl
                      name="allergies_or_conditions"
                      label={t("form.profileInformation.allergies.content")}
                      placeholder={
                        isMobile ? t("form.profileInformation.allergies.contentPlaceholderSp") : t("form.profileInformation.allergies.contentPlaceholder")
                      }
                      className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                      maxLength={255}
                      isShowLabel={false}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-2 md:justify-start md:gap-8">
                    <FormLabel>{t("form.profileInformation.smoking.label")}</FormLabel>
                    <div className="pointer-events-auto flex items-center gap-6 md:gap-4">
                      <FormControl
                        name="is_smoking_preference_true"
                        label={t("form.profileInformation.smoking.yes")}
                        type="checkbox"
                        className="pointer-events-auto"
                      />
                      <FormControl
                        name="is_smoking_preference_false"
                        label={t("form.profileInformation.smoking.no")}
                        type="checkbox"
                        className="pointer-events-auto"
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
                  <div className="flex items-start gap-2 md:gap-6">
                    <FormLabel className="mt-3 md:mt-2.5">{t("form.profileInformation.smoking.frequency")}</FormLabel>
                    <FormControl
                      name="smoking_preference"
                      label={t("form.profileInformation.smoking.frequency")}
                      placeholder={
                        isMobile ? t("form.profileInformation.smoking.frequencyPlaceholderSp") : t("form.profileInformation.smoking.frequencyPlaceholder")
                      }
                      className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                      maxLength={255}
                      isShowLabel={false}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-2 md:justify-start md:gap-8">
                    <FormLabel>{t("form.profileInformation.drinking.label")}</FormLabel>
                    <div className="pointer-events-auto flex items-center gap-6 md:gap-4">
                      <FormControl
                        name="is_drinking_alcohol_true"
                        label={t("form.profileInformation.drinking.yes")}
                        type="checkbox"
                        className="pointer-events-auto"
                      />
                      <FormControl
                        name="is_drinking_alcohol_false"
                        label={t("form.profileInformation.drinking.no")}
                        type="checkbox"
                        className="pointer-events-auto"
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
                  <div className="flex items-start gap-2 md:gap-6">
                    <FormLabel className="mt-3 md:mt-2.5">{t("form.profileInformation.drinking.frequency")}</FormLabel>
                    <FormControl
                      name="drinking_frequency"
                      label={t("form.profileInformation.drinking.frequency")}
                      placeholder={
                        isMobile ? t("form.profileInformation.drinking.frequencyPlaceholderSp") : t("form.profileInformation.drinking.frequencyPlaceholder")
                      }
                      className="pointer-events-auto flex-1 gap-2 rounded-md md:gap-4"
                      isShowLabel={false}
                      maxLength={255}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pointer-events-auto flex items-center justify-center gap-2">
              <FormControl name="confirm_agreement" label={""} type="checkbox" className="pointer-events-auto" required isShowLabel={true} />
              <div className="flex items-center">
                <ButtonUnderline href={PAGE.MEMBERSHIP_TERMS}>{t("form.membershipTerms")}</ButtonUnderline>
                <span className="text-cream text-1 pointer-events-auto font-light">・</span>
                <ButtonUnderline href={PAGE.PRIVACY}>{t("form.privacy")}</ButtonUnderline>
              </div>
            </div>
            <div className="pointer-events-auto flex w-full justify-center gap-4">
              <Button type="submit" isDisabled={!confirmAgreement} className="heading-5 w-full">
                {t("form.submit")}
              </Button>
            </div>
            <div className="pointer-events-auto w-full">
              <Button buttonType="outline" type="button" className="heading-5 pointer-events-auto w-full" onClick={handleBackToLogin}>
                {t("form.backToLogin")}
              </Button>
            </div>
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default RegisterMemberPage;
