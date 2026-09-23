import { useRouter, useRouterState } from "@tanstack/react-router";
import { alternateLocalePath, isLocaleExemptPath } from "@/lib/i18n/locale-path";
import type { Locale } from "@/lib/i18n/locale";
import { useLocale } from "@/providers/LocaleProvider";

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale, m } = useLocale();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function go(target: Locale) {
    if (target === locale) return;
    setLocale(target);
    if (isLocaleExemptPath(pathname)) return;
    const next = alternateLocalePath(pathname, target);
    if (next !== pathname) {
      void router.history.push(next);
    }
  }

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={m.lang.group} dir="ltr">
      <button
        type="button"
        className="lang-switch-opt"
        data-active={locale === "en"}
        aria-pressed={locale === "en"}
        aria-label={m.lang.switchToEn}
        onClick={() => go("en")}
      >
        EN
      </button>
      <button
        type="button"
        className="lang-switch-opt"
        data-active={locale === "ar"}
        aria-pressed={locale === "ar"}
        aria-label={m.lang.switchToAr}
        onClick={() => go("ar")}
      >
        ع
      </button>
    </div>
  );
}
