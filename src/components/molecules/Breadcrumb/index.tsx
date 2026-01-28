"use client";

import Link from "next/link";
import React from "react";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: string | React.ReactNode;
  className?: string;
  autoGenerate?: boolean;
  isBasePath?: boolean;
  renderAsString?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator = ">", className = "", autoGenerate = false, isBasePath = true, renderAsString = false }) => {
  const autoBreadcrumbItems = useBreadcrumb(isBasePath);
  const breadcrumbItems = autoGenerate ? autoBreadcrumbItems : items || [];

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  if (renderAsString) {
    return (
      <nav className={`text-cream inline ${className}`} style={{ lineHeight: "0.8" }} aria-label="Breadcrumb">
        {breadcrumbItems.map((item, index) => (
          <span key={index} className="inline">
            {item.icon && <span className="inline shrink-0">{item.icon}</span>}
            {item.href && !item.isActive ? (
              item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-1-10 text-cream font-noto-sans-jp inline cursor-pointer transition-colors duration-200 hover:text-gray-300 hover:underline"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="text-1-10 text-cream font-noto-sans-jp inline transition-colors duration-200 hover:text-gray-300 hover:underline"
                >
                  {item.label}
                </Link>
              )
            ) : (
              <span className={`text-1-10 ${item.isActive ? "text-cream" : "text-gray-500"} inline`} aria-current={item.isActive ? "page" : undefined}>
                {item.label}
              </span>
            )}
            {index < breadcrumbItems.length - 1 && (
              <span className="text-1-10 inline text-center select-none md:mx-1" aria-hidden="true">
                {" "}
                {separator}{" "}
              </span>
            )}
          </span>
        ))}
      </nav>
    );
  }

  return (
    <nav className={`text-cream flex items-center ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="text-1 mx-1 select-none" aria-hidden="true">
                {separator}
              </span>
            )}
            <div className="flex items-center">
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {item.href && !item.isActive ? (
                <>
                  {item?.onClick ? (
                    <div
                      className="text-1 text-cream flex cursor-pointer items-center transition-colors duration-200 hover:text-gray-500 hover:underline"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </div>
                  ) : (
                    <Link href={item.href} className={`text-1 text-cream flex items-center transition-colors duration-200 hover:text-gray-500 hover:underline`}>
                      {item.label}
                    </Link>
                  )}
                </>
              ) : (
                <span
                  className={`text-1 ${item.isActive ? "text-cream" : "text-gray-500"} text-cream flex items-center`}
                  aria-current={item.isActive ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
