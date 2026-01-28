import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { planIsAllowLoungeReservation } from "@/constants";
import { RegisterFormDataType, SchoolType } from "@/types/register";
import { UseFormReturn } from "react-hook-form";
import { getSchoolApi } from "@/services/register-member";
import { MembershipInformationFormData } from "@/schemas/membership-info";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const validateNumberInput = (
  input: string,
  options: {
    numberAfterDot?: number;
    minValue?: number;
    maxValue?: number;
  } = {},
) => {
  const { numberAfterDot = 3, minValue = -Infinity, maxValue = Infinity } = options;

  const cleanedInput = input.replace(/,/g, "").trim();

  const numberRegex = new RegExp(`^-?\\d+(\\.\\d{0,${numberAfterDot}})?$`);
  if (!numberRegex.test(cleanedInput)) return false;

  const numericValue = Number(cleanedInput);
  return numericValue >= minValue && numericValue <= maxValue;
};

export const handleInputEvent = (
  event: React.KeyboardEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>,
  options?: Parameters<typeof validateNumberInput>[1],
) => {
  const input = event.target as HTMLInputElement;
  const currentValue = input.value;
  const selectionStart = input.selectionStart || 0;
  const selectionEnd = input.selectionEnd || 0;

  if (event.type === "paste") {
    const pasteEvent = event as React.ClipboardEvent<HTMLInputElement>;
    const pastedText = pasteEvent.clipboardData.getData("text/plain").replace(/,/g, "");

    const newValue = currentValue.slice(0, selectionStart) + pastedText + currentValue.slice(selectionEnd);

    if (!validateNumberInput(newValue, options)) {
      pasteEvent.preventDefault();
    }
    return;
  }

  const keyEvent = event as React.KeyboardEvent<HTMLInputElement>;
  const key = keyEvent.key;

  if (key === ",") {
    keyEvent.preventDefault();
    return;
  }

  const controlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  const modifierKeys = keyEvent.ctrlKey || keyEvent.metaKey;

  if (controlKeys.indexOf(key) !== -1 || (modifierKeys && ["a", "c", "v", "x"].indexOf(key.toLowerCase()) !== -1)) {
    return;
  }
  if (key === "." && !options?.numberAfterDot) {
    keyEvent.preventDefault();
    return;
  }
  const newValue = currentValue.slice(0, selectionStart) + key + currentValue.slice(selectionEnd);

  if (!validateNumberInput(newValue, options)) {
    keyEvent.preventDefault();
  }
};

export function parseDate({ year, month, day }: { year: string; month: string; day: string }) {
  if (!year || !month || !day) return "";
  return dayjs(`${year}-${month}-${day}`).format("YYYY/MM/DD");
}

const ENCODE_PARAM = ["keyword"];

export const removeUndefinedValueInObject = (data: Record<string, string | number | boolean>) => {
  const newData = { ...data };

  Object.keys(newData).forEach((key) => {
    if (newData[key] === undefined) {
      delete newData[key];
    }
  });

  return newData;
};

export const buildApiUrl = (params: Record<string, string | number | boolean>): string => {
  let url = "";

  if (params && Object.keys(params).length > 0) {
    const newParams = removeUndefinedValueInObject(params);

    Object.keys(newParams).forEach((key, i) => {
      const prefix = i === 0 ? `?` : `&`;
      url += `${prefix}${key}=${ENCODE_PARAM.includes(key) ? encodeURIComponent(newParams[key]) : newParams[key]}`;
    });
  }
  return url;
};

export const formatPhoneNumber = (phone: string | undefined | null): string => {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");

  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
};

export const isEmpty = (data: [] | string | object | undefined): boolean => {
  if (data === undefined || data === null) return true;

  if (Array.isArray(data) || typeof data === "string") {
    return data.length === 0;
  }

  if (typeof data === "object" && data !== null) {
    return Object.keys(data).length === 0;
  }

  return true;
};

// Convert react-datepicker format to dayjs format
export const getDayjsFormat = (dateFormat: string): string => {
  return dateFormat.replace(/yyyy/g, "YYYY").replace(/dd/g, "DD").replace(/d/g, "D").replace(/MM/g, "MM").replace(/M/g, "M");
};

// Convert string value from react-hook-form to Date
export const getDateFromValue = (val: string | undefined, format: string): Date | null => {
  if (!val || val === "") return null;
  const dayjsFormat = getDayjsFormat(format);
  const date = dayjs(val, dayjsFormat).toDate();
  return isNaN(date.getTime()) ? null : date;
};

// Convert Date to string for react-hook-form
export const formatDateToString = (date: Date | null, format: string): string => {
  if (!date) return "";
  const dayjsFormat = getDayjsFormat(format);
  return dayjs(date).format(dayjsFormat);
};

export const isPlanAllowLoungeReservation = (planType: string): boolean => planIsAllowLoungeReservation.includes(planType);

export const convertHtmlToText = (html?: string) => {
  if (!html) return "";

  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<\/strong>/gi, "\n");
  html = html.replace(/<\/h1>/gi, "\n");
  html = html.replace(/<\/h2>/gi, "\n");
  html = html.replace(/<\/div>/gi, "\n");
  html = html.replace(/<\/li>/gi, "\n");
  html = html.replace(/<li>/gi, "  -  ");
  html = html.replace(/<\/ul>/gi, "\n");
  html = html.replace(/<\/p>/gi, "\n");
  html = html.replace(/<br\s*[/]?>/gi, "\n");
  html = html.replace(/<[^>]+>/gi, "");
  html = html.replace(/&nbsp;/gi, " ");

  return html;
};

export const isAfterCurrentTime = (date: string): boolean => {
  return dayjs(date).isAfter(dayjs());
};

export const parseDateString = (dateString: string | undefined) => {
  if (!dateString) return { year: "", month: "", day: "" };
  const date = dayjs(dateString);
  if (!date.isValid()) return { year: "", month: "", day: "" };
  return {
    year: date.format("YYYY"),
    month: date.format("MM"),
    day: date.format("DD"),
  };
};

export const toNumberString = (value: string | number) => {
  if (!value) return "";
  return Number(value).toString();
};

export const mergeList = <T extends { id: number }>(prev: T[], next: T[]) => {
  const map = new Map(prev.map((item) => [item.id, item]));

  next.forEach((item) => {
    map.set(item.id, item);
  });

  return Array.from(map.values());
};

export const buildApiUrlWithParams = (baseUrl: string, params: Record<string, string | number | boolean>) => {
  if (params && Object.keys(params).length > 0) {
    const cleaned = removeUndefinedValueInObject(params);
    const searchParams = new URLSearchParams();

    Object.entries(cleaned).forEach(([key, value]) => {
      const encodedValue = ENCODE_PARAM.includes(key) ? encodeURIComponent(String(value)) : String(value);

      searchParams.append(key, encodedValue);
    });

    const connector = baseUrl.includes("?") ? "&" : "?";
    const query = searchParams.toString();

    return query ? `${baseUrl}${connector}${query}` : baseUrl;
  }
  return baseUrl;
};

export const formatDate = (date: string, format: string = "YYYY年MM月DD日") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

export const formatCurrency = (value: number, style?: "currency" | "decimal") => {
  return new Intl.NumberFormat("ja-JP", { currency: "JPY", style }).format(value);
};

export const formatCurrencyWithUnit = ({ value, unit = "/年", style }: { value: number; unit?: string; style?: "currency" | "decimal" }) => {
  return `${formatCurrency(value, style)}${unit}`;
};

export const onError = (
  errors: Record<string, { message?: string }>,
  methods: UseFormReturn<MembershipInformationFormData>,
  selectFields: Array<keyof MembershipInformationFormData>,
) => {
  const errorKeys = Object.keys(errors) as Array<keyof RegisterFormDataType>;
  if (errorKeys.length === 0) return;

  setTimeout(() => {
    const errorMessages: Array<{ element: HTMLElement; fieldName: string; top: number }> = [];

    errorKeys.forEach((key) => {
      const fieldName = String(key);
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
      const firstErrorField = errorKeys[0];
      methods.setFocus(firstErrorField);
      return;
    }

    const fieldName = firstError.fieldName;
    const firstErrorField = fieldName as keyof RegisterFormDataType;
    const isSelectField = selectFields.includes(firstErrorField);

    const errorMessage = firstError.element;
    const container = errorMessage?.closest(".flex.flex-col");

    let inputElement: HTMLInputElement | HTMLTextAreaElement | null = null;

    if (container) {
      if (isSelectField) {
        const selectInput = container.querySelector("input[readonly]");
        const selectContainer = selectInput?.parentElement as HTMLElement;

        if (selectContainer) {
          selectContainer.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => {
            selectContainer.click();
          }, 400);
        }
      } else {
        const inputWithName = container.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;
        const inputWithId = container.querySelector(`input[id="${fieldName}"], textarea[id="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
        const inputInContainer = container.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement | null;

        inputElement = inputWithName || inputWithId || inputInContainer;
      }
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
        }, 400);
      }
    } else if (errorMessage) {
      errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        methods.setFocus(firstErrorField);
      }, 400);
    } else {
      setTimeout(() => {
        methods.setFocus(firstErrorField);
      }, 400);
    }
  }, 100);
};

export const handleSearchSchool = async (type: SchoolType, searchTerm: string, page: number) => {
  const res = await getSchoolApi({ type, name: searchTerm, page, per_page: 50 });
  return {
    data: [
      ...res.data.school_masters.map((item) => ({
        label: item.name,
        value: item.name,
      })),
    ],
    hasMore: res.data.pagination.current_page < res.data.pagination.total_pages,
  };
};

export const createSearchHandlerWithNoneOption = (type: SchoolType, noneLabel: string) => {
  return async (searchTerm: string, page: number) => {
    const schoolData = await handleSearchSchool(type, searchTerm, page);
    if (page === 1) {
      return {
        data: [{ label: noneLabel, value: "none" }, ...schoolData.data],
        hasMore: schoolData.hasMore,
      };
    }
    return schoolData;
  };
};

export function cleanArray<T>(array: T[]): T[] | undefined {
  if (isEmpty(array)) return undefined;
  return array;
}

export const resolveBoolean = (isTrue?: boolean, isFalse?: boolean): boolean | null => {
  if (isTrue && !isFalse) return true;
  if (!isTrue && isFalse) return false;
  return null;
};
