import { readLocaleCookieFn } from "@/lib/i18n/locale-cookie.functions";
import { DEFAULT_LOCALE, parseLocaleCookie, type Locale } from "@/lib/i18n/locale";
import { getPathLocale, isLocaleExemptPath } from "@/lib/i18n/locale-path";

/**
 * Locale for SSR/head: URL path wins for public pages (`/ar/...` → ar, `/en/...` → en).
 * Admin and exempt paths still fall back to the locale cookie.
 */
export async function resolveRequestLocale(pathnameHint?: string): Promise<Locale> {
  const path = pathnameHint || (typeof window !== "undefined" ? window.location.pathname : "");
  if (path && !isLocaleExemptPath(path)) return getPathLocale(path);
  if (!import.meta.env.SSR && typeof document !== "undefined") {
    return parseLocaleCookie(document.cookie);
  }
  try {
    return await readLocaleCookieFn();
  } catch {
    return DEFAULT_LOCALE;
  }
}
