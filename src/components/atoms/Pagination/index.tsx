import { actionScrollToTop } from "@/libs";
import { cn } from "@/libs/utils";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  maxVisiblePages?: number;
  className?: string;
  pageKey?: string;
}

function Pagination({ totalPages, maxVisiblePages = 5, className = "", pageKey = "page" }: PaginationProps) {
  const t = useTranslations("components");
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get(pageKey) || "1");
  const router = useRouter();

  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisiblePages, totalPages);
      startPage = 1;
    } else if (currentPage >= totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      endPage = totalPages;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const onPageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(pageKey, page.toString());
    router.push(`?${newSearchParams.toString()}`);
    actionScrollToTop();
  };

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("font-noto-sans-jp flex items-center justify-center gap-2", className)}>
      <button
        onClick={handlePrevious}
        disabled={isFirstPage}
        className={cn(
          "font-noto-sans-jp rounded-md border px-2 py-1 transition-colors md:px-4 md:py-2",
          isFirstPage
            ? "bg-gray-lighter text-gray-medium border-gray-lighter cursor-not-allowed"
            : "bg-cream text-primary border-primary hover:bg-red-lightest hover:border-red-primary cursor-pointer",
        )}
        aria-label="Previous page"
      >
        {t("pagination.previous")}
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (typeof page === "string") {
            return (
              <span key={`${page}-${index}`} className="text-gray-medium px-2">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={cn(
                "min-w-8 rounded-md border px-2 py-1 font-medium transition-colors md:px-3 md:py-2",
                isActive
                  ? "bg-red-primary text-cream border-red-primary cursor-default"
                  : "bg-cream text-primary border-primary hover:bg-red-lightest hover:border-red-primary cursor-pointer",
              )}
              aria-label={`Page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={isLastPage}
        className={cn(
          "font-noto-sans-jp rounded-md border px-2 py-1 transition-colors md:px-4 md:py-2",
          isLastPage
            ? "bg-gray-lighter text-gray-medium border-gray-lighter cursor-not-allowed"
            : "bg-cream text-primary border-primary hover:bg-red-lightest hover:border-red-primary cursor-pointer",
        )}
        aria-label="Next page"
      >
        {t("pagination.next")}
      </button>
    </div>
  );
}

export default Pagination;
