import type { SiteSettings } from "@/types/cms";
import {
  SITE_ADDRESS,
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site-config";

const STALE_PHONE_FRAGMENTS = ["549881368", "0549881368", "966549881368"];

function digitsOnly(value?: string | null): string {
  return (value || "").replace(/\D/g, "");
}

function isStalePhone(value?: string | null): boolean {
  const d = digitsOnly(value);
  if (!d) return true;
  return STALE_PHONE_FRAGMENTS.some((frag) => d.includes(frag.replace(/\D/g, "")));
}

/** يوحّد بيانات الاتصال للعرض العام (يتجاوز الأرقام القديمة في CMS). */
export function normalizePublicSiteSettings(raw: SiteSettings | null | undefined): SiteSettings | null {
  if (!raw) return null;

  const phone = isStalePhone(raw.contactPhone) ? SITE_CONTACT_PHONE : (raw.contactPhone.trim() || SITE_CONTACT_PHONE);
  const whatsapp = isStalePhone(raw.whatsappNumber)
    ? SITE_WHATSAPP_NUMBER
    : (raw.whatsappNumber.trim() || SITE_WHATSAPP_NUMBER);

  return {
    ...raw,
    contactPhone: phone,
    whatsappNumber: whatsapp.startsWith("966") ? whatsapp : SITE_WHATSAPP_NUMBER,
    contactEmail: raw.contactEmail?.trim() || SITE_CONTACT_EMAIL,
    address: raw.address?.trim() || SITE_ADDRESS,
    robotsTxt:
      raw.robotsTxt?.includes("vercel.app") || !raw.robotsTxt?.trim()
        ? `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://top1markting.com/sitemap.xml`
        : raw.robotsTxt,
  };
}
