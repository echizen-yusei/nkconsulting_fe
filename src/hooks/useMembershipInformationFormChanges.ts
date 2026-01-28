import { useMemo } from "react";
import { useWatch, UseFormReturn } from "react-hook-form";
import { RegisterFormDataType } from "@/types/register";

type GetWorkHistoryFieldsFn = (index: number) => readonly string[];

interface UseFormChangesParams {
  methods: UseFormReturn<RegisterFormDataType>;
  initialFormData: Partial<RegisterFormDataType> | null;
  workHistoryItems: number[];
  initialWorkHistoryItems: number[];
  getWorkHistoryFields: GetWorkHistoryFieldsFn;
}

export const useMembershipInformationFormChanges = ({
  methods,
  initialFormData,
  workHistoryItems,
  initialWorkHistoryItems,
  getWorkHistoryFields,
}: UseFormChangesParams): boolean => {
  const allFormValues = useWatch({
    control: methods.control,
  });

  const hasFormChanges = useMemo(() => {
    if (!initialFormData) return false;

    if (workHistoryItems.length !== initialWorkHistoryItems.length) {
      return true;
    }

    const sortedCurrent = [...workHistoryItems].sort();
    const sortedInitial = [...initialWorkHistoryItems].sort();
    if (JSON.stringify(sortedCurrent) !== JSON.stringify(sortedInitial)) {
      return true;
    }

    const allFields = Object.keys(initialFormData) as Array<keyof RegisterFormDataType>;

    for (const field of allFields) {
      const initialValue = initialFormData[field];
      const currentValue = allFormValues[field as keyof typeof allFormValues];

      const normalizedInitial = initialValue === null || initialValue === undefined ? "" : String(initialValue).trim();
      const normalizedCurrent = currentValue === null || currentValue === undefined ? "" : String(currentValue).trim();

      if (normalizedInitial !== normalizedCurrent) {
        return true;
      }
    }

    for (const index of workHistoryItems) {
      const fields = getWorkHistoryFields(index);
      for (const field of fields) {
        const fieldKey = field as keyof RegisterFormDataType;
        const currentValue = allFormValues[fieldKey as keyof typeof allFormValues];
        const initialValue = initialFormData[fieldKey];

        const normalizedInitial = initialValue === null || initialValue === undefined ? "" : String(initialValue).trim();
        const normalizedCurrent = currentValue === null || currentValue === undefined ? "" : String(currentValue).trim();

        if (normalizedInitial !== normalizedCurrent) {
          return true;
        }
      }
    }

    return false;
  }, [initialFormData, allFormValues, workHistoryItems, initialWorkHistoryItems, getWorkHistoryFields]);

  return hasFormChanges;
};
