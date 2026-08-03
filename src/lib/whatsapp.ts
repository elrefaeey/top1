import { SITE_WHATSAPP_MESSAGE, SITE_WHATSAPP_NUMBER } from "@/lib/site-config";
import { normalizeIntlPhone } from "@/lib/phone";

export function normalizeWhatsAppNumber(raw?: string | null): string {
  return normalizeIntlPhone(raw, SITE_WHATSAPP_NUMBER);
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
