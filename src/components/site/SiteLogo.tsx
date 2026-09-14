import {
  SITE_LOGO_LIGHT_URL,
  SITE_LOGO_MARK_LIGHT_URL,
  SITE_LOGO_MARK_URL,
  SITE_LOGO_URL,
  SITE_NAME,
} from "@/lib/site-config";
import { useSiteSettings } from "@/hooks/use-cms";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  /** Show text name next to logo — off by default (wordmark is in the artwork). */
  showName?: boolean;
  /** Full wordmark logo vs compact mark. */
  variant?: "full" | "mark";
  /** Use light artwork on dark backgrounds. */
  tone?: "default" | "light";
};

export function SiteLogo({
  className,
  imageClassName,
  showName = false,
  variant = "full",
  tone = "default",
}: SiteLogoProps) {
  const { data: settings } = useSiteSettings();
  const brandName = settings?.siteName || SITE_NAME;

  const logoUrl =
    variant === "mark"
      ? tone === "light"
        ? SITE_LOGO_MARK_LIGHT_URL
        : SITE_LOGO_MARK_URL
      : tone === "light"
        ? SITE_LOGO_LIGHT_URL
        : SITE_LOGO_URL;

  return (
    <span className={cn("flex items-center gap-2.5 min-w-0", className)}>
      <img
        src={logoUrl}
        alt={brandName}
        className={cn(
          variant === "mark"
            ? "h-9 w-9 shrink-0 object-contain object-center bg-transparent"
            : "h-11 w-auto max-w-[9.5rem] shrink-0 object-contain object-center bg-transparent sm:h-12 sm:max-w-[11rem]",
          imageClassName,
        )}
        width={variant === "mark" ? 72 : 176}
        height={variant === "mark" ? 72 : 48}
        decoding="async"
      />
      {showName && (
        <span
          dir="ltr"
          className="font-display truncate text-base font-bold tracking-tight text-primary sm:text-lg"
        >
          {brandName}
        </span>
      )}
    </span>
  );
}
