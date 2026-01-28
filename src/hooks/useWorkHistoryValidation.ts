import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormDataType } from "@/types/register";
import { MembershipInformationFormData } from "@/schemas/membership-info";

export const useWorkHistory = (methods: UseFormReturn<MembershipInformationFormData>) => {
  const [workHistoryItems, setWorkHistoryItems] = useState<number[]>([1]);

  const validateWorkHistory = useCallback((formValues: Partial<RegisterFormDataType>, workHistoryItems: number[]): boolean => {
    const validWorkHistories = workHistoryItems
      .map((index) => {
        const companyName = (formValues[`work_history_${index}_company_name` as keyof RegisterFormDataType] as string) || "";
        const position = (formValues[`work_history_${index}_position` as keyof RegisterFormDataType] as string) || "";
        const yearJoined = formValues[`work_history_${index}_year_joined` as keyof RegisterFormDataType] || "";
        const monthJoined = formValues[`work_history_${index}_month_joined` as keyof RegisterFormDataType] || "";

        const hasData = companyName.trim() !== "" && position.trim() !== "" && monthJoined !== "" && yearJoined !== "";
        return hasData;
      })
      .filter((hasData) => hasData);

    return validWorkHistories.length > 0;
  }, []);

  const createWorkHistoryValidator = useCallback(
    (workHistoryItems: number[], errorMessage: string) => {
      return (value: unknown, formValues: Partial<RegisterFormDataType>): string | boolean => {
        const isValid = validateWorkHistory(formValues, workHistoryItems);
        return isValid ? true : errorMessage;
      };
    },
    [validateWorkHistory],
  );

  const getWorkHistoryDefaultValues = useCallback((items: number[]) => {
    const workHistoryDefaults: Record<string, string> = {};
    items.forEach((index) => {
      workHistoryDefaults[`work_history_${index}_year_joined`] = "";
      workHistoryDefaults[`work_history_${index}_month_joined`] = "";
      workHistoryDefaults[`work_history_${index}_year_lefted`] = "";
      workHistoryDefaults[`work_history_${index}_month_lefted`] = "";
      workHistoryDefaults[`work_history_${index}_company_name`] = "";
      workHistoryDefaults[`work_history_${index}_position`] = "";
      workHistoryDefaults[`work_history_${index}_in_service`] = "";
    });
    return workHistoryDefaults;
  }, []);

  // Helper function to get all fields for a work history index
  const getWorkHistoryFields = useCallback((index: number) => {
    return [
      `work_history_${index}_year_joined`,
      `work_history_${index}_month_joined`,
      `work_history_${index}_year_lefted`,
      `work_history_${index}_month_lefted`,
      `work_history_${index}_company_name`,
      `work_history_${index}_position`,
      `work_history_${index}_in_service`,
    ] as const;
  }, []);

  const addWorkHistory = useCallback(() => {
    const nextIndex = workHistoryItems.length > 0 ? Math.max(...workHistoryItems) + 1 : 1;
    setWorkHistoryItems((prev) => [...prev, nextIndex]);

    const newItemDefaults = getWorkHistoryDefaultValues([nextIndex]);
    Object.entries(newItemDefaults).forEach(([field, value]) => {
      methods.setValue(field, value, { shouldValidate: false });
    });
  }, [workHistoryItems, methods, getWorkHistoryDefaultValues]);

  const removeWorkHistory = useCallback(
    (index: number) => {
      setWorkHistoryItems((prev) => prev.filter((item) => item !== index));

      // Clear form values for removed work history item
      const fields = getWorkHistoryFields(index);

      fields.forEach((field) => {
        methods.unregister(field);
        methods.setValue(field, "", { shouldValidate: false });
      });
    },
    [methods, getWorkHistoryFields],
  );

  return {
    validateWorkHistory,
    createWorkHistoryValidator,
    getWorkHistoryFields,
    addWorkHistory,
    removeWorkHistory,
    workHistoryItems,
    setWorkHistoryItems,
    getWorkHistoryDefaultValues,
  };
};
