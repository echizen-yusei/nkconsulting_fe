import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { localesConfig } from "./locales-config";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(localesConfig.locales, requested)
    ? requested
    : localesConfig.defaultLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
