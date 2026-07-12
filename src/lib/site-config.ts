/** اسم الموقع الرسمي */
export const SITE_NAME = "Top1Markting";

/** حساب تويتر */
export const SITE_TWITTER = "@Top1Markting";

/** مسار اللوجو الافتراضي (شفاف — public/logo.png) */
export const SITE_LOGO_URL = "/logo.png";

/** رقم واتساب السعودي (966 + بدون صفر) */
export const SITE_WHATSAPP_NUMBER = "966537309257";

/** الرسالة الافتراضية عند فتح واتساب */
export const SITE_WHATSAPP_MESSAGE =
  "مرحباً Top1Markting، أحتاج معلومات عن خدماتكم.";

/** رقم التواصل المحلي */
export const SITE_CONTACT_PHONE = "0537309257";

/** البريد الرسمي */
export const SITE_CONTACT_EMAIL = "top11markting@gmail.com";

/** العنوان الافتراضي */
export const SITE_ADDRESS = "الرياض، المملكة العربية السعودية";

/** الدومين الإنتاجي المعتمد لـ SEO / Sitemap / Canonical */
export const SITE_PRODUCTION_URL = "https://www.top1markting.com";

/**
 * يوحّد رابط الموقع العام ويرفض vercel/localhost في الإنتاج.
 * محلياً: يسمح بـ localhost فقط.
 */
export function resolvePublicSiteUrl(raw?: string | null): string {
  const fallback = SITE_PRODUCTION_URL;
  const value = (raw || "").trim().replace(/\/$/, "");
  if (!value) return fallback;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();

    if (host === "localhost" || host === "127.0.0.1") {
      return value;
    }

    if (host.includes("vercel.app") || host.includes("vercel.com")) {
      return fallback;
    }

    if (host === "top1markting.com" || host === "www.top1markting.com") {
      return SITE_PRODUCTION_URL;
    }

    return fallback;
  } catch {
    return fallback;
  }
}
