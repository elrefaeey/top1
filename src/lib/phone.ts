import {
  SITE_CONTACT_PHONE,
  SITE_CONTACT_PHONE_SA,
  SITE_WHATSAPP_NUMBER,
} from "@/lib/site-config";

/** يستخرج الأرقام فقط */
export function digitsOnly(raw?: string | null): string {
  return (raw || "").replace(/\D/g, "");
}

/**
 * يوحّد أرقام الخليج للاتصال الدولي (بدون +):
 * - الإمارات 971…
 * - السعودية 966…
 */
export function normalizeIntlPhone(
  raw?: string | null,
  fallback: string = SITE_WHATSAPP_NUMBER,
): string {
  const digits = digitsOnly(raw || fallback);
  if (!digits) return digitsOnly(fallback) || SITE_WHATSAPP_NUMBER;

  if (digits.startsWith("971")) return digits;
  if (digits.startsWith("966")) return digits;

  const fb = digitsOnly(fallback);
  const preferUae = fb.startsWith("971");

  // محلي خليجي 05xxxxxxxx — البلد من الـ fallback
  if (digits.startsWith("05") && digits.length === 10) {
    return preferUae ? `971${digits.slice(1)}` : `966${digits.slice(1)}`;
  }

  if (digits.startsWith("5") && digits.length === 9) {
    return preferUae ? `971${digits}` : `966${digits}`;
  }

  return digits;
}

/** @deprecated استخدم normalizeIntlPhone — يبقي التوافق مع الاستدعاءات القديمة */
export function normalizeSaudiPhone(
  raw?: string | null,
  fallback = SITE_CONTACT_PHONE_SA,
): string {
  return normalizeIntlPhone(raw, fallback);
}

/** رابط اتصال دولي */
export function telHref(raw?: string | null, fallback?: string): string {
  return `tel:+${normalizeIntlPhone(raw, fallback ?? SITE_CONTACT_PHONE)}`;
}

/** عرض دولي منسّق */
export function formatIntlPhone(raw?: string | null, fallback?: string): string {
  const n = normalizeIntlPhone(raw, fallback ?? SITE_CONTACT_PHONE);
  if (n.startsWith("971") && n.length >= 12) {
    const local = n.slice(3);
    return `+971 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`.trim();
  }
  if (n.startsWith("966") && n.length >= 12) {
    const local = n.slice(3);
    return `+966 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`.trim();
  }
  return `+${n}`;
}

/** @deprecated استخدم formatIntlPhone */
export function formatSaudiPhoneIntl(raw?: string | null): string {
  return formatIntlPhone(raw, SITE_CONTACT_PHONE_SA);
}

export function formatUaePhoneIntl(raw?: string | null): string {
  return formatIntlPhone(raw ?? SITE_CONTACT_PHONE, SITE_CONTACT_PHONE);
}

export function formatSaPhoneIntl(raw?: string | null): string {
  return formatIntlPhone(raw ?? SITE_CONTACT_PHONE_SA, SITE_CONTACT_PHONE_SA);
}
