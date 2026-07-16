export type LeadInput = {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  source?: string;
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s()-]{7,30}$/;

export function stripControlChars(value: string): string {
  // Intentionally strips C0 controls (excluding TAB/LF/CR) from user input.
  // eslint-disable-next-line no-control-regex -- security: neutralize control chars in leads
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export function validateLeadInput(raw: LeadInput): LeadInput {
  const name = stripControlChars(raw.name ?? "").trim();
  const email = stripControlChars(raw.email ?? "")
    .trim()
    .toLowerCase();
  const phone = stripControlChars(raw.phone ?? "").trim();
  const message = stripControlChars(raw.message ?? "").trim();
  const source = stripControlChars(raw.source ?? "contact_form").trim() || "contact_form";

  if (!name || name.length > 120) {
    throw new Error("الاسم غير صالح");
  }
  if (!phone || !PHONE_RE.test(phone)) {
    throw new Error("رقم الجوال غير صالح");
  }
  if (email && (email.length > 254 || !EMAIL_RE.test(email))) {
    throw new Error("البريد الإلكتروني غير صالح");
  }
  if (!message || message.length > 5000) {
    throw new Error("الرسالة غير صالحة");
  }
  if (source.length > 64) {
    throw new Error("مصدر غير صالح");
  }

  return {
    name,
    email: email || undefined,
    phone,
    message,
    source,
  };
}

export function isHoneypotTriggered(website?: string): boolean {
  return Boolean(website && website.trim().length > 0);
}

export function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
