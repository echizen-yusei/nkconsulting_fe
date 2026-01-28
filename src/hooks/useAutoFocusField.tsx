import { useEffect } from "react";

export const useAutoFocusField = (fieldId: string) => {
  useEffect(() => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.focus();
    }
  }, [fieldId]);
};
