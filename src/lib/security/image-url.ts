/** Shared image URL guards for CMS / uploads. */

const ALLOWED_HTTP = /^https?:\/\//i;
const DATA_IMAGE = /^data:image\//i;

export function isDataImageUrl(value: string): boolean {
  return DATA_IMAGE.test(value.trim());
}

export function isHttpImageUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return ALLOWED_HTTP.test(v);
  }
}

/** Public/CMS content must use hosted URLs — refuse Base64 data URLs. */
export function assertPublicImageUrl(value: string, fieldLabel = "الصورة"): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (isDataImageUrl(trimmed)) {
    throw new Error(`${fieldLabel}: لا يُسمح بصور Base64. ارفع الصورة إلى Storage واستخدم الرابط.`);
  }
  if (!isHttpImageUrl(trimmed) && !trimmed.startsWith("/")) {
    throw new Error(`${fieldLabel}: رابط غير صالح`);
  }
  return trimmed;
}

export function rejectBase64InPayload(data: Record<string, unknown>, keys: string[]): void {
  for (const key of keys) {
    const val = data[key];
    if (typeof val === "string" && isDataImageUrl(val)) {
      throw new Error(`${key}: لا يُسمح بصور Base64 في المحتوى المنشور — استخدم رابط Storage.`);
    }
  }
}
