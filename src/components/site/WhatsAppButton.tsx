import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSiteSettings } from "@/hooks/use-cms";
import { trackWhatsAppClick } from "@/lib/firebase/analytics";
import { SITE_NAME } from "@/lib/site-config";
import { whatsAppHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

const DEFAULT_MESSAGE = `مرحباً ${SITE_NAME}، أود مناقشة مشروع.`;

export function WhatsAppButton() {
  const { data: settings } = useSiteSettings();
  const [mounted, setMounted] = useState(false);
  const href = whatsAppHref(settings?.whatsappNumber, DEFAULT_MESSAGE);

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
        aria-label="تواصل عبر واتساب"
        onClick={() => trackWhatsAppClick("floating_button")}
        className="whatsapp-float-btn"
      >
        <WhatsAppIcon className="whatsapp-float-icon" />
      </a>
    </div>,
    document.body,
  );
}
