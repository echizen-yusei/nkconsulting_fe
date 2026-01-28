import { ComponentProps, forwardRef, memo, useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from "date-fns/locale/ja";
import dayjs from "dayjs";
import { cn, formatDateToString, getDateFromValue } from "@/libs/utils";
import { X } from "lucide-react";
import ErrorMsg from "../ErrorMsg";

type Props = {
  height?: string;
  bgColor?: string;
  borderRadius?: string;
  placeholder?: string;
  isSelectRange?: boolean;
  name?: string;
  error?: string;
  width?: string;
  minDate?: Date;
  maxDate?: Date;
  showMonthYearPicker?: boolean;
  disabled?: boolean;
  format?: string;
  isClear?: boolean;
  startDate?: Date | null;
  setStartDate?: (date: Date | null) => void;
  dateRange?: (Date | null)[];
  setDateRange?: (dates: (Date | null)[]) => void;
  isResetToday?: boolean;
  value?: string; // For react-hook-form integration
  onChange?: (value: string) => void; // For react-hook-form integration
  errorMessage?: string;
} & Omit<ComponentProps<"input">, "onChange" | "value">;

type ExampleCustomInputProps = {
  value?: string;
  onClick?: () => void;
};

export const CustomDatePicker = memo(function CustomDatePicker({
  bgColor: _bgColor = "#ffffff",
  placeholder = "",
  isSelectRange,
  name,
  error: errorMessage = "",
  minDate,
  maxDate,
  width = "100%",
  showMonthYearPicker,
  disabled,
  format = "yyyy/MM/dd",
  isClear,
  startDate: propStartDate,
  setStartDate: propSetStartDate,
  dateRange: propDateRange,
  setDateRange: propSetDateRange,
  isResetToday = false,
  value, // From react-hook-form
  onChange: propOnChange, // From react-hook-form
}: Props) {
  const error = !!errorMessage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerLocale("ja", ja as any);
  const datePickerRef = useRef<DatePicker>(null);

  // Use internal state if not controlled by react-hook-form
  const [internalDate, setInternalDate] = useState<Date | null>(null);

  // Determine which date source to use
  const startDate = value !== undefined ? getDateFromValue(value, format) : propStartDate !== undefined ? propStartDate : internalDate;

  const handleDateChange = (date: Date | null) => {
    if (value !== undefined && propOnChange) {
      // Controlled by react-hook-form
      propOnChange(formatDateToString(date, format));
    } else if (propSetStartDate) {
      // Controlled by prop
      propSetStartDate(date);
    } else {
      // Internal state
      setInternalDate(date);
    }
  };

  const openDatePicker = () => {
    if (datePickerRef.current) datePickerRef?.current?.setOpen(true);
  };

  const handleClearDate = () => {
    const newDate = isResetToday ? new Date() : null;
    if (value !== undefined && propOnChange) {
      propOnChange(formatDateToString(newDate, format));
    } else if (propSetStartDate) {
      propSetStartDate(newDate);
    } else {
      setInternalDate(newDate);
    }
    if (propSetDateRange) {
      propSetDateRange([null, null]);
    }
  };

  const ExampleCustomInput = forwardRef<HTMLDivElement, ExampleCustomInputProps>(function ExampleCustomInput({ value, onClick }, ref) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={onClick}
          type="button"
          className={cn(
            "h-[56px] w-full cursor-pointer rounded-[8px] bg-white px-4 text-left transition-all duration-200",
            disabled ? "border border-white" : error ? "border-red-light border-2" : "",
          )}
        >
          {value ? <span className="text-gray-900">{value}</span> : <span className="text-gray-medium">{placeholder}</span>}
        </button>
        <button
          type="button"
          onClick={openDatePicker}
          disabled={disabled}
          className={cn(
            "justify-cente absolute top-1/2 right-[14px] z-10 flex -translate-y-1/2 items-center",
            "h-6 w-6 rounded-md transition-all duration-200",
            disabled ? "cursor-default text-gray-400" : "cursor-pointer active:scale-95",
          )}
          aria-label="Open calendar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z"
              fill="#808080"
            />
          </svg>
        </button>
        {dayjs().isSame(dayjs(startDate), "day") && isResetToday
          ? false
          : (startDate || propDateRange?.[1]) &&
            !disabled && (
              <div className="absolute top-1/2 right-[45px] z-3 -translate-y-1/2">
                <button
                  type="button"
                  onClick={handleClearDate}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100"
                  aria-label="Clear date"
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            )}
      </div>
    );
  });

  useEffect(() => {
    if (isClear) {
      handleClearDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClear]);

  return (
    <div
      className="relative"
      style={{
        width,
        zIndex: 10,
      }}
    >
      <div className="[&_.react-datepicker-wrapper]:w-full">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Custom Calendar Styles */
            .react-datepicker {
              border: 1px solid #e5e7eb !important;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
              background-color: #ffffff !important;
            }       
            .react-datepicker__header {
              background: #333333 !important;
              border-bottom: none !important;
              padding: 12px 0 !important;
            }
            
            .react-datepicker__current-month {
              color: #ffffff !important;
              font-weight: 600 !important;
              font-size: 14px !important;
            }
            
            .react-datepicker__day-names {
              margin: 0 !important;
              padding-top: 8px !important;
            }
            
            .react-datepicker__day-name {
              color: #808080 !important;
              font-weight: 500 !important;
              font-size: 12px !important;
              width: 36px !important;
              line-height: 36px !important;
              margin: 0 2px !important;
            }
            
            .react-datepicker__month {
              margin: 0 8px 8px 8px !important;
            }
            
            .react-datepicker__day {
              width: 36px !important;
              height: 36px !important;
              line-height: 36px !important;
              margin: 2px !important;
              border-radius: 6px !important;
              color: #374151 !important;
              font-weight: 400 !important;
              transition: all 0.2s ease-in-out !important;
            }
            
            .react-datepicker__day:hover:not(.react-datepicker__day--disabled):not(.react-datepicker__day--selected) {
              background-color: #f2f2f2f2 !important;
              color: #808080 !important;
              border-radius: 6px !important;
            }
            
            .react-datepicker__day--selected,
            .react-datepicker__day--in-selecting-range,
            .react-datepicker__day--in-range {
              background: #333333 !important;
              color: #ffffff !important;
              font-weight: 600 !important;
              border-radius: 6px !important;
            }
            
            .react-datepicker__day--keyboard-selected {
              background-color: #ffffff !important;
              color: #333333 !important;
              border-radius: 6px !important;
            }
            
            .react-datepicker__day--today {
              font-weight: 600 !important;
              border: 1px solid #333333 !important;
              border-radius: 6px !important;
              
            }
            
            .react-datepicker__day--disabled {
              color: #d1d5db !important;
              cursor: not-allowed !important;
            }
            
            .react-datepicker__navigation {
              top: 12px !important;
            }
            
            .react-datepicker__navigation-icon::before {
              border-color: #ffffff !important;
              border-width: 2px 2px 0 0 !important;
            }
            
            .react-datepicker__navigation:hover *::before {
              border-color: rgba(255, 255, 255, 0.8) !important;
            }
          `,
          }}
        />
        <div className={`date-picker-input-${name || "default"}`}>
          {/* @ts-expect-error - selectsMultiple prop type issue with react-datepicker */}
          <DatePicker
            ref={datePickerRef}
            selected={startDate}
            onChange={(date: Date | [Date | null, Date | null] | null) => {
              if (date === null) {
                handleDateChange(null);
                if (propSetDateRange) {
                  propSetDateRange([null, null]);
                }
              } else if (Array.isArray(date)) {
                if (propSetDateRange) {
                  propSetDateRange(date);
                }
              } else {
                handleDateChange(date);
              }
            }}
            fixedHeight
            placeholderText={placeholder}
            dateFormat={format}
            autoComplete="off"
            locale="ja"
            {...(isSelectRange ? { selectsRange: true } : {})}
            startDate={propDateRange?.[0]}
            endDate={propDateRange?.[1]}
            name={name}
            minDate={minDate}
            maxDate={maxDate}
            {...(showMonthYearPicker ? { showMonthYearPicker: true } : {})}
            disabled={disabled}
            onCalendarClose={() => {
              if (!propDateRange?.[1] && propSetDateRange) {
                propSetDateRange([null, null]);
              }
            }}
            customInput={<ExampleCustomInput />}
            popperModifiers={[
              {
                name: "offset",
                options: { offset: [0, 1] }, // skid, distance
                fn: () => Promise.resolve({ data: { top: 0, left: 0 } }), // Popper cần fn, nhưng không cần logic gì
              },
            ]}
            popperClassName="custom-datepicker-popper"
          />
          {error && <ErrorMsg message={errorMessage || ""} name={name || ""} />}
        </div>
      </div>
    </div>
  );
});
