import { useCallback } from "react";
import { RegisterFormDataType, SchoolType } from "@/types/register";
import { User } from "@/types/membership-infomation";
import { parseDateString, toNumberString } from "@/libs/utils";

type WorkHistoryDefaultValuesFn = (items: number[]) => Record<string, string>;

export const useMembershipInfo = (getWorkHistoryDefaultValues: WorkHistoryDefaultValuesFn) => {
  const mapProfileToFormData = useCallback(
    (user: User | undefined): { formData: Partial<RegisterFormDataType>; workHistoryIndices: number[] } => {
      if (!user) {
        return { formData: {}, workHistoryIndices: [1] };
      }

      const birthday = parseDateString(user.birthday);

      const schoolMasters = user.school_masters;
      let careerHistories: Array<{ name: string; education_level: string; target_date: string }> | undefined;

      if (Array.isArray(schoolMasters)) {
        careerHistories = schoolMasters as Array<{ name: string; education_level: string; target_date: string }>;
      } else if (schoolMasters && typeof schoolMasters === "object") {
        const values = Object.values(schoolMasters);
        if (values.length > 0 && typeof values[0] === "object" && values[0] !== null) {
          careerHistories = values as Array<{ name: string; education_level: string; target_date: string }>;
        }
      }

      const elementary = careerHistories?.find((c) => c.education_level === SchoolType.SHOUGAKKOU);
      const juniorHigh = careerHistories?.find((c) => c.education_level === SchoolType.CHUUGAKKOU);
      const highSchool = careerHistories?.find((c) => c.education_level === SchoolType.KOUKOU);
      const university = careerHistories?.find((c) => c.education_level === SchoolType.DAIGAKU_OR_SENMON);

      const elementaryDate = parseDateString(elementary?.target_date);
      const juniorHighDate = parseDateString(juniorHigh?.target_date);
      const highSchoolDate = parseDateString(highSchool?.target_date);
      const universityDate = parseDateString(university?.target_date);

      const companyHistories = user.company_histories || [];
      const workHistoryDefaults: Record<string, string> = {};
      const workHistoryIndices: number[] = [];

      companyHistories.forEach((history, index) => {
        const workIndex = index + 1;
        workHistoryIndices.push(workIndex);
        const startDate = parseDateString(history.start_date);
        const endDate = parseDateString(history.end_date);
        workHistoryDefaults[`work_history_${workIndex}_year_joined`] = startDate.year;
        workHistoryDefaults[`work_history_${workIndex}_month_joined`] = toNumberString(startDate.month);
        workHistoryDefaults[`work_history_${workIndex}_year_lefted`] = history.is_current_company ? "" : endDate.year;
        workHistoryDefaults[`work_history_${workIndex}_month_lefted`] = toNumberString(endDate.month);
        workHistoryDefaults[`work_history_${workIndex}_company_name`] = history.company_name || "";
        workHistoryDefaults[`work_history_${workIndex}_position`] = history.position || "";
        workHistoryDefaults[`work_history_${workIndex}_in_service`] = history.is_current_company ? "true" : "";
      });

      const finalIndices = workHistoryIndices.length > 0 ? Array.from({ length: Math.max(workHistoryIndices.length, 1) }, (_, i) => i + 1) : [1];

      return {
        formData: {
          email: user.email || "",
          phone_number: user.phone_number || "",
          full_name: user.full_name || "",
          full_name_kana: user.full_name_kana || "",
          year_of_birth: birthday.year,
          month_of_birth: toNumberString(birthday.month),
          day_of_birth: toNumberString(birthday.day),
          year_old: user.age?.toString() || "",
          purpose_of_joining: user.purpose_of_joining || "",
          plan_type: user.plan_type || "",
          elementary_school: elementary?.name || "",
          elementary_graduation_year: elementaryDate.year,
          elementary_graduation_month: toNumberString(elementaryDate.month),
          junior_high_school: juniorHigh?.name || "",
          junior_high_graduation_year: juniorHighDate.year,
          junior_high_graduation_month: toNumberString(juniorHighDate.month),
          high_school: highSchool?.name,
          high_school_graduation_year: highSchoolDate.year,
          high_school_graduation_month: toNumberString(highSchoolDate.month),
          university: university?.name,
          university_graduation_year: universityDate.year,
          university_graduation_month: toNumberString(universityDate.month),
          hobbies_and_skills_1: user.hobbies_and_skill_1 || "",
          hobbies_and_skills_2: user.hobbies_and_skill_2 || "",
          hobbies_and_skills_3: user.hobbies_and_skill_3 || "",
          allergies_or_conditions: user.allergies_or_conditions || "",
          smoking_preference: user.smoking_preference || "",
          drinking_frequency: user.drinking_frequency || "",
          is_allergies_or_conditions_true: user.is_allergies_or_conditions === true,
          is_allergies_or_conditions_false: user.is_allergies_or_conditions === false,
          is_smoking_preference_true: user.is_smoking_preference === true,
          is_smoking_preference_false: user.is_smoking_preference === false,
          is_drinking_alcohol_true: user.is_drinking_alcohol === true,
          is_drinking_alcohol_false: user.is_drinking_alcohol === false,
          work_history_validation: "",
          ...getWorkHistoryDefaultValues(finalIndices),
          ...workHistoryDefaults,
        },
        workHistoryIndices: finalIndices,
      };
    },
    [getWorkHistoryDefaultValues],
  );

  return {
    mapProfileToFormData,
    parseDateString,
  };
};
