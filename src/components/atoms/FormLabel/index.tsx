"use client";
import { cn } from "@/libs/utils";
import { useTranslations } from "next-intl";
import React from "react";

type FormLabelProps = {
  children: React.ReactNode;
  className?: string;
  isRequired?: boolean;
  mobileText?: string;
  desktopText?: string;
  fontSize?: string;
  showRequiredLabel?: boolean;
  textColor?: string;
  textStyle?: string;
};
const FormLabel = ({
  children,
  className,
  isRequired = false,
  mobileText,
  desktopText,
  fontSize = "text-[18px] md:text-[20px]",
  textColor = "text-cream",
  textStyle = "font-noto-serif-jp font-bold tracking-[0.05em] md:font-semibold",
  showRequiredLabel = true,
}: FormLabelProps) => {
  const t = useTranslations("components");

  const renderLabel = () => {
    if (mobileText && desktopText) {
      return (
        <>
          <span className="md:hidden">{mobileText}</span>
          <span className="hidden md:inline">{desktopText}</span>
        </>
      );
    }
    return children;
  };

  return (
    <div className={cn("pointer-events-auto flex items-center gap-2 sm:gap-4", className)}>
      {isRequired && showRequiredLabel && (
        <div className="bg-red-primary font-noto-sans-jp flex h-[20px] w-[37px] items-center justify-center rounded-[4px] text-center text-[10.5px] font-normal text-white md:h-[39px] md:w-[60px] md:min-w-[60px] md:text-[14px]">
          {t("requiredLabel")}
        </div>
      )}
      <span className={cn(textColor, textStyle, fontSize)}>{renderLabel()}</span>
    </div>
  );
};

export default FormLabel;
