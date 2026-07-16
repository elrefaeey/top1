import type { SiteSettings } from "@/types/cms";
import {
  SITE_ADDRESS,
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE,
  SITE_LOGO_URL,
  SITE_WHATSAPP_MESSAGE,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site-config";

const STALE_PHONE_FRAGMENTS = ["549881368", "0549881368", "966549881368"];

const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /api

Sitemap: https://www.top1markting.com/sitemap.xml`;

function digitsOnly(value?: string | null): string {
  return (value || "").replace(/\D/g, "");
}

function isStalePhone(value?: string | null): boolean {
  const d = digitsOnly(value);
  if (!d) return true;
  return STALE_PHONE_FRAGMENTS.some((frag) => d.includes(frag.replace(/\D/g, "")));
}

function ensureCrawlBlocksInRobots(robotsTxt: string): string {
  let next = robotsTxt.trim();
  if (!/Disallow:\s*\/admin/i.test(next)) {
    if (/^Sitemap:/im.test(next)) {
      next = next.replace(/^Sitemap:/im, "Disallow: /admin\nDisallow: /admin/\n\nSitemap:");
    } else {
      next = `${next}\nDisallow: /admin\nDisallow: /admin/\n`;
    }
  }
  if (!/Disallow:\s*\/api/i.test(next)) {
    if (/^Sitemap:/im.test(next)) {
      next = next.replace(/^Sitemap:/im, "Disallow: /api/\nDisallow: /api\n\nSitemap:");
    } else {
      next = `${next}\nDisallow: /api/\nDisallow: /api\n`;
    }
  }
  return next;
}

/** يوحّد بيانات الاتصال للعرض العام (يتجاوز الأرقام القديمة في CMS). */
export function normalizePublicSiteSettings(
  raw: SiteSettings | null | undefined,
): SiteSettings | null {
  if (!raw) return null;

  const phone = isStalePhone(raw.contactPhone)
    ? SITE_CONTACT_PHONE
    : raw.contactPhone.trim() || SITE_CONTACT_PHONE;
  const whatsapp = isStalePhone(raw.whatsappNumber)
    ? SITE_WHATSAPP_NUMBER
    : raw.whatsappNumber.trim() || SITE_WHATSAPP_NUMBER;

  const robotsRaw = raw.robotsTxt?.trim() || "";
  const robotsTxt =
    robotsRaw.includes("vercel.app") ||
    robotsRaw.includes("top1-ten") ||
    !robotsRaw.includes("www.top1markting.com/sitemap.xml") ||
    !robotsRaw
      ? DEFAULT_ROBOTS_TXT
      : ensureCrawlBlocksInRobots(robotsRaw);

  return {
    ...raw,
    logoUrl: SITE_LOGO_URL,
    faviconUrl: SITE_LOGO_URL,
    contactPhone: phone,
    whatsappNumber: whatsapp.startsWith("966") ? whatsapp : SITE_WHATSAPP_NUMBER,
    whatsappMessage: raw.whatsappMessage?.trim() || SITE_WHATSAPP_MESSAGE,
    contactEmail: raw.contactEmail?.trim() || SITE_CONTACT_EMAIL,
    address: raw.address?.trim() || SITE_ADDRESS,
    robotsTxt,
  };
}
