import { StaticImageData } from "next/image";
import { FieldErrors, FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";

// Base types
export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectApiResponse {
  data: Option[];
  hasMore: boolean;
  page?: number;
}

// Base interfaces cho form controls
export interface BaseFormControlInputProps {
  name: string;
  label: string;
}

export interface BaseFormControlStyleProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  heightInput?: string;
  isColumn?: boolean;
  isShowLabel?: boolean;
  isShowError?: boolean;
  showRequiredLabel?: boolean;
  isOutline?: boolean;
}

export interface BaseFormControlProps extends BaseFormControlInputProps {
  register: UseFormRegister<FieldValues>;
  rules: RegisterOptions;
  errors: FieldErrors<FieldValues>;
}

export interface BasePropsFormControl extends BaseFormControlProps, BaseFormControlStyleProps {}

// Component-specific interfaces
export interface FormControlProps extends BaseFormControlInputProps, BaseFormControlStyleProps {
  type?: string;
  isEmail?: boolean;
  isPassword?: boolean;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  isSelectRequired?: boolean;
  showPasswordToggle?: boolean;
  isPhone?: boolean;
  isNumber?: boolean;
  inputRef?: (element: HTMLInputElement | null) => void;
  options?: { label: string; value: string }[];
  onSearch?: (searchTerm: string, page: number) => Promise<SelectApiResponse>;
  debounceMs?: number;
  initialLoad?: boolean;
  isConfirmPassword?: boolean;
  isInvalidField?: boolean;
  isYearOld?: boolean;
  minMSg?: string;
  maxMSg?: string;
  inputMaxLength?: number;
  requiredMsg?: string;
  borderClassName?: string;
  mobileLabel?: string;
  desktopLabel?: string;
  showRequiredLabel?: boolean;
  isOutline?: boolean;
}

export interface SelectProps extends BaseFormControlStyleProps {
  name: string;
  label?: string;
  options?: Option[];
  required?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions;
  onSearch?: (searchTerm: string, page: number) => Promise<SelectApiResponse>;
  debounceMs?: number;
  initialLoad?: boolean;
  borderClassName?: string;
}

export interface CheckboxInputProps extends BaseFormControlProps, BaseFormControlStyleProps {}

export interface DefaultInputProps extends BaseFormControlProps, BaseFormControlStyleProps {
  type: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  isNumber?: boolean;
  isPhone?: boolean;
  inputMaxLength?: number;
  borderClassName?: string;
  mobileLabel?: string;
  desktopLabel?: string;
}

export interface SelectInputProps extends BaseFormControlProps, BaseFormControlStyleProps {
  options: { label: string; value: string; disabled?: boolean }[];
  borderClassName?: string;
  mobileLabel?: string;
  desktopLabel?: string;
}

export interface TextareaProps extends BaseFormControlProps, BaseFormControlStyleProps {
  borderClassName?: string;
  mobileLabel?: string;
  desktopLabel?: string;
}

export type TabOptionsType = {
  label: string;
  value: string;
  icon: StaticImageData;
  activeIcon?: StaticImageData;
};
