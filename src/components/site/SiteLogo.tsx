import { SITE_LOGO_URL, SITE_NAME } from "@/lib/site-config";
import { useSiteSettings } from "@/hooks/use-cms";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  showName?: boolean;
};

export function SiteLogo({ className, imageClassName, showName = true }: SiteLogoProps) {
  const { data: settings } = useSiteSettings();
  const brandName = settings?.siteName || SITE_NAME;
  // لوجو ثابت شفاف من الملفات العامة — لا يُستبدل من CMS
  const logoUrl = SITE_LOGO_URL;

  return (
    <span className={cn("flex items-center gap-2.5 min-w-0", className)}>
      <img
        src={logoUrl}
        alt=""
        aria-hidden
        className={cn(
          "h-12 w-auto max-w-[10rem] shrink-0 object-contain object-center bg-transparent",
          imageClassName,
        )}
        width={160}
        height={48}
        decoding="async"
      />
      {showName && (
        <span
          dir="ltr"
          className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground truncate"
        >
          {brandName}
        </span>
      )}
    </span>
  );
}
