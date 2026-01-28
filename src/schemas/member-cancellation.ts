import { TranslationsType } from "@/types/common";
import z from "zod";

export const memberCancellationSchema = (t: TranslationsType, tValidation: TranslationsType) =>
  z
    .object({
      infrequently: z.boolean(),
      little_demand: z.boolean(),
      different_expected: z.boolean(),
      not_cost_effective: z.boolean(),
      budgetary: z.boolean(),
      not_easy_to_use: z.boolean(),
      other: z.boolean(),
      other_reason: z.string().max(2000, tValidation("maxLength", { field: t("form.question1.detailLabel"), length: 2000 })),
      desired_services: z
        .string()
        .min(1, tValidation("required", { field: t("form.question2.label") }))
        .max(2000, tValidation("maxLength", { field: t("form.question2.label"), length: 2000 })),

      feedback: z
        .string()
        .min(1, tValidation("required", { field: t("form.question3.label") }))
        .max(2000, tValidation("maxLength", { field: t("form.question3.label"), length: 2000 })),
    })
    .superRefine((data, ctx) => {
      if (
        !(data.infrequently || data.little_demand || data.different_expected || data.not_cost_effective || data.budgetary || data.not_easy_to_use || data.other)
      ) {
        ctx.addIssue({
          path: ["reason_checkbox_group"],
          message: tValidation("requiredAtLeastOneReason"),
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.other && !data.other_reason.trim()) {
        ctx.addIssue({
          path: ["other_reason"],
          message: tValidation("specificReason"),
          code: z.ZodIssueCode.custom,
        });
      }
    });

export type MemberCancellationFormData = z.infer<ReturnType<typeof memberCancellationSchema>>;
