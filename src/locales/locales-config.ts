import { defineRouting } from "next-intl/routing";

export const localesConfig = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ja"],

  // Used when no locale matches
  defaultLocale: "ja",
});
