import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSiteSettings } from "@/hooks/use-cms";
import { whatsAppHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useLocale } from "@/providers/LocaleProvider";

export function WhatsAppButton() {
  const { data: settings } = useSiteSettings();
  const [mounted, setMounted] = useState(false);
  const { m, locale } = useLocale();
  const href = whatsAppHref(
    settings?.whatsappNumber,
    locale === "en" ? m.common.whatsappMessage : settings?.whatsappMessage,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="whatsapp-float">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={m.common.whatsapp}
        onClick={() => {
          void import("@/lib/firebase/analytics").then((m) =>
            m.trackWhatsAppClick("floating_button"),
          );
        }}
        className="whatsapp-float-btn"
      >
        <WhatsAppIcon className="whatsapp-float-icon" aria-hidden />
      </a>
    </div>,
    document.body,
  );
}
