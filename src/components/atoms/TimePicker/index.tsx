import { ComponentProps, memo, useRef, useState, useEffect } from "react";
import { Clock, X } from "lucide-react";
import { cn } from "@/libs/utils";
import ErrorMsg from "../ErrorMsg";
import dayjs from "dayjs";
import { useDropdownPosition } from "@/hooks/useDropdownPosition";

type Props = {
  height?: string;
  borderRadius?: string;
  placeholder?: string;
  name?: string;
  error?: string;
  width?: string;
  disabled?: boolean;
  format?: string; // "HH:mm" or "hh:mm A"
  value?: string; // For react-hook-form integration (format: "HH:mm")
  onChange?: (value: string) => void; // For react-hook-form integration
  errorMessage?: string;
  minTime?: string; // Format: "HH:mm"
  maxTime?: string; // Format: "HH:mm"
  selectedDate?: string; // Selected date to check if it's today (format: "yyyy/MM/dd")
} & Omit<ComponentProps<"input">, "onChange" | "value">;

export const TimePicker = memo(function TimePicker({
  height = "56px",
  borderRadius = "8px",
  placeholder = "",
  name,
  error: errorMessage = "",
  width = "100%",
  disabled = false,
  format: _format = "HH:mm",
  value,
  onChange: propOnChange,
  minTime,
  maxTime,
  selectedDate,
}: Props) {
  const error = !!errorMessage;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Parse initial value
  const parseValue = (val: string | undefined) => {
    if (!val || val === "") return { hour: null, minute: null };
    const [hour, minute] = val.split(":").map(Number);
    if (!isNaN(hour) && !isNaN(minute)) {
      return { hour, minute };
    }
    return { hour: null, minute: null };
  };

  const initialValue = parseValue(value);
  const [selectedHour, setSelectedHour] = useState<number | null>(initialValue.hour);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(initialValue.minute);

  // Sync with external value changes
  useEffect(() => {
    const parsed = parseValue(value);
    if (parsed.hour !== selectedHour || parsed.minute !== selectedMinute) {
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Get effective minTime first (needed for filtering)
  const getEffectiveMinTime = (): string | undefined => {
    const now = dayjs();
    const currentTime = now.format("HH:mm");
    const currentTimeObj = dayjs(currentTime, "HH:mm");

    // If selectedDate is provided, check if it's today
    if (selectedDate) {
      const today = dayjs().format("yyyy/MM/dd");
      if (selectedDate === today) {
        // If it's today, use current time or minTime (whichever is later)
        if (minTime) {
          const minTimeObj = dayjs(minTime, "HH:mm");
          return minTimeObj.isAfter(currentTimeObj) ? minTime : currentTime;
        }
        return currentTime;
      }
      // If it's a future date, use minTime if provided
      return minTime;
    }

    // If no selectedDate, always use current time or minTime (whichever is later)
    // to prevent selecting past time
    if (minTime) {
      const minTimeObj = dayjs(minTime, "HH:mm");
      return minTimeObj.isAfter(currentTimeObj) ? minTime : currentTime;
    }
    return currentTime;
  };

  const effectiveMinTime = getEffectiveMinTime();

  // Get min hour and minute from effectiveMinTime
  const getMinHour = (): number => {
    if (effectiveMinTime) {
      const [hour] = effectiveMinTime.split(":").map(Number);
      if (!isNaN(hour)) return hour;
    }
    return 0;
  };

  const getMinMinute = (): number => {
    if (effectiveMinTime) {
      const [, minute] = effectiveMinTime.split(":").map(Number);
      if (!isNaN(minute)) return minute;
    }
    return 0;
  };

  const minHour = getMinHour();
  const minMinute = getMinMinute();

  // Filter hours: only show from minHour onwards
  const getFilteredHours = (): number[] => {
    const allHours = Array.from({ length: 24 }, (_, i) => i);
    return allHours.filter((hour) => hour >= minHour);
  };

  // Filter minutes: if hour is selected and equals minHour, only show from minMinute onwards
  // Otherwise show all minutes for that hour
  const getFilteredMinutes = (): number[] => {
    const allMinutes = Array.from({ length: 60 }, (_, i) => i);

    // If hour is selected
    if (selectedHour !== null) {
      // If selected hour equals minHour, filter from minMinute
      if (selectedHour === minHour) {
        return allMinutes.filter((minute) => minute >= minMinute);
      }
      // If selected hour is after minHour, show all minutes
      return allMinutes;
    }

    // If no hour selected, show all minutes (will be filtered when hour is selected)
    return allMinutes;
  };

  const hours = getFilteredHours();
  const minutes = getFilteredMinutes();

  // Format time for display
  const formatTime = (hour: number | null, minute: number | null): string => {
    if (hour === null || minute === null) return "";
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  // Get default hour from effectiveMinTime or 0
  const getDefaultHour = (): number => {
    if (effectiveMinTime) {
      const [hour] = effectiveMinTime.split(":").map(Number);
      if (!isNaN(hour)) return hour;
    }
    return 0;
  };

  // Get default minute from effectiveMinTime or 0
  const getDefaultMinute = (): number => {
    if (effectiveMinTime) {
      const [, minute] = effectiveMinTime.split(":").map(Number);
      if (!isNaN(minute)) return minute;
    }
    return 0;
  };

  // Handle time selection
  const handleTimeSelect = (newHour: number | null, newMinute: number | null) => {
    let finalHour: number;
    let finalMinute: number;

    // If selecting hour and minute is not set, auto-select default minute
    if (newHour !== null && selectedMinute === null) {
      finalHour = newHour;
      finalMinute = getDefaultMinute();
      setSelectedHour(newHour);
      setSelectedMinute(finalMinute);
    }
    // If selecting minute and hour is not set, auto-select default hour
    else if (newMinute !== null && selectedHour === null) {
      finalHour = getDefaultHour();
      finalMinute = newMinute;
      setSelectedHour(finalHour);
      setSelectedMinute(newMinute);
    }
    // Both values are being set or already exist
    else {
      finalHour = newHour !== null ? newHour : (selectedHour ?? getDefaultHour());
      finalMinute = newMinute !== null ? newMinute : (selectedMinute ?? getDefaultMinute());

      // Update state
      if (newHour !== null) setSelectedHour(newHour);
      if (newMinute !== null) setSelectedMinute(newMinute);
    }

    const timeString = formatTime(finalHour, finalMinute);
    const selectedTime = dayjs(timeString, "HH:mm");

    // Always validate against effectiveMinTime (prevents past time)
    if (effectiveMinTime) {
      const min = dayjs(effectiveMinTime, "HH:mm");
      if (selectedTime.isBefore(min)) {
        // Revert changes if invalid
        if (newHour !== null) setSelectedHour(selectedHour);
        if (newMinute !== null) setSelectedMinute(selectedMinute);
        return;
      }
    }

    // Validate maxTime if provided
    if (maxTime) {
      const max = dayjs(maxTime, "HH:mm");
      if (selectedTime.isAfter(max)) {
        // Revert changes if invalid
        if (newHour !== null) setSelectedHour(selectedHour);
        if (newMinute !== null) setSelectedMinute(selectedMinute);
        return;
      }
    }

    if (propOnChange) {
      propOnChange(timeString);
    }
  };

  // Check if time is disabled
  const isTimeDisabled = (hour: number, minute: number): boolean => {
    if (!effectiveMinTime && !maxTime) return false;

    const timeString = formatTime(hour, minute);
    const selectedTime = dayjs(timeString, "HH:mm");

    if (effectiveMinTime) {
      const min = dayjs(effectiveMinTime, "HH:mm");
      if (selectedTime.isBefore(min)) return true;
    }
    if (maxTime) {
      const max = dayjs(maxTime, "HH:mm");
      if (selectedTime.isAfter(max)) return true;
    }

    return false;
  };

  // Calculate dropdown position based on available space
  const dropdownPosition = useDropdownPosition({
    containerRef,
    isOpen,
    estimatedHeight: 300,
    dependencies: [hours.length, minutes.length],
  });

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Clear time
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHour(null);
    setSelectedMinute(null);
    if (propOnChange) {
      propOnChange("");
    }
  };

  const displayValue = selectedHour !== null && selectedMinute !== null ? formatTime(selectedHour, selectedMinute) : "";

  return (
    <div
      className="relative"
      style={{
        width,
        zIndex: isOpen ? 50 : 1,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .time-picker-input-${name || "default"} {
              position: relative;
            }
            
            .time-picker-input-${name || "default"} .time-picker-button {
              width: 100% !important;
              height: ${height} !important;
              border: 2px solid ${disabled ? "#ffffff" : error ? "#e38282" : "#333333"} !important;
              padding: 0 16px 0 16px !important;
              background-color: ${disabled ? "#E6F2FF" : "#ffffff"} !important;
              border-radius: ${borderRadius} !important;
              transition: all 0.2s ease-in-out !important;
              cursor: ${disabled ? "not-allowed" : "pointer"} !important;
              text-align: left !important;
            }
            
            .time-picker-input-${name || "default"} .time-picker-button:hover:not(:disabled) {
              border-color: ${error ? "#e38282" : "#333333"} !important;
            }
            
            .time-picker-input-${name || "default"} .time-picker-button:focus {
              border-color: ${error ? "#e38282" : "#333333"} !important;
            }
            
            .time-picker-dropdown-${name || "default"} {
              position: absolute;
              top: calc(100% + 4px);
              left: 0;
              right: 0;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              max-height: 300px;
              overflow: hidden;
              display: flex;
            }
            
            .time-picker-column {
              flex: 1;
              display: flex;
              flex-direction: column;
              max-height: 300px;
            }
            
            .time-picker-header {
              background: #ffffff;
              border-bottom: 1px solid #e5e7eb;
              flex-shrink: 0;
            }
            
            .time-picker-scroll-container {
              flex: 1;
              overflow-y: auto;
              max-height: calc(300px - 40px);
            }
            
            .time-picker-scroll-container::-webkit-scrollbar {
              width: 6px;
            }
            
            .time-picker-scroll-container::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            
            .time-picker-scroll-container::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 3px;
            }
            
            .time-picker-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
            
            .time-picker-option {
              padding: 12px 16px;
              cursor: pointer;
              transition: all 0.2s ease-in-out;
              text-align: center;
              font-size: 14px;
              color: #374151;
            }
            
            .time-picker-option:hover:not(.disabled):not(.selected) {
              background-color: #f2f2f2;
            }
            
            .time-picker-option.selected {
              background-color: #333333;
              color: #ffffff;
              font-weight: 600;
            }
            
            .time-picker-option.disabled {
              color: #d1d5db;
              cursor: not-allowed;
              opacity: 0.5;
            }
          `,
        }}
      />
      <div className={`time-picker-input-${name || "default"}`} ref={containerRef}>
        <div className="relative">
          <button type="button" onClick={() => !disabled && setIsOpen(!isOpen)} disabled={disabled} className="time-picker-button">
            <div className="flex items-center justify-between">
              <span className={displayValue ? "text-gray-900" : "text-gray-medium"}>{displayValue || placeholder}</span>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </button>
          {isOpen && (
            <div
              className={cn(
                "absolute right-0 left-0 z-50 flex max-h-[300px] overflow-hidden border border-gray-200 bg-white shadow-lg",
                dropdownPosition === "bottom" ? "top-full mt-0.5" : "bottom-full mb-0.5",
              )}
            >
              <div className="flex max-h-[300px] flex-1 flex-col">
                <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700">時</div>
                <div className="time-picker-scroll-container max-h-[260px] flex-1 overflow-y-auto">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={cn(
                        "cursor-pointer px-4 py-3 text-center text-sm text-gray-700 transition-all duration-200",
                        "hover:opacity-70",
                        selectedHour === hour && "bg-gray333 font-semibold text-white",
                        isTimeDisabled(hour, selectedMinute ?? 0) && "cursor-not-allowed text-gray-300 opacity-50",
                      )}
                      onClick={() => {
                        const minute = selectedMinute ?? 0;
                        if (!isTimeDisabled(hour, minute)) {
                          handleTimeSelect(hour, null);
                        }
                      }}
                    >
                      {String(hour).padStart(2, "0")}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex max-h-[300px] flex-1 flex-col">
                <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700">分</div>
                <div className="time-picker-scroll-container max-h-[260px] flex-1 overflow-y-auto">
                  {minutes.map((minute) => (
                    <div
                      key={minute}
                      className={cn(
                        "cursor-pointer px-4 py-3 text-center text-sm text-gray-700 transition-all duration-200",
                        "hover:opacity-70",
                        selectedMinute === minute && "bg-gray333 font-semibold text-white",
                        isTimeDisabled(selectedHour ?? 0, minute) && "cursor-not-allowed text-gray-300 opacity-50",
                      )}
                      onClick={() => {
                        const hour = selectedHour ?? 0;
                        if (!isTimeDisabled(hour, minute)) {
                          handleTimeSelect(null, minute);
                        }
                      }}
                    >
                      {String(minute).padStart(2, "0")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {displayValue && !disabled && (
            <div
              onClick={handleClear}
              className="absolute top-1/2 right-[45px] flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100"
              aria-label="Clear time"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </div>
          )}
        </div>
      </div>
      {error && <ErrorMsg message={errorMessage || ""} name={name || ""} />}
    </div>
  );
});
