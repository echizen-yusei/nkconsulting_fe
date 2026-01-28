import { Loader2, Search } from "lucide-react";
import { ErrorMessage } from "../ErrorMessage";
import { DefaultInputProps, Option } from "@/types/components";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropdownPosition } from "@/hooks/useDropdownPosition";
import FormLabel from "../FormLabel";
import { cn } from "@/libs/utils";

export const SearchInput = ({
  name,
  label,
  placeholder,
  className,
  inputClassName,
  register,
  rules,
  errors,
  heightInput,
  isColumn = false,
  isShowLabel = true,
  isShowError = true,
  inputMaxLength,
  options = [],
  onSearch,
  debounceMs = 300,
  initialLoad = false,
  borderClassName,
  showRequiredLabel = true,
}: Omit<DefaultInputProps, "type"> & {
  options?: Option[];
  onSearch?: (searchTerm: string, page: number) => Promise<{ data: Option[]; hasMore: boolean }>;
  debounceMs?: number;
  initialLoad?: boolean;
}) => {
  const { setValue, control } = useFormContext();
  const t = useTranslations("components.select");
  const value = useWatch({ control, name });

  useEffect(() => {
    register(name, rules || {});
  }, [name, register, rules]);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [apiOptions, setApiOptions] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [_savedSelectedOption, setSavedSelectedOption] = useState<Option | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
  }, [value, options, apiOptions]);

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

    return filtered;
  }, [options, searchTerm, isApiMode, displayOptions]);

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
      } catch (_error) {
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

    if (isInitialLoadInProgressRef.current) return;

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

  const loadMore = useCallback(() => {
    if (!isApiMode || isLoadingMore || !hasMore || isLoading) return;
    const trimmedSearch = searchTerm.trim();
    fetchData(trimmedSearch, currentPage + 1, true);
  }, [isApiMode, isLoadingMore, hasMore, isLoading, searchTerm, currentPage, fetchData]);

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

  const handleSearchChange = useCallback(
    (value: string) => {
      isInternalUpdateRef.current = true;
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

  const handleSelect = useCallback(
    (option: Option) => {
      if (option.disabled) return;
      isInternalUpdateRef.current = true;
      setSearchTerm(option.label);
      setValue(name, option.label, { shouldValidate: false });
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
        if (inputRef.current) {
          inputRef.current.focus();
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

  const inputValue = searchTerm;
  const isEmpty = !inputValue || inputValue === "";

  const isInternalUpdateRef = useRef(false);

  useEffect(() => {
    if (!isOpen && value !== undefined && value !== searchTerm && !isInternalUpdateRef.current) {
      setSearchTerm(value);
    }
    // Reset flag sau khi sync
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isOpen]);

  return (
    <div className={cn("flex gap-2", isColumn ? "flex-col" : "flex-col xl:flex-row xl:items-center xl:justify-between", className)}>
      {isShowLabel && (
        <FormLabel className="shrink-0" showRequiredLabel={showRequiredLabel} isRequired={!!rules.required}>
          {label}
        </FormLabel>
      )}
      <div className={cn("w-full", inputClassName)}>
        <div ref={containerRef} className="relative w-full">
          <div className={cn("bg-cream relative overflow-hidden", borderClassName ?? "rounded-[8px]", hasError ? "border-red-light border-2" : "border-none")}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="text-gray-medium h-5 w-5" />
            </div>
            <input
              ref={inputRef}
              type="search"
              value={inputValue}
              onChange={(e) => {
                const newValue = e.target.value;
                handleSearchChange(newValue);
                setValue(name, newValue, { shouldValidate: false });
                if (!isOpen) {
                  handleToggleDropdown(true);
                }
              }}
              onFocus={() => {
                if (!isOpen) {
                  handleToggleDropdown(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                "text-1 bg-cream text-primary placeholder-gray-medium relative block h-full w-full appearance-none p-3 focus:z-10 focus:outline-none sm:p-4",
                heightInput,
                isEmpty ? "text-gray-medium" : "text-primary",
                borderClassName ?? "rounded-[8px]",
              )}
              maxLength={inputMaxLength}
            />
          </div>

          {isOpen && (
            <div
              ref={dropdownRef}
              className={cn(
                "border-gray-lighter absolute z-50 w-full border bg-white shadow-lg",
                dropdownPosition === "bottom" ? "top-full mt-0.5" : "bottom-full mb-0.5",
              )}
              onMouseLeave={() => setFocusedIndex(null)}
            >
              {isLoading && filteredOptions.length === 0 ? (
                <div className="flex items-center justify-center px-3 py-4 sm:px-4">
                  <Loader2 className="text-gray-medium h-5 w-5 animate-spin" />
                  <span className="text-gray-medium text-1 ml-2">{t("loading")}</span>
                </div>
              ) : filteredOptions.length > 0 ? (
                <div ref={listRef} className="scrollbar-cream max-h-[360px] overflow-y-auto">
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
                        option.label === value && "bg-cream font-medium",
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
