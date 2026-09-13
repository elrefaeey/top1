import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  applyDocumentLocale,
  DEFAULT_LOCALE,
  persistLocale,
  readStoredLocale,
  type Locale,
} from "@/lib/i18n/locale";
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

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    applyDocumentLocale(stored);
  }, []);

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
