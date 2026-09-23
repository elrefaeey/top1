export type Locale = "ar" | "en";

export const LOCALE_COOKIE = "top1_locale";
export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function localeLang(locale: Locale): "ar" | "en" {
  return locale;
}

export function localeDateTag(locale: Locale): string {
  return locale === "ar" ? "ar-SA" : "en-GB";
}

export function parseLocaleCookie(cookieHeader: string | null | undefined): Locale {
  const match = cookieHeader?.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : "";
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function readStoredLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const fromDom = document.documentElement.lang;
  if (isLocale(fromDom)) return fromDom;
  const fromCookie = parseLocaleCookie(document.cookie);
  if (fromCookie !== DEFAULT_LOCALE) return fromCookie;
  try {
    const fromStorage = localStorage.getItem(LOCALE_COOKIE);
    if (isLocale(fromStorage)) return fromStorage;
  } catch {
    /* private mode */
  }
  return DEFAULT_LOCALE;
}

export function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  try {
    localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    /* private mode */
  }
}

export function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = localeLang(locale);
  document.documentElement.dir = localeDir(locale);
}

/** Prefer `/ar` or `/en` URL path over cookie so SSR HTML lang matches the indexed URL. */
export const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var p=location.pathname;var l=(p==="/en"||p.indexOf("/en/")===0)?"en":(p==="/ar"||p.indexOf("/ar/")===0)?"ar":null);if(!l){var m=document.cookie.match(/(?:^|; )top1_locale=([^;]*)/);l=m?decodeURIComponent(m[1]):"ar";}if(l!=="en"&&l!=="ar")l="ar";document.documentElement.lang=l;document.documentElement.dir=l==="en"?"ltr":"rtl";}catch(e){}})();`;
