import { createNavigation } from "next-intl/navigation";
import { localesConfig } from "./locales-config";

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(localesConfig);
