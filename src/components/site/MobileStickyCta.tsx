import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-cms";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { SITE_CONTACT_PHONE, SITE_CONTACT_PHONE_SA } from "@/lib/site-config";
import { telHref } from "@/lib/phone";
import { whatsAppHref } from "@/lib/whatsapp";

/** شريط تحويل ثابت للجوال — واتساب + اتصال */
export function MobileStickyCta() {
  const { data: settings } = useSiteSettings();
  const wa = whatsAppHref(settings?.whatsappNumber, settings?.whatsappMessage);
  const phone = settings?.contactPhoneSa || settings?.contactPhone || SITE_CONTACT_PHONE_SA;

  return (
    <div className="mobile-sticky-cta" role="region" aria-label="تواصل سريع">
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-sticky-cta-wa"
        onClick={() => {
          void import("@/lib/firebase/analytics").then((m) =>
            m.trackWhatsAppClick("mobile_sticky_cta"),
          );
        }}
      >
        <WhatsAppIcon className="h-5 w-5" aria-hidden />
        واتساب
      </a>
      <a href={telHref(phone, SITE_CONTACT_PHONE_SA)} className="mobile-sticky-cta-call">
        <Phone className="h-4 w-4" aria-hidden />
        اتصال
      </a>
      <Link to="/contact" className="mobile-sticky-cta-form">
        طلب عرض
      </Link>
      <span className="sr-only">أو اتصل بالإمارات {SITE_CONTACT_PHONE}</span>
    </div>
  );
}
