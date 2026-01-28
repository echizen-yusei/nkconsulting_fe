"use client";

import { useTranslations } from "next-intl";

interface LoadingDotsProps {
  text?: string;
  className?: string;
}

const LoadingDots = ({ text, className = "" }: LoadingDotsProps) => {
  const t = useTranslations("components");
  return (
    <span className={`inline-flex items-center ${className}`}>
      {text || t("loading")}
      <span className="inline-flex w-[18px]">
        <span className="animate-dot-1">.</span>
        <span className="animate-dot-2">.</span>
        <span className="animate-dot-3">.</span>
      </span>
    </span>
  );
};

export default LoadingDots;
