import { SITE_CONTACT_PHONE } from "@/lib/site-config";

/** أرقام سعودية → 966XXXXXXXXX (بدون +) */
export function normalizeSaudiPhone(raw?: string | null, fallback = SITE_CONTACT_PHONE): string {
  const digits = (raw || fallback).replace(/\D/g, "");
  if (!digits) return "966537309257";

  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("05")) return `966${digits.slice(1)}`;
  if (digits.startsWith("5") && digits.length === 9) return `966${digits}`;

  return digits;
}

/** رابط اتصال دولي بكود السعودية */
export function telHref(raw?: string | null): string {
  return `tel:+${normalizeSaudiPhone(raw)}`;
}

/** عرض دولي: +966 53 730 9257 */
export function formatSaudiPhoneIntl(raw?: string | null): string {
  const n = normalizeSaudiPhone(raw);
  if (n.startsWith("966") && n.length >= 12) {
    const local = n.slice(3);
    return `+966 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`.trim();
  }
  return `+${n}`;
}
