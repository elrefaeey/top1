import type { Locale } from "@/lib/i18n/locale";

const AR_PREFIX = "/ar";
const EN_PREFIX = "/en";

/** Paths that should never get a locale prefix (admin, APIs, assets). */
export function isLocaleExemptPath(pathname: string): boolean {
  const path = pathname.split("?")[0] || "/";
  return (
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/media") ||
    path === "/sitemap.xml" ||
    path === "/robots.txt"
  );
}

function hasPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** Detect locale from the URL path (`/ar/...` → ar, `/en/...` → en). */
export function getPathLocale(pathname: string): Locale {
  const path = pathname.split("?")[0] || "/";
  if (hasPrefix(path, EN_PREFIX)) return "en";
  if (hasPrefix(path, AR_PREFIX)) return "ar";
  // Legacy unprefixed public URLs are Arabic (until 301 to /ar/...).
  return "ar";
}

/** Strip `/ar` or `/en` prefix → bare path (`/blog/x`). */
export function stripLocalePrefix(pathname: string): string {
  const path = pathname.split("?")[0] || "/";
  for (const prefix of [EN_PREFIX, AR_PREFIX]) {
    if (path === prefix) return "/";
    if (path.startsWith(`${prefix}/`)) {
      const rest = path.slice(prefix.length);
      return rest.startsWith("/") ? rest : `/${rest}`;
    }
  }
  return path || "/";
}

/** Build a public path for the given locale. Always uses `/ar` or `/en`. */
export function withLocalePrefix(locale: Locale, pathname: string): string {
  const base = stripLocalePrefix(pathname);
  if (isLocaleExemptPath(base)) return base;
  const prefix = locale === "en" ? EN_PREFIX : AR_PREFIX;
  // Home is `/ar` and `/en` (TanStack trailingSlash: never).
  return base === "/" ? prefix : `${prefix}${base}`;
}

/** Switch the current path to the other locale (same page). */
export function alternateLocalePath(pathname: string, targetLocale: Locale): string {
  return withLocalePrefix(targetLocale, pathname);
}

/**
 * If this is a legacy unprefixed public URL, return the `/ar/...` target.
 * Returns null when already localized or exempt (no redirect).
 */
export function legacyToArabicPath(pathname: string): string | null {
  const path = (pathname.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  if (isLocaleExemptPath(path)) return null;
  if (hasPrefix(path, AR_PREFIX) || hasPrefix(path, EN_PREFIX)) return null;
  return withLocalePrefix("ar", path === "/" ? "/" : path);
}

/** Absolute-path hreflang pair (both locales prefixed). */
export function hreflangPair(anyPath: string): { ar: string; en: string; xDefault: string } {
  const base = stripLocalePrefix(anyPath);
  const ar = withLocalePrefix("ar", base);
  return {
    ar,
    en: withLocalePrefix("en", base),
    xDefault: ar,
  };
}
