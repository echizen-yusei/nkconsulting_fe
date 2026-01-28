"use client";

import { createPortal } from "react-dom";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/5 backdrop-blur-xs">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/20 border-t-[#CF2E2E]"></div>
    </div>
  );
}

export const LoadingSpinnerPortal = () => {
  return createPortal(<LoadingSpinner />, document.body);
};
