import Link, { LinkProps } from "next/link";
import React from "react";

type CustomLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
} & LinkProps;

const CustomLink = ({ href, className, children, style }: CustomLinkProps) => {
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
};

export default CustomLink;
