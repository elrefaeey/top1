import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, parseLocaleCookie, type Locale } from "@/lib/i18n/locale";
import { getPathLocale, isLocaleExemptPath } from "@/lib/i18n/locale-path";

/**
 * Locale for SSR/head: URL path wins for public pages (`/ar/...` → ar, `/en/...` → en).
 * Admin and exempt paths still fall back to the locale cookie.
 */
export async function resolveRequestLocale(pathnameHint?: string): Promise<Locale> {
  if (pathnameHint) {
    if (isLocaleExemptPath(pathnameHint)) {
      return await resolveCookieLocale();
    }
    return getPathLocale(pathnameHint);
  }

  if (!import.meta.env.SSR) {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (isLocaleExemptPath(path)) return resolveCookieLocaleSync();
      return getPathLocale(path);
    }
    return DEFAULT_LOCALE;
  }

  try {
    const { getRequestUrl } = await import("@tanstack/react-start/server");
    const url = getRequestUrl();
    const path = url.pathname;
    if (isLocaleExemptPath(path)) return await resolveCookieLocale();
    return getPathLocale(path);
  } catch {
    return await resolveCookieLocale();
  }
}

async function resolveCookieLocale(): Promise<Locale> {
  try {
    const { getCookie, getRequestHeader } = await import("@tanstack/react-start/server");
    const fromNamed = getCookie(LOCALE_COOKIE);
    if (isLocale(fromNamed)) return fromNamed;
    const header = getRequestHeader("cookie");
    return parseLocaleCookie(header);
  } catch {
    return DEFAULT_LOCALE;
  }
}

function resolveCookieLocaleSync(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  return parseLocaleCookie(document.cookie);
}
