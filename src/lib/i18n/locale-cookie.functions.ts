import { createServerFn } from "@tanstack/react-start";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, parseLocaleCookie, type Locale } from "@/lib/i18n/locale";

/** Read the locale cookie on the server. Kept out of client modules so SSR imports stay server-only. */
export const readLocaleCookieFn = createServerFn({ method: "GET" }).handler(async (): Promise<Locale> => {
  const { getCookie, getRequestHeader } = await import("@tanstack/react-start/server");
  const fromNamed = getCookie(LOCALE_COOKIE);
  if (isLocale(fromNamed)) return fromNamed;
  return parseLocaleCookie(getRequestHeader("cookie")) || DEFAULT_LOCALE;
});
