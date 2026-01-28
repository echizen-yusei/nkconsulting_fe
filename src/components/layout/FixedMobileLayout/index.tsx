import { cn } from "@/libs/utils";
import React, { useCallback, useState } from "react";

type FixedMobileLayoutProps = {
  children: React.ReactNode;
  supHeaderContent?: React.ReactNode;
  title: string;
  paddingX?: string;
  paddingBottom?: string;
  defaultOpen?: boolean;
  onBack: () => void;
};

const FixedMobileLayout = ({ children, supHeaderContent, title, onBack, paddingX = "px-6", paddingBottom = "pb-6" }: FixedMobileLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickBack = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => {
      onBack();
    }, 100);
  }, [onBack]);

  return (
    <div className="fixed inset-0 z-60 block bg-black md:hidden">
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-10 gap-2 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100",
        )}
      >
        <div className="border-cream flex items-center border-b bg-black p-6">
          <div className="absolute top-6 left-6 cursor-pointer" onClick={onClickBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_2229_3866)">
                <path d="M15.7051 16.59L11.1251 12L15.7051 7.41L14.2951 6L8.29508 12L14.2951 18L15.7051 16.59Z" fill="#F2F2F2" />
              </g>
              <defs>
                <clipPath id="clip0_2229_3866">
                  <rect width="24" height="24" fill="white" transform="matrix(0 1 -1 0 24 0)" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="text-cream heading-5 flex-1 text-center">{title}</div>
        </div>
        {supHeaderContent}
      </div>
      <div
        className={cn(
          "h-full overflow-y-auto bg-black pt-[72px] transition-all duration-300 ease-in-out md:mx-0 md:mt-0 md:bg-transparent md:px-12 md:py-16 md:pt-16",
          isOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100",
          paddingX,
          paddingBottom,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default FixedMobileLayout;
