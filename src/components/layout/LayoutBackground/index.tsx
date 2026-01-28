"use client";
import React from "react";
import Header from "../../organisms/Header/Header";
import Footer from "../../organisms/Footer/Footer";
import Sidebar from "../../organisms/Sidebar/index";
import defaultBackgroundTopSp from "../../../../public/assets/images/background_top_sp.png";
import defaultBackgroundTop from "../../../../public/assets/images/background_top.png";
import Image, { StaticImageData } from "next/image";

type LayoutBackgroundProps = {
  children: React.ReactNode;
  isFixedHeader?: boolean;
  zIndex?: string;
  isShowNavigatorSp?: boolean;
  pointerEvents?: string;
  isShowFooter?: boolean;
  isShowLoginButton?: boolean;
  minHeight?: string;
  backgroundSp?: StaticImageData;
  background?: StaticImageData;
  isBorderMobile?: boolean;
  isShowFooterMobile?: boolean;
};

const LayoutBackground = ({
  children,
  isFixedHeader = true,
  zIndex = "md:z-10",
  isShowNavigatorSp = true,
  pointerEvents = "pointer-events-auto",
  isShowFooter = true,
  isShowLoginButton = true,
  minHeight = "min-h-screen",
  backgroundSp,
  background,
  isBorderMobile = false,
  isShowFooterMobile = true,
}: LayoutBackgroundProps) => {
  return (
    <div className={`bg-black-custom relative ${minHeight}`}>
      <div className="fixed top-0 left-0 z-0 w-full">
        <Image src={backgroundSp ?? defaultBackgroundTopSp} alt="background_top" quality={70} className="h-auto w-full object-cover md:hidden" priority />

        <Image src={background ?? defaultBackgroundTop} alt="background_top" quality={70} className="hidden h-auto w-full object-cover md:block" priority />
      </div>

      {isFixedHeader && <Header isFixed={isFixedHeader} isShowLoginButton={isShowLoginButton} isBorderMobile={isBorderMobile} />}

      <div className={`relative z-10 ${zIndex} pt-[height_of_header] ${pointerEvents}`}>
        {children}
        <div className={`bg-black-custom pointer-events-auto ${isShowFooterMobile ? "block" : "hidden md:block"}`}>{isShowFooter && <Footer />}</div>
      </div>
      {isShowNavigatorSp && <Sidebar />}
    </div>
  );
};

export default LayoutBackground;
