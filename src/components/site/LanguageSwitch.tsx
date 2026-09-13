import { useLocale } from "@/providers/LocaleProvider";

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale, m } = useLocale();

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={m.lang.group} dir="ltr">
      <button
        type="button"
        className="lang-switch-opt"
        data-active={locale === "en"}
        aria-pressed={locale === "en"}
        aria-label={m.lang.switchToEn}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className="lang-switch-opt"
        data-active={locale === "ar"}
        aria-pressed={locale === "ar"}
        aria-label={m.lang.switchToAr}
        onClick={() => setLocale("ar")}
      >
        ع
      </button>
    </div>
  );
}
