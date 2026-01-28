import Link from "next/link";
import React from "react";

type ButtonUnderlineProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const ButtonUnderline = ({ href, children, className }: ButtonUnderlineProps) => {
  return (
    <>
      <Link href={href} className={`text-cream text-2 pointer-events-auto inline underline hover:opacity-70 md:hidden ${className}`}>
        {children}
      </Link>
      <Link href={href} className={`text-cream text-1 pointer-events-auto hidden underline hover:opacity-70 md:inline ${className}`}>
        {children}
      </Link>
    </>
  );
};

export default ButtonUnderline;
