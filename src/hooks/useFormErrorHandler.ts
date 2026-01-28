import { useCallback } from "react";
import { FieldErrors, UseFormReturn, Path } from "react-hook-form";

interface ErrorElementInfo {
  element: HTMLElement;
  fieldName: string;
  top: number;
}

interface UseFormErrorHandlerOptions<T> {
  selectFields?: Array<keyof T>;
  customErrorFields?: Array<string>;
  scrollDelay?: number;
  focusDelay?: number;
}

export const useFormErrorHandler = <T extends Record<string, unknown>>(methods: UseFormReturn<T>, options: UseFormErrorHandlerOptions<T> = {}) => {
  const { selectFields = [], customErrorFields = [], scrollDelay = 100, focusDelay = 400 } = options;

  const onError = useCallback(
    (errors: FieldErrors<T>) => {
      const errorKeys = Object.keys(errors) as Array<keyof T>;
      const allErrorKeys = [...errorKeys];
      customErrorFields.forEach((fieldName) => {
        if ((errors as Record<string, unknown>)[fieldName] && !allErrorKeys.includes(fieldName as keyof T)) {
          allErrorKeys.push(fieldName as keyof T);
        }
      });

      if (allErrorKeys.length === 0) return;

      setTimeout(() => {
        const errorMessages: ErrorElementInfo[] = [];

        customErrorFields.forEach((fieldName) => {
          const hasError = (errors as Record<string, unknown>)[fieldName];
          if (!hasError) return;

          const errorElement = document.querySelector(`p[data-field="${fieldName}"]`) as HTMLElement;
          if (errorElement) {
            const rect = errorElement.getBoundingClientRect();
            errorMessages.push({
              element: errorElement,
              fieldName,
              top: rect.top,
            });
          }
        });

        errorKeys.forEach((key) => {
          const fieldName = String(key);
          if (customErrorFields.includes(fieldName)) return;

          const errorElement = document.querySelector(`p[data-field="${fieldName}"]`) as HTMLElement;
          if (errorElement) {
            const rect = errorElement.getBoundingClientRect();
            errorMessages.push({
              element: errorElement,
              fieldName,
              top: rect.top,
            });
          }
        });

        errorMessages.sort((a, b) => a.top - b.top);

        const firstError = errorMessages[0];
        if (!firstError) {
          const firstErrorField = allErrorKeys[0];
          if (firstErrorField) {
            try {
              methods.setFocus(firstErrorField as Path<T>);
            } catch {
              const firstErrorElement = document.querySelector(`p[data-field="${String(firstErrorField)}"]`) as HTMLElement;
              if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }
          }
          return;
        }

        const fieldName = firstError.fieldName;
        const firstErrorField = fieldName as keyof T;
        const isSelectField = selectFields.includes(firstErrorField);
        const isCustomField = customErrorFields.includes(fieldName);

        const errorMessage = firstError.element;
        const container = errorMessage?.closest(".flex.flex-col");

        let inputElement: HTMLInputElement | HTMLTextAreaElement | null = null;

        if (isCustomField) {
          errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        if (isSelectField && container) {
          const selectInput = container.querySelector("input[readonly]");
          const selectContainer = selectInput?.parentElement as HTMLElement;

          if (selectContainer) {
            selectContainer.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
              selectContainer.click();
            }, focusDelay);
          }
          return;
        }

        if (container) {
          const inputWithName = container.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`) as
            | HTMLInputElement
            | HTMLTextAreaElement
            | null;
          const inputWithId = container.querySelector(`input[id="${fieldName}"], textarea[id="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
          const inputInContainer = container.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement | null;

          inputElement = inputWithName || inputWithId || inputInContainer;
        } else {
          inputElement =
            (document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | null) ||
            (document.querySelector(`input[id="${fieldName}"], textarea[id="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | null);
        }

        if (inputElement) {
          if (inputElement.disabled) {
            inputElement.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            inputElement.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
              if (inputElement && !inputElement.disabled) {
                requestAnimationFrame(() => {
                  if (inputElement && !inputElement.disabled) {
                    inputElement.focus();
                    if (inputElement.value && inputElement.setSelectionRange) {
                      const length = inputElement.value.length;
                      inputElement.setSelectionRange(length, length);
                    }

                    setTimeout(() => {
                      if (inputElement && document.activeElement !== inputElement && !inputElement.disabled) {
                        inputElement.focus();
                        if (inputElement.value && inputElement.setSelectionRange) {
                          inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
                        }
                      }
                    }, 100);
                  }
                });
              }
            }, focusDelay);
          }
        } else if (errorMessage) {
          errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => {
            try {
              methods.setFocus(firstErrorField as Path<T>);
            } catch {}
          }, focusDelay);
        } else {
          setTimeout(() => {
            try {
              methods.setFocus(firstErrorField as Path<T>);
            } catch {}
          }, focusDelay);
        }
      }, scrollDelay);
    },
    [methods, selectFields, customErrorFields, scrollDelay, focusDelay],
  );

  return onError;
};
