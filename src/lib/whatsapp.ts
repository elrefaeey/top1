import { SITE_WHATSAPP_MESSAGE, SITE_WHATSAPP_NUMBER } from "@/lib/site-config";

export function normalizeWhatsAppNumber(raw?: string | null): string {
  const digits = (raw || SITE_WHATSAPP_NUMBER).replace(/\D/g, "");
  if (!digits) return SITE_WHATSAPP_NUMBER;

  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("05")) return `966${digits.slice(1)}`;
  if (digits.startsWith("5") && digits.length === 9) return `966${digits}`;

  return digits;
}

export function resolveWhatsAppMessage(message?: string | null): string {
  const trimmed = message?.trim();
  return trimmed || SITE_WHATSAPP_MESSAGE;
}

export function whatsAppHref(number?: string | null, message?: string | null): string {
  const normalized = normalizeWhatsAppNumber(number);
  const text = resolveWhatsAppMessage(message);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
