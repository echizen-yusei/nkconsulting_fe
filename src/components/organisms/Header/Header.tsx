"use client";
import Button from "@/components/atoms/Button/Button";
import { PAGE } from "@/constants/page";
import useNavigation from "@/hooks/useNavigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import logo from "../../../../public/assets/images/logo.png";
import logoSp from "../../../../public/assets/images/logo_sp.png";

import Image from "next/image";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/atoms/user-atoms";
import { useUserContext } from "@/components/providers/UserProvider";

type HeaderProps = {
  isFixed?: boolean;
  isShowLoginButton?: boolean;
  isBorderMobile?: boolean;
  className?: string;
  isShowBtnLogout?: boolean;
};

const Header = ({ isFixed = true, isShowLoginButton = true, isBorderMobile = false, className = "" }: HeaderProps) => {
  const [userData] = useAtom(userInfoAtom);
  const { isLoadingUserInfo } = useUserContext();
  const { router } = useNavigation();
  const t = useTranslations("Header");
  const handleLogin = () => {
    router.push(PAGE.LOGIN);
  };
  const handleContact = () => {
    router.push(PAGE.CONTACT);
  };

  return (
    <div
      className={`flex items-center justify-between ${isFixed ? "fixed top-0 right-0 left-0 z-10" : ""} z-30 px-6 md:px-12 ${isBorderMobile ? "border-cream border-b-2 bg-black pt-6 pb-[22px] md:border-none md:bg-transparent md:py-6" : "py-6"} ${className}`}
    >
      <Link href={PAGE.HOME} className="hidden md:block">
        <Image src={logo} alt="logo" className="block h-[43px] w-20 md:h-16 md:w-30" priority />
      </Link>
      <Link href={PAGE.HOME} className="block md:hidden">
        <Image src={logoSp} alt="logo" className="block h-[34px] w-16 md:h-16 md:w-30" priority />
      </Link>
      {isShowLoginButton && !userData && !isLoadingUserInfo ? (
        <div className="gap-spacing-lg hidden md:flex">
          <Button className="font-noto-serif-jp heading-5" onClick={handleLogin}>
            {t("login")}
          </Button>
          <Button className="font-noto-serif-jp heading-5" buttonType="primary" onClick={handleContact}>
            {t("contact")}
          </Button>
        </div>
      ) : (
        userData && (
          <div className="hidden max-w-[70vw] items-center gap-12 md:flex">
            <div>
              <span className="text-2 block text-white">{t("userName", { name: userData?.full_name ?? "" })}</span>
              <span className="text-2 mt-2 block text-white">{t("userId", { id: userData?.member_id ?? "" })}</span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Header;
