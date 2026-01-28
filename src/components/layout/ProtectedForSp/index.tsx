"use client";

import { SCREEN_MOBILE } from "@/constants";
import useWindowSize from "@/hooks/useWindowSize";

type Props = {
  children: React.ReactNode;
};

const ProtectedForSp = ({ children }: Props) => {
  const { width } = useWindowSize();

  const isPC = width === 0 || width >= SCREEN_MOBILE;

  return (
    <div>
      <div className="pointer-events-auto block md:hidden">
        <div className="flex min-h-screen items-center justify-center px-5">
          <span className="heading-3-30 text-cream">アプリをご利用ください。</span>
        </div>
      </div>
      <div className="hidden md:block">{isPC && children}</div>
    </div>
  );
};

export default ProtectedForSp;
