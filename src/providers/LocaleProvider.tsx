import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  applyDocumentLocale,
  DEFAULT_LOCALE,
  persistLocale,
  readStoredLocale,
  type Locale,
} from "@/lib/i18n/locale";
import { getPathLocale, isLocaleExemptPath } from "@/lib/i18n/locale-path";
import { getMessages, interpolate, type Messages } from "@/lib/i18n/messages";
import { getAdminMessages, type AdminMessages } from "@/lib/i18n/admin-messages";

type LocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  m: Messages;
  admin: AdminMessages;
  setLocale: (locale: Locale) => void;
  t: (template: string, vars?: Record<string, string | number>) => string;
  labelForHref: (href: string, fallback: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function localeFromLocation(pathname: string): Locale {
  if (isLocaleExemptPath(pathname)) return readStoredLocale();
  return getPathLocale(pathname);
}

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const next = localeFromLocation(pathname);
    setLocaleState(next);
    applyDocumentLocale(next);
    if (!isLocaleExemptPath(pathname)) {
      persistLocale(next);
    }
  }, [pathname]);

  const value = useMemo<LocaleContextValue>(() => {
    const m = getMessages(locale);
    return {
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      m,
      admin: getAdminMessages(locale),
      setLocale: (next) => {
        setLocaleState(next);
        persistLocale(next);
        applyDocumentLocale(next);
      },
      t: (template, vars) => interpolate(template, vars),
      labelForHref: (href, fallback) => {
        const map = m.href as Record<string, string>;
        return map[href] ?? fallback;
      },
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

/** Admin and other trees without LocaleProvider stay Arabic. */
export function useLocaleOptional(): Locale {
  return useContext(LocaleContext)?.locale ?? DEFAULT_LOCALE;
}

export function useT() {
  const ctx = useContext(LocaleContext);
  return ctx?.m ?? getMessages(DEFAULT_LOCALE);
}

export function useAdminI18n() {
  const ctx = useContext(LocaleContext);
  const locale = ctx?.locale ?? DEFAULT_LOCALE;
  return {
    locale,
    dir: (ctx?.dir ?? (locale === "ar" ? "rtl" : "ltr")) as "rtl" | "ltr",
    a: ctx?.admin ?? getAdminMessages(locale),
    t: ctx?.t ?? ((template: string, vars?: Record<string, string | number>) => interpolate(template, vars)),
  };
}
