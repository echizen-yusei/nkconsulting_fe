import { TranslationsType } from "@/types/common";
import z from "zod";
import { REGEX } from "@/constants/regex";

export const updateEmailSchema = (t: TranslationsType, tValidation: TranslationsType) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, tValidation("required", { field: t("newEmail.label") }))
      .max(255, tValidation("maxLength", { field: t("newEmail.label"), length: 255 }))
      .email(tValidation("email")),
  });

export const verifyOtpSchema = (t: TranslationsType, tValidation: TranslationsType) =>
  z.object({
    otp: z
      .string()
      .trim()
      .min(6, tValidation("lengthEqual", { field: t("otpLabel"), length: 6 }))
      .max(6, tValidation("maxLength", { field: t("otpLabel"), length: 6 })),
  });

export const membershipInformationSchema = (t: TranslationsType, tValidation: TranslationsType, workHistoryItems: number[] = []) =>
  z
    .object({
      full_name: z
        .string()
        .trim()
        .min(1, tValidation("required", { field: t("form.basicInformation.name.label") }))
        .max(255, tValidation("maxLength", { field: t("form.basicInformation.name.label"), length: 255 })),
      full_name_kana: z
        .string()
        .trim()
        .min(1, tValidation("required", { field: t("form.basicInformation.name.label") }))
        .max(255, tValidation("maxLength", { field: t("form.basicInformation.name.label"), length: 255 })),
      year_of_birth: z.string().min(1, tValidation("requiredSelect", { field: t("form.basicInformation.birthday.year") })),
      month_of_birth: z.string().min(1, tValidation("requiredSelect", { field: t("form.basicInformation.birthday.month") })),
      day_of_birth: z.string().min(1, tValidation("requiredSelect", { field: t("form.basicInformation.birthday.day") })),
      year_old: z
        .string()
        .min(1, tValidation("required", { field: t("form.basicInformation.yearOld.label") }))
        .refine(
          (value) => {
            const age = Number(value);
            return !isNaN(age) && age >= 0 && age <= 150;
          },
          { message: tValidation("yearOldRange") },
        ),
      email: z.string().min(1, tValidation("required", { field: t("form.basicInformation.email.label") })),
      phone_number: z
        .string()
        .trim()
        .min(1, tValidation("required", { field: t("form.basicInformation.phone.label") }))
        .max(20, tValidation("maxLength", { field: t("form.basicInformation.phone.label"), length: 20 }))
        .refine(
          (val) => {
            if (!val || val.length === 0) return true;
            return REGEX.PHONE.test(val);
          },
          {
            message: tValidation("invalidField", { field: t("form.basicInformation.phone.label") }),
          },
        ),

      // Membership Purpose
      plan_type: z.string().min(1, t("form.membershipPurpose.required")),
      purpose_of_joining: z
        .string()
        .trim()
        .min(1, tValidation("required", { field: t("form.membershipPurpose.instruction") }))
        .max(255, tValidation("maxLength", { field: t("form.membershipPurpose.instruction"), length: 255 })),

      // Education - Elementary School
      elementary_school: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.educationWorkHistory.elementarySchool.label"), length: 255 }))
        .optional(),
      elementary_graduation_year: z.string().optional(),
      elementary_graduation_month: z.string().optional(),

      // Education - Junior High School
      junior_high_school: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.educationWorkHistory.juniorHighSchool.label"), length: 255 }))
        .optional(),
      junior_high_graduation_year: z.string().optional(),
      junior_high_graduation_month: z.string().optional(),

      // Education - High School
      high_school: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.educationWorkHistory.highSchool.label"), length: 255 }))
        .optional(),
      high_school_graduation_year: z.string().optional(),
      high_school_graduation_month: z.string().optional(),

      // Education - University
      university: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.educationWorkHistory.university.label"), length: 255 }))
        .optional(),
      university_graduation_year: z.string().optional(),
      university_graduation_month: z.string().optional(),

      // Profile Information - Hobbies
      hobbies_and_skills_1: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.profileInformation.hobbies.label1"), length: 255 }))
        .optional(),
      hobbies_and_skills_2: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.profileInformation.hobbies.label2"), length: 255 }))
        .optional(),
      hobbies_and_skills_3: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.profileInformation.hobbies.label3"), length: 255 }))
        .optional(),

      // Profile Information - Allergies
      is_allergies_or_conditions_true: z.boolean().optional(),
      is_allergies_or_conditions_false: z.boolean().optional(),
      allergies_or_conditions: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.profileInformation.allergies.content"), length: 255 }))
        .optional(),

      // Profile Information - Smoking
      is_smoking_preference_true: z.boolean().optional(),
      is_smoking_preference_false: z.boolean().optional(),
      smoking_preference: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.profileInformation.smoking.frequency"), length: 255 }))
        .optional(),

      // Profile Information - Drinking
      is_drinking_alcohol_true: z.boolean().optional(),
      is_drinking_alcohol_false: z.boolean().optional(),
      drinking_frequency: z
        .string()
        .max(255, tValidation("maxLength", { field: t("form.profileInformation.drinking.frequency"), length: 255 }))
        .optional(),

      // Additional fields for type compatibility
      name: z.string().optional(),
      confirm_agreement: z.boolean().optional(),
    })
    .passthrough()
    .superRefine((data, ctx) => {
      const graduationFieldPairs = [
        { year: "elementary_graduation_year", month: "elementary_graduation_month" },
        { year: "junior_high_graduation_year", month: "junior_high_graduation_month" },
        { year: "high_school_graduation_year", month: "high_school_graduation_month" },
        { year: "university_graduation_year", month: "university_graduation_month" },
      ];

      graduationFieldPairs.forEach(({ year: yearField, month: monthField }) => {
        const year = (data as Record<string, unknown>)[yearField] as string;
        const month = (data as Record<string, unknown>)[monthField] as string;

        if (!year && month) {
          ctx.addIssue({
            path: [yearField],
            message: tValidation("requiredSelect", { field: t("form.basicInformation.birthday.year") }),
            code: z.ZodIssueCode.custom,
          });
        }
        if (!month && year) {
          ctx.addIssue({
            path: [monthField],
            message: tValidation("requiredSelect", { field: t("form.basicInformation.birthday.month") }),
            code: z.ZodIssueCode.custom,
          });
        }
      });

      workHistoryItems.forEach((index) => {
        const companyName = (data as Record<string, unknown>)[`work_history_${index}_company_name`] as string;
        const position = (data as Record<string, unknown>)[`work_history_${index}_position`] as string;
        const yearJoined = (data as Record<string, unknown>)[`work_history_${index}_year_joined`] as string;
        const monthJoined = (data as Record<string, unknown>)[`work_history_${index}_month_joined`] as string;
        const yearLefted = (data as Record<string, unknown>)[`work_history_${index}_year_lefted`] as string;
        const monthLefted = (data as Record<string, unknown>)[`work_history_${index}_month_lefted`] as string;
        const inService = (data as Record<string, unknown>)[`work_history_${index}_in_service`] as string;

        const hasAnyData = companyName?.trim() || position?.trim() || yearJoined || monthJoined || yearLefted || monthLefted;

        if (hasAnyData) {
          if (!yearJoined && monthJoined) {
            ctx.addIssue({
              path: [`work_history_${index}_year_joined`],
              message: tValidation("requiredSelect", { field: t("form.basicInformation.birthday.year") }),
              code: z.ZodIssueCode.custom,
            });
          }

          if (!monthJoined && yearJoined) {
            ctx.addIssue({
              path: [`work_history_${index}_month_joined`],
              message: tValidation("requiredSelect", { field: t("form.basicInformation.birthday.month") }),
              code: z.ZodIssueCode.custom,
            });
          }

          if (inService !== "true" && (!yearLefted || !monthLefted)) {
            if (!yearLefted && monthLefted) {
              ctx.addIssue({
                path: [`work_history_${index}_year_lefted`],
                message: tValidation("requiredSelect", { field: t("form.basicInformation.birthday.year") }),
                code: z.ZodIssueCode.custom,
              });
            }
            if (!monthLefted && yearLefted) {
              ctx.addIssue({
                path: [`work_history_${index}_month_lefted`],
                message: tValidation("requiredSelect", { field: t("form.basicInformation.birthday.month") }),
                code: z.ZodIssueCode.custom,
              });
            }
          }
          if ((!yearJoined || !monthJoined) && (yearLefted || monthLefted)) {
            ctx.addIssue({
              path: [`work_history_${index}_year_joined`],
              message: tValidation("requiredSelect", { field: t("form.basicInformation.birthday.year") }),
              code: z.ZodIssueCode.custom,
            });
            ctx.addIssue({
              path: [`work_history_${index}_month_joined`],
              message: tValidation("requiredSelect", { field: t("form.basicInformation.birthday.month") }),
              code: z.ZodIssueCode.custom,
            });
          }
        }
      });
    });

export type UpdateEmailFormData = z.infer<ReturnType<typeof updateEmailSchema>>;
export type VerifyOtpFormData = z.infer<ReturnType<typeof verifyOtpSchema>>;
export type MembershipInformationFormData = z.infer<ReturnType<typeof membershipInformationSchema>>;
