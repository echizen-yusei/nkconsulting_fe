"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { cn } from "@/libs/utils";
import FormLabel from "../FormLabel";
import { ErrorMessage } from "../ErrorMessage";
import { Option, SelectProps } from "@/types/components";
import { useTranslations } from "next-intl";
import { useDropdownPosition } from "@/hooks/useDropdownPosition";

const Select = ({
  name,
  label,
  placeholder,
  options = [],
  className,
  inputClassName,
  isColumn = false,
  isShowLabel = true,
  isShowError = true,
  required = false,
  disabled = false,
  rules,
  onSearch,
  debounceMs = 300,
  initialLoad = false,
  borderClassName,
  showRequiredLabel = true,
}: SelectProps) => {
  const t = useTranslations("components.select");
  const {
    register,
    setValue,
    formState: { errors },
    control,
  } = useFormContext();
  const value = useWatch({ control, name });

  useEffect(() => {
    register(name, rules || {});
  }, [name, register, rules]);

  useEffect(() => {
    if (value) {
      const foundOption = options.find((opt) => opt.value === value) || apiOptions.find((opt) => opt.value === value);
      if (foundOption) {
        setSavedSelectedOption((prev) => {
          if (!prev || prev.value !== value) {
            return foundOption;
          }
          return prev;
        });
      }
    } else {
      setSavedSelectedOption(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [apiOptions, setApiOptions] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [savedSelectedOption, setSavedSelectedOption] = useState<Option | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialLoadedRef = useRef(false);
  const isInitialLoadInProgressRef = useRef(false);
  const previousSearchTermRef = useRef<string>("");

  const hasError = !!errors[name];
  const isApiMode = !!onSearch;
  const displayOptions = isApiMode ? apiOptions : options;
  const selectedOption =
    value && savedSelectedOption && savedSelectedOption.value === value
      ? savedSelectedOption
      : value
        ? options.find((opt) => opt.value === value) || apiOptions.find((opt) => opt.value === value)
        : undefined;

  const filteredOptions = useMemo(() => {
    let filtered: Option[] = [];

    if (isApiMode) {
      filtered = displayOptions;
    } else {
      if (!searchTerm.trim()) {
        filtered = options;
      } else {
        filtered = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
      }
    }

    if (value) {
      filtered = filtered.filter((opt) => opt.value !== value);
    }

    return filtered;
  }, [options, searchTerm, isApiMode, displayOptions, value]);

  const fetchData = useCallback(
    async (search: string, page: number, append: boolean = false) => {
      if (!onSearch) return Promise.resolve();

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await onSearch(search, page);
        if (append) {
          setApiOptions((prev) => [...prev, ...response.data]);
        } else {
          setApiOptions(response.data);
        }
        setHasMore(response.hasMore);
        setCurrentPage(page);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        if (!append) {
          setApiOptions([]);
        }
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [onSearch],
  );

  useEffect(() => {
    if (!isApiMode || !isOpen) return;

    // Skip if initialLoad is in progress (handled by handleToggleDropdown)
    if (isInitialLoadInProgressRef.current) return;

    // Skip if initialLoad is enabled and this is the first load with empty searchTerm
    if (initialLoad && !hasInitialLoadedRef.current && searchTerm === "") return;

    const trimmedSearch = searchTerm.trim();
    const previousTrimmed = previousSearchTermRef.current.trim();

    if (trimmedSearch === "" && searchTerm !== "") {
      if (previousTrimmed !== "") {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          setCurrentPage(1);
          fetchData("", 1, false);
        }, debounceMs);
      }
      previousSearchTermRef.current = searchTerm;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setCurrentPage(1);
      const searchValue = trimmedSearch;
      fetchData(searchValue, 1, false);
    }, debounceMs);

    previousSearchTermRef.current = searchTerm;

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, isApiMode, isOpen, debounceMs, fetchData, initialLoad]);

  // Load more data when scrolling
  const loadMore = useCallback(() => {
    if (!isApiMode || isLoadingMore || !hasMore || isLoading) return;
    const trimmedSearch = searchTerm.trim();
    fetchData(trimmedSearch, currentPage + 1, true);
  }, [isApiMode, isLoadingMore, hasMore, isLoading, searchTerm, currentPage, fetchData]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isApiMode || !isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isApiMode, isOpen, hasMore, isLoadingMore, isLoading, loadMore]);

  const handleToggleDropdown = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setSearchTerm("");
        setFocusedIndex(null);
        previousSearchTermRef.current = "";
        if (isApiMode) {
          setCurrentPage(1);
          setHasMore(false);
          setApiOptions([]);
          hasInitialLoadedRef.current = false;
          isInitialLoadInProgressRef.current = false;
        }
      } else if (isApiMode && initialLoad && !hasInitialLoadedRef.current && !isLoading) {
        isInitialLoadInProgressRef.current = true;
        hasInitialLoadedRef.current = true;
        fetchData("", 1, false).finally(() => {
          isInitialLoadInProgressRef.current = false;
        });
      }
    },
    [isApiMode, initialLoad, isLoading, fetchData],
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setFocusedIndex(null);
      if (isApiMode) {
        setCurrentPage(1);
        if (value.trim() !== "" || value === "") {
          setApiOptions([]);
        }
      }
    },
    [isApiMode],
  );

  // Handle option selection
  const handleSelect = useCallback(
    (option: Option) => {
      if (option.disabled) return;
      setValue(name, option.value, { shouldValidate: false });
      setSavedSelectedOption(option);
      handleToggleDropdown(false);
    },
    [name, setValue, handleToggleDropdown],
  );

  const scrollToOption = useCallback((index: number) => {
    if (listRef.current) {
      const optionElement = listRef.current.children[index] as HTMLElement;
      if (optionElement) {
        optionElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, []);

  const dropdownPosition = useDropdownPosition({
    containerRef,
    isOpen,
    estimatedHeight: 385,
    dependencies: [filteredOptions.length],
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleToggleDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleToggleDropdown]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filteredOptions.length === 0) return;
        const nextIndex = focusedIndex !== null ? Math.min(focusedIndex + 1, filteredOptions.length - 1) : 0;
        setFocusedIndex(nextIndex);
        scrollToOption(nextIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filteredOptions.length === 0) return;
        const nextIndex = focusedIndex !== null ? Math.max(focusedIndex - 1, 0) : filteredOptions.length - 1;
        setFocusedIndex(nextIndex);
        scrollToOption(nextIndex);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (focusedIndex !== null && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex]);
        } else if (filteredOptions.length === 1) {
          handleSelect(filteredOptions[0]);
        }
      } else if (e.key === "Escape") {
        handleToggleDropdown(false);
      }
    },
    [filteredOptions, focusedIndex, handleSelect, scrollToOption, handleToggleDropdown],
  );

  const displayValue = selectedOption ? selectedOption.label : "";
  const isEmpty = !value || value === "";

  return (
    <div className={cn("flex gap-2", isColumn ? "flex-col" : "flex-col xl:flex-row xl:items-center xl:justify-between", className)}>
      {isShowLabel && (
        <FormLabel className="shrink-0" showRequiredLabel={showRequiredLabel} isRequired={required}>
          {label}
        </FormLabel>
      )}
      <div className={cn("w-full", inputClassName)}>
        <div ref={containerRef} className="relative w-full">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDropdown(!isOpen);
            }}
            className={cn(
              "bg-cream scrollbar-cream relative overflow-hidden",
              borderClassName ?? "rounded-[8px]",
              hasError ? "border-red-light border-2" : "border-none",
              disabled && "pointer-events-none opacity-50",
              !disabled && !isOpen && "cursor-pointer",
            )}
          >
            <input
              ref={inputRef}
              type="text"
              value={displayValue}
              readOnly
              onFocus={(e) => {
                e.target.blur();
              }}
              placeholder={isEmpty ? placeholder : ""}
              disabled={disabled}
              className={cn(
                "text-1 bg-cream text-primary placeholder-gray-medium relative block h-full w-full cursor-pointer appearance-none p-3 pr-10 focus:z-10 focus:outline-none sm:p-4 md:rounded-[8px]",
                isEmpty ? "text-gray-medium" : "text-primary",
              )}
            />
            <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center gap-2 sm:right-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleDropdown(!isOpen);
                }}
                className="pointer-events-auto cursor-pointer rounded p-1 transition-colors hover:bg-gray-100"
                aria-label={isOpen ? "Close dropdown" : "Open dropdown"}
              >
                <ChevronDownIcon className={cn("h-5 w-5 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
            </div>
          </div>

          {isOpen && !disabled && (
            <div
              ref={dropdownRef}
              className={cn(
                "border-gray-lighter absolute z-50 w-full border bg-white shadow-lg",
                dropdownPosition === "bottom" ? "top-full mt-0.5" : "bottom-full mb-0.5",
              )}
              onMouseLeave={() => setFocusedIndex(null)}
            >
              <div className="border-gray-lighter border-b p-2">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("search")}
                  className={cn("text-1 w-full border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none", borderClassName ?? "rounded-[8px]")}
                />
              </div>
              {isLoading && filteredOptions.length === 0 ? (
                <div className="flex items-center justify-center px-3 py-4 sm:px-4">
                  <Loader2 className="text-gray-medium h-5 w-5 animate-spin" />
                  <span className="text-gray-medium text-1 ml-2">{t("loading")}</span>
                </div>
              ) : filteredOptions.length > 0 ? (
                <div ref={listRef} className="max-h-80 overflow-y-auto">
                  {filteredOptions.map((option, index) => (
                    <button
                      key={`${option.value}-${index}`}
                      type="button"
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      disabled={option.disabled}
                      className={cn(
                        "text-1 w-full px-3 py-2 text-left transition-colors sm:px-4 sm:py-3",
                        focusedIndex === index && "bg-gray-lighter",
                        option.disabled && "cursor-not-allowed opacity-50",
                        !option.disabled && "hover:bg-gray-lighter cursor-pointer",
                        option.value === value && "bg-cream font-medium",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                  {isApiMode && (
                    <div ref={observerTarget} className="flex min-h-[10px] items-center justify-center">
                      {isLoadingMore && (
                        <div className="flex items-center gap-2 py-2">
                          <Loader2 className="text-gray-medium h-4 w-4 animate-spin" />
                          <span className="text-gray-medium text-sm">{t("loadingMore")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-medium px-3 py-4 text-center sm:px-4">
                  <p className="text-1">{t("noResults")}</p>
                </div>
              )}
            </div>
          )}
        </div>
        {isShowError && <ErrorMessage errors={errors} name={name} />}
      </div>
    </div>
  );
};

export default Select;
