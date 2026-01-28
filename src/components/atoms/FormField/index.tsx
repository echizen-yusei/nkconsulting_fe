"use client";

import { RegisterOptions, useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import React from "react";
import { REGEX } from "@/constants/regex";
import FormLabel from "../FormLabel";
import { cn } from "@/libs/utils";
import { ChevronDownIcon } from "lucide-react";
import { CheckboxInputProps, DefaultInputProps, FormControlProps, Option, SelectInputProps, TextareaProps } from "@/types/components";
import { ErrorMessage } from "../ErrorMessage";
import Select from "../Select";
import { useDropdownPosition } from "@/hooks/useDropdownPosition";
import { SearchInput } from "../SearchInput";
import Checkbox from "../Checkbox";

const CheckboxInput = ({ name, label, className, register, rules, errors }: CheckboxInputProps) => {
  const { setValue, watch } = useFormContext();
  const value = watch(name);
  const checked = value === true || value === "true" || value === 1 || value === "1";

  const handleCheckedChange = (checked: boolean) => {
    setValue(name, checked, { shouldValidate: false, shouldDirty: false });
  };

  React.useEffect(() => {
    register(name, rules);
  }, [name, register, rules]);

  return (
    <div className={cn("flex items-center", className)}>
      <div className="w-full">
        <div className="flex items-center gap-2">
          <Checkbox id={name} checked={checked} onCheckedChange={handleCheckedChange} aria-invalid={!!errors[name]} disabled={rules.disabled as boolean} />
          {label && (
            <label
              htmlFor={name}
              className={cn("text-1 text-cream cursor-pointer select-none")}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!rules.disabled) {
                  handleCheckedChange(!checked);
                }
              }}
            >
              {label}
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

const DefaultInput = ({
  name,
  label,
  type,
  placeholder,
  className,
  inputClassName,
  register,
  rules,
  errors,
  showPassword,
  onTogglePassword,
  heightInput,
  isColumn = false,
  isShowLabel = true,
  isShowError = true,
  isNumber = false,
  isPhone = false,
  inputMaxLength,
  borderClassName,
  mobileLabel,
  desktopLabel,
  showRequiredLabel = true,
  isOutline = false,
}: DefaultInputProps) => {
  const { setValue } = useFormContext();
  const { onChange, ...registerProps } = register(name, rules);
  const regex = isPhone ? REGEX.NUMBER_ONLY_WITH_HYPHEN : REGEX.NUMBER_ONLY;
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumber) {
      const input = event.target;
      const filteredValue = input.value.replace(regex, "");
      input.value = filteredValue;
      setValue(name, filteredValue, { shouldValidate: false });
    } else {
      onChange(event);
    }
  };

  return (
    <div className={cn("flex gap-2", isColumn ? "flex-col" : "flex-col xl:flex-row xl:items-start xl:justify-between", className)}>
      {isShowLabel && (
        <FormLabel
          className={cn("shrink-0", isColumn ? "" : "xl:mt-2")}
          showRequiredLabel={showRequiredLabel}
          isRequired={!!rules.required}
          mobileText={mobileLabel}
          desktopText={desktopLabel}
        >
          {label}
        </FormLabel>
      )}
      <div className={`w-full ${inputClassName ?? ""}`}>
        <div className="relative w-full">
          <input
            {...registerProps}
            id={name}
            type={type}
            placeholder={placeholder}
            className={cn(
              "text-1 bg-cream text-primary placeholder-gray-medium relative block h-full w-full appearance-none p-3 focus:z-10 focus:outline-none sm:p-4",
              onTogglePassword && "pr-10",
              heightInput,
              borderClassName ?? "rounded-[8px]",
              !!errors[name] ? "border-red-light border-2" : isOutline ? borderClassName : "border-none",
            )}
            maxLength={inputMaxLength}
            onChange={handleInputChange}
          />
          {onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-0 z-20 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-500"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
        {isShowError && <ErrorMessage errors={errors} name={name} />}
      </div>
    </div>
  );
};

export const FormControl = ({
  name,
  label,
  type = "text",
  placeholder,
  className,
  inputClassName,
  isEmail,
  isPassword,
  minLength,
  maxLength,
  required = false,
  showPasswordToggle = true,
  isPhone,
  heightInput,
  isColumn = false,
  isShowLabel = true,
  options,
  isShowError = true,
  isNumber = false,
  onSearch,
  debounceMs,
  initialLoad,
  isConfirmPassword = false,
  isInvalidField = false,
  isYearOld = false,
  isSelectRequired = false,
  minMSg,
  maxMSg,
  inputMaxLength,
  requiredMsg,
  borderClassName,
  desktopLabel,
  mobileLabel,
  showRequiredLabel = true,
  isOutline = false,
}: FormControlProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const t = useTranslations("Validation");
  const [showPassword, setShowPassword] = React.useState(false);

  const getRules = () => {
    const rules: RegisterOptions = {};

    if (required || isSelectRequired) {
      rules.required = requiredMsg ? requiredMsg : isSelectRequired ? t("requiredSelect", { field: label }) : t("required", { field: label });
      if (!isEmail && !isPhone && type !== "checkbox") {
        rules.validate = {
          notOnlyWhitespace: (value: string) => {
            if (value && value.trimStart().length === 0) {
              return isSelectRequired ? t("requiredSelect", { field: label }) : t("required", { field: label });
            }
            return true;
          },
        };
      }
    }

    if (isEmail) {
      rules.pattern = {
        value: REGEX.EMAIL,
        message: t("email"),
      };
      rules.setValueAs = (value: string) => value?.trimEnd();
    }

    if (isPassword) {
      rules.pattern = {
        value: REGEX.PASSWORD,
        message: t("password"),
      };
    }

    if (minLength) {
      rules.minLength = {
        value: minLength,
        message: minMSg || t("minLength", { field: label, length: minLength }),
      };
      rules.setValueAs = (value: string) => value?.trim();
    }

    if (maxLength) {
      rules.maxLength = {
        value: maxLength,
        message: maxMSg || t("maxLength", { field: label, length: maxLength }),
      };
      rules.setValueAs = (value: string) => value?.trim();
    }

    if (isPhone) {
      rules.pattern = {
        value: REGEX.PHONE,
        message: t("phone"),
      };
      rules.setValueAs = (value: string) => value?.trimEnd();
    }
    if (isConfirmPassword) {
      rules.validate = {
        confirmPassword: (value: string) => {
          if (value.trim() !== watch("password").trim()) {
            return t("confirmPassword");
          }
          return true;
        },
      };
    }
    if (isInvalidField) {
      rules.pattern = {
        value: REGEX.INVALID_FIELD,
        message: t("invalidField", { field: label }),
      };
      rules.setValueAs = (value: string) => value?.trim();
    }
    if (isYearOld) {
      rules.validate = {
        ...rules.validate,
        yearOldRange: (value: string) => {
          const age = Number(value);
          if (isNaN(age) || age < 0 || age > 150) {
            return t("yearOldRange");
          }
          return true;
        },
      };
    }
    return rules;
  };

  const rules = getRules();
  const baseProps = {
    name,
    label,
    className,
    register,
    rules,
    errors,
    inputClassName,
    heightInput,
    isColumn,
    isShowLabel,
    isShowError,
    showRequiredLabel,
    isOutline,
  };

  switch (type) {
    case "checkbox":
      return <CheckboxInput {...baseProps} />;
    case "textarea":
      return <Textarea {...baseProps} placeholder={placeholder} borderClassName={borderClassName} mobileLabel={mobileLabel} desktopLabel={desktopLabel} />;
    case "search":
      return (
        <SearchInput
          {...baseProps}
          placeholder={placeholder}
          inputMaxLength={inputMaxLength}
          options={options}
          onSearch={onSearch}
          debounceMs={debounceMs}
          initialLoad={initialLoad}
        />
      );
    case "select":
      if (onSearch) {
        return <Select {...baseProps} placeholder={placeholder} onSearch={onSearch} debounceMs={debounceMs} initialLoad={initialLoad} />;
      }
      return <SelectInput {...baseProps} placeholder={placeholder} options={options || []} mobileLabel={mobileLabel} desktopLabel={desktopLabel} />;
    default:
      return (
        <DefaultInput
          {...baseProps}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          mobileLabel={mobileLabel}
          desktopLabel={desktopLabel}
          showPassword={type === "password" && showPasswordToggle ? showPassword : undefined}
          onTogglePassword={type === "password" && showPasswordToggle ? () => setShowPassword(!showPassword) : undefined}
          isNumber={isNumber}
          isPhone={isPhone}
          inputMaxLength={inputMaxLength}
          borderClassName={borderClassName}
          showRequiredLabel={showRequiredLabel}
        />
      );
  }
};

function SelectInput({
  className,
  label,
  errors,
  name,
  register,
  rules,
  inputClassName,
  options = [],
  placeholder,
  isColumn = false,
  isShowLabel = true,
  isShowError = true,
  borderClassName,
  mobileLabel,
  desktopLabel,
  showRequiredLabel = true,
}: SelectInputProps) {
  const { control, setValue } = useFormContext();
  const value = useWatch({ control, name });
  const isEmpty = !value || value === "";
  const hasError = !!errors[name];
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const dropdownPosition = useDropdownPosition({
    containerRef,
    isOpen,
    estimatedHeight: 380,
    dependencies: [options.length],
  });

  // Register form field
  React.useEffect(() => {
    register(name, rules);
  }, [name, register, rules]);

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredIndex(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  const handleSelect = (option: Option) => {
    if (option.disabled) return;
    setValue(name, option.value, { shouldValidate: false });
    setIsOpen(false);
    setHoveredIndex(null);
  };

  return (
    <div className={cn("flex gap-2", isColumn ? "flex-col" : "flex-col xl:flex-row xl:items-start xl:justify-between", className)}>
      {isShowLabel && (
        <FormLabel
          showRequiredLabel={showRequiredLabel}
          isRequired={!!rules.required}
          className={cn("shrink-0", isColumn ? "" : "xl:mt-2")}
          mobileText={mobileLabel}
          desktopText={desktopLabel}
        >
          {label}
        </FormLabel>
      )}
      <div className={cn("w-full", inputClassName)}>
        <div ref={containerRef} className="relative w-full cursor-pointer">
          <div
            className={cn(
              "scrollbar-cream relative cursor-pointer overflow-hidden bg-white px-3.5 py-3 sm:py-4",
              borderClassName ?? "rounded-[8px]",
              hasError ? "border-red-light border-2" : "border-gray-lighter border",
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <button
              type="button"
              className={cn(
                "text-1 relative z-5 h-full w-full cursor-pointer appearance-none bg-transparent pr-[42px] text-left focus:outline-none",
                isEmpty ? "text-gray-medium" : "text-primary",
                hasError ? "focus:outline-red-light" : "focus:outline-primary",
              )}
            >
              {displayValue || placeholder || ""}
            </button>
            <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 cursor-pointer">
              <ChevronDownIcon className={cn("h-5 w-5 text-gray-400 transition-transform duration-200 ease-in-out", isOpen && "rotate-180")} />
            </div>
          </div>
          {isOpen && (
            <div
              className={cn(
                "border-gray-lighter absolute z-50 w-full border bg-white shadow-lg",
                dropdownPosition === "bottom" ? "top-full mt-0.5" : "bottom-full mb-0.5",
              )}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="scrollbar-cream max-h-[360px] overflow-y-auto">
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    disabled={option.disabled}
                    className={cn(
                      "text-1 w-full px-3.5 py-3 text-left transition-colors sm:px-4",
                      hoveredIndex === index && "bg-gray-lighter",
                      option.disabled && "cursor-not-allowed opacity-50",
                      !option.disabled && "hover:bg-gray-lighter cursor-pointer",
                      option.value === value && "bg-cream font-medium",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {isShowError && <ErrorMessage errors={errors} name={name} />}
      </div>
    </div>
  );
}

const Textarea = ({
  className,
  label,
  errors,
  name,
  register,
  rules,
  inputClassName,
  placeholder,
  heightInput,
  isColumn = false,
  isShowLabel = true,
  isShowError = true,
  borderClassName,
  mobileLabel,
  desktopLabel,
  showRequiredLabel = true,
  isOutline = false,
  ...props
}: React.ComponentProps<"textarea"> & TextareaProps) => {
  return (
    <div className={cn("flex gap-2", isColumn ? "flex-col" : "flex-col xl:flex-row xl:items-start xl:justify-between", className)}>
      {isShowLabel && (
        <FormLabel className="shrink-0" showRequiredLabel={showRequiredLabel} isRequired={!!rules.required} mobileText={mobileLabel} desktopText={desktopLabel}>
          {label}
        </FormLabel>
      )}
      <div className={cn("w-full", inputClassName)}>
        <textarea
          {...register(name, rules)}
          data-slot="textarea"
          placeholder={placeholder}
          className={cn(
            "placeholder-gray-medium scrollbar-cream text-1 bg-cream text-primary w-full p-3 focus:outline-none sm:p-4",
            heightInput,
            !!errors[name] ? "border-red-light border-2" : isOutline ? borderClassName : "border-none",
            borderClassName ?? "rounded-[8px]",
          )}
          {...props}
        />
        {isShowError && <ErrorMessage errors={errors} name={name} />}
      </div>
    </div>
  );
};

export { Textarea };
