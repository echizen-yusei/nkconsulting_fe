import { useEffect, useLayoutEffect, useState, useCallback, RefObject } from "react";

interface UseDropdownPositionOptions {
  containerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  estimatedHeight?: number;
  dependencies?: unknown[];
}

export const useDropdownPosition = ({ containerRef, isOpen, estimatedHeight = 380, dependencies = [] }: UseDropdownPositionOptions): "top" | "bottom" => {
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");

  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - containerRect.bottom;
    const spaceAbove = containerRect.top;

    if (spaceBelow < estimatedHeight && spaceAbove >= estimatedHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  }, [containerRef, estimatedHeight]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setDropdownPosition("bottom");
      return;
    }

    if (!containerRef.current) return;

    calculatePosition();
  }, [isOpen, containerRef, calculatePosition]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    window.addEventListener("scroll", calculatePosition, true);
    window.addEventListener("resize", calculatePosition);

    return () => {
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, containerRef, calculatePosition, ...dependencies]);

  return dropdownPosition;
};
